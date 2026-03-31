import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { SysRole } from "./role.entity";

@Entity("sys_user")
export class SysUser {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id!: number;

  @Column({ length: 50, unique: true, comment: "用户名" })
  username!: string;

  @Column({ length: 255, comment: "密码" })
  password!: string;

  @Column({ type: "varchar", length: 50, nullable: true, comment: "昵称" })
  nickname!: string | null;

  @Column({ type: "varchar", length: 20, nullable: true, comment: "手机号" })
  phone!: string | null;

  @Column({ type: "varchar", length: 100, nullable: true, comment: "邮箱" })
  email!: string | null;

  @Column({ type: "varchar", length: 255, nullable: true, comment: "头像" })
  avatar!: string | null;

  @Column({
    type: "tinyint",
    default: 1,
    name: "is_active",
    comment: "是否启用：1是 0否",
  })
  isActive!: number;

  @Column({
    type: "datetime",
    nullable: true,
    name: "last_login_at",
    comment: "最后登录时间",
  })
  lastLoginAt!: Date | null;

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

  // 关联角色
  @ManyToMany(() => SysRole)
  @JoinTable({
    name: "sys_user_role",
    joinColumn: { name: "user_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "role_id", referencedColumnName: "id" },
  })
  roles!: SysRole[];
}
