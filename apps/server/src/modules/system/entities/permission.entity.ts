import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("sys_permission")
export class SysPermission {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id!: number;

  @Column({
    type: "bigint",
    default: 0,
    name: "parent_id",
    comment: "父权限ID，0表示顶级",
  })
  parentId!: number;

  @Column({ length: 50, comment: "权限名称" })
  name!: string;

  @Column({ length: 100, unique: true, comment: "权限编码" })
  code!: string;

  @Column({ type: "tinyint", comment: "类型：1菜单 2按钮" })
  type!: number;

  @Column({
    type: "varchar",
    length: 255,
    nullable: true,
    comment: "前端路由路径",
  })
  path!: string | null;

  @Column({ type: "varchar", length: 100, nullable: true, comment: "图标" })
  icon!: string | null;

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
}
