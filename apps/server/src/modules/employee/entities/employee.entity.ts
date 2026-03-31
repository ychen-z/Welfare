import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { SysUser } from "../../system/entities/user.entity";

@Entity("employee")
export class Employee {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id!: number;

  @Column({ type: "bigint", unique: true, nullable: true, name: "user_id" })
  userId!: number | null;

  @Column({ type: "varchar", length: 50, unique: true, name: "employee_no" })
  employeeNo!: string;

  @Column({ type: "varchar", length: 50 })
  name!: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  department!: string | null;

  @Column({ type: "varchar", length: 100, nullable: true })
  position!: string | null;

  @Column({ type: "varchar", length: 20, nullable: true })
  phone!: string | null;

  @Column({ type: "varchar", length: 100, nullable: true })
  email!: string | null;

  @Column({ type: "date", nullable: true, name: "hire_date" })
  hireDate!: Date | null;

  @Column({ type: "tinyint", default: 1 })
  status!: number;

  @CreateDateColumn({ type: "datetime", name: "create_time" })
  createTime!: Date;

  @UpdateDateColumn({ type: "datetime", name: "update_time" })
  updateTime!: Date;

  @Column({ type: "tinyint", default: 0, name: "is_deleted" })
  isDeleted!: number;

  @ManyToOne(() => SysUser)
  @JoinColumn({ name: "user_id" })
  user?: SysUser;
}
