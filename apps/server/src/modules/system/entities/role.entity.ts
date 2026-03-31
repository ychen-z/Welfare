import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { SysPermission } from "./permission.entity";

@Entity("sys_role")
export class SysRole {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id!: number;

  @Column({ length: 50, comment: "角色名称" })
  name!: string;

  @Column({ length: 50, unique: true, comment: "角色编码" })
  code!: string;

  @Column({ type: "varchar", length: 200, nullable: true, comment: "角色描述" })
  description!: string | null;

  @Column({ type: "int", default: 0, comment: "排序" })
  sort!: number;

  @Column({
    type: "tinyint",
    default: 1,
    name: "is_active",
    comment: "是否启用：1是 0否",
  })
  isActive!: number;

  @CreateDateColumn({
    type: "datetime",
    name: "create_time",
    comment: "创建时间",
  })
  createTime!: Date;

  @UpdateDateColumn({
    type: "datetime",
    name: "update_time",
    comment: "更新时间",
  })
  updateTime!: Date;

  @Column({
    type: "tinyint",
    default: 0,
    name: "is_deleted",
    comment: "软删除：0否 1是",
  })
  isDeleted!: number;

  @ManyToMany(() => SysPermission)
  @JoinTable({
    name: "sys_role_permission",
    joinColumn: { name: "role_id" },
    inverseJoinColumn: { name: "permission_id" },
  })
  permissions!: SysPermission[];
}
