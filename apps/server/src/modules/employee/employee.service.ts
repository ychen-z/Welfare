import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Like } from "typeorm";
import { Employee } from "./entities/employee.entity";
import { CreateEmployeeDto } from "./dto/create-employee.dto";
import { UpdateEmployeeDto } from "./dto/update-employee.dto";
import { QueryEmployeeDto } from "./dto/query-employee.dto";

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
  ) {}

  async create(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    // 检查工号是否已存在
    const existing = await this.employeeRepository.findOne({
      where: { employeeNo: createEmployeeDto.employeeNo, isDeleted: 0 },
    });
    if (existing) {
      throw new ConflictException("工号已存在");
    }

    const employee = this.employeeRepository.create(createEmployeeDto);
    return await this.employeeRepository.save(employee);
  }

  async findAll(query: QueryEmployeeDto) {
    const {
      page = 1,
      pageSize = 20,
      keyword,
      department,
      status,
      sortBy = "createTime",
      sortOrder = "DESC",
    } = query;

    const qb = this.employeeRepository.createQueryBuilder("employee");

    // 基础查询条件
    qb.where("employee.isDeleted = :isDeleted", { isDeleted: 0 });

    // 搜索关键词（姓名或工号）
    if (keyword) {
      qb.andWhere(
        "(employee.name LIKE :keyword OR employee.employeeNo LIKE :keyword)",
        {
          keyword: `%${keyword}%`,
        },
      );
    }

    // 部门筛选
    if (department) {
      qb.andWhere("employee.department = :department", { department });
    }

    // 状态筛选
    if (status) {
      qb.andWhere("employee.status = :status", { status });
    }

    // 排序
    const orderField = `employee.${sortBy}`;
    qb.orderBy(orderField, sortOrder);

    // 分页
    qb.skip((page - 1) * pageSize).take(pageSize);

    const [list, total] = await qb.getManyAndCount();

    return {
      list,
      total,
      page,
      pageSize,
    };
  }

  async findOne(id: number): Promise<Employee> {
    const employee = await this.employeeRepository.findOne({
      where: { id, isDeleted: 0 },
      relations: ["user"],
    });

    if (!employee) {
      throw new NotFoundException("员工不存在");
    }

    return employee;
  }

  async update(
    id: number,
    updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<Employee> {
    const employee = await this.findOne(id);

    // 如果修改了工号，检查新工号是否已存在
    if (
      updateEmployeeDto.employeeNo &&
      updateEmployeeDto.employeeNo !== employee.employeeNo
    ) {
      const existing = await this.employeeRepository.findOne({
        where: { employeeNo: updateEmployeeDto.employeeNo, isDeleted: 0 },
      });
      if (existing) {
        throw new ConflictException("工号已存在");
      }
    }

    Object.assign(employee, updateEmployeeDto);
    return await this.employeeRepository.save(employee);
  }

  async remove(id: number): Promise<void> {
    const employee = await this.findOne(id);
    employee.isDeleted = 1;
    await this.employeeRepository.save(employee);
  }

  async updateStatus(id: number, status: number): Promise<Employee> {
    const employee = await this.findOne(id);
    employee.status = status;

    // 如果离职，同时禁用关联的用户账号
    if (status === 2 && employee.userId) {
      // 这里需要注入 UserRepository 或调用 UserService
      // 为了简化，暂时省略
    }

    return await this.employeeRepository.save(employee);
  }
}
