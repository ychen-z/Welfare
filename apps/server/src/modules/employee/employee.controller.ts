import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { EmployeeService } from "./employee.service";
import { CreateEmployeeDto } from "./dto/create-employee.dto";
import { UpdateEmployeeDto } from "./dto/update-employee.dto";
import { QueryEmployeeDto } from "./dto/query-employee.dto";
import { RequirePermission } from "../../common/decorators/require-permission.decorator";

@ApiTags("员工管理")
@ApiBearerAuth()
@Controller("employee")
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @RequirePermission("employee:create")
  @ApiOperation({ summary: "创建员工" })
  @ApiResponse({ status: 200, description: "创建成功" })
  async create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return await this.employeeService.create(createEmployeeDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @RequirePermission("employee:list")
  @ApiOperation({ summary: "获取员工列表" })
  @ApiResponse({ status: 200, description: "查询成功" })
  async findAll(@Query() query: QueryEmployeeDto) {
    return await this.employeeService.findAll(query);
  }

  @Get(":id")
  @HttpCode(HttpStatus.OK)
  @RequirePermission("employee:view")
  @ApiOperation({ summary: "获取员工详情" })
  @ApiResponse({ status: 200, description: "查询成功" })
  async findOne(@Param("id", ParseIntPipe) id: number) {
    return await this.employeeService.findOne(id);
  }

  @Put(":id")
  @HttpCode(HttpStatus.OK)
  @RequirePermission("employee:update")
  @ApiOperation({ summary: "更新员工信息" })
  @ApiResponse({ status: 200, description: "更新成功" })
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ) {
    return await this.employeeService.update(id, updateEmployeeDto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  @RequirePermission("employee:delete")
  @ApiOperation({ summary: "删除员工" })
  @ApiResponse({ status: 200, description: "删除成功" })
  async remove(@Param("id", ParseIntPipe) id: number) {
    await this.employeeService.remove(id);
    return null;
  }

  @Patch(":id/status")
  @HttpCode(HttpStatus.OK)
  @RequirePermission("employee:update")
  @ApiOperation({ summary: "更新员工状态" })
  @ApiResponse({ status: 200, description: "更新成功" })
  async updateStatus(
    @Param("id", ParseIntPipe) id: number,
    @Body("status", ParseIntPipe) status: number,
  ) {
    return await this.employeeService.updateStatus(id, status);
  }
}
