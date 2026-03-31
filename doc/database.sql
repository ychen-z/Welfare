-- ============================================================
-- 企业内部员工福利兑换平台 - 数据库设计
-- 创建时间：2026/3/31
-- 数据库：MySQL 8.0
-- 字符集：utf8mb4
-- ============================================================

-- 创建数据库
CREATE DATABASE IF NOT EXISTS `welfal` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `welfal`;

-- ============================================================
-- 系统模块 (sys_)
-- ============================================================

-- 管理员用户表
DROP TABLE IF EXISTS `sys_user`;
CREATE TABLE `sys_user` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键',
  `username` VARCHAR(50) NOT NULL COMMENT '用户名',
  `password` VARCHAR(255) NOT NULL COMMENT '密码（bcrypt加密）',
  `nickname` VARCHAR(50) DEFAULT NULL COMMENT '昵称',
  `phone` VARCHAR(20) DEFAULT NULL COMMENT '手机号',
  `email` VARCHAR(100) DEFAULT NULL COMMENT '邮箱',
  `avatar` VARCHAR(255) DEFAULT NULL COMMENT '头像URL',
  `is_active` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '是否启用：1是 0否',
  `last_login_at` DATETIME DEFAULT NULL COMMENT '最后登录时间',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `is_deleted` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '软删除：0否 1是',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_username` (`username`),
  KEY `idx_phone` (`phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='管理员用户表';

-- 员工表
DROP TABLE IF EXISTS `sys_employee`;
CREATE TABLE `sys_employee` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键',
  `employee_no` VARCHAR(50) NOT NULL COMMENT '工号',
  `name` VARCHAR(50) NOT NULL COMMENT '姓名',
  `phone` VARCHAR(20) NOT NULL COMMENT '手机号（登录账号）',
  `password` VARCHAR(255) NOT NULL COMMENT '密码（bcrypt加密）',
  `email` VARCHAR(100) DEFAULT NULL COMMENT '邮箱',
  `avatar` VARCHAR(255) DEFAULT NULL COMMENT '头像URL',
  `level_id` BIGINT DEFAULT NULL COMMENT '级别ID',
  `dept_name` VARCHAR(100) DEFAULT NULL COMMENT '部门名称',
  `entry_date` DATE DEFAULT NULL COMMENT '入职日期',
  `is_active` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '是否在职：1是 0否',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `is_deleted` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '软删除：0否 1是',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_employee_no` (`employee_no`),
  UNIQUE KEY `uk_phone` (`phone`),
  KEY `idx_level_id` (`level_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='员工表';

-- 角色表
DROP TABLE IF EXISTS `sys_role`;
CREATE TABLE `sys_role` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键',
  `name` VARCHAR(50) NOT NULL COMMENT '角色名称',
  `code` VARCHAR(50) NOT NULL COMMENT '角色编码',
  `description` VARCHAR(255) DEFAULT NULL COMMENT '描述',
  `sort` INT NOT NULL DEFAULT 0 COMMENT '排序',
  `is_active` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '是否启用：1是 0否',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `is_deleted` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '软删除：0否 1是',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='角色表';

-- 权限表
DROP TABLE IF EXISTS `sys_permission`;
CREATE TABLE `sys_permission` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键',
  `parent_id` BIGINT NOT NULL DEFAULT 0 COMMENT '父级ID（0为顶级）',
  `name` VARCHAR(50) NOT NULL COMMENT '权限名称',
  `code` VARCHAR(100) NOT NULL COMMENT '权限编码',
  `type` TINYINT NOT NULL COMMENT '类型：1菜单 2按钮',
  `path` VARCHAR(255) DEFAULT NULL COMMENT '前端路由路径',
  `icon` VARCHAR(100) DEFAULT NULL COMMENT '图标',
  `sort` INT NOT NULL DEFAULT 0 COMMENT '排序',
  `is_active` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '是否启用：1是 0否',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_code` (`code`),
  KEY `idx_parent_id` (`parent_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='权限表';

-- 用户角色关联表
DROP TABLE IF EXISTS `sys_user_role`;
CREATE TABLE `sys_user_role` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键',
  `user_id` BIGINT NOT NULL COMMENT '用户ID',
  `role_id` BIGINT NOT NULL COMMENT '角色ID',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_role` (`user_id`, `role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户角色关联表';

-- 角色权限关联表
DROP TABLE IF EXISTS `sys_role_permission`;
CREATE TABLE `sys_role_permission` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键',
  `role_id` BIGINT NOT NULL COMMENT '角色ID',
  `permission_id` BIGINT NOT NULL COMMENT '权限ID',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_role_permission` (`role_id`, `permission_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='角色权限关联表';

-- 操作日志表
DROP TABLE IF EXISTS `sys_operation_log`;
CREATE TABLE `sys_operation_log` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键',
  `user_id` BIGINT DEFAULT NULL COMMENT '操作人ID',
  `user_type` TINYINT DEFAULT NULL COMMENT '用户类型：1管理员 2员工',
  `username` VARCHAR(50) DEFAULT NULL COMMENT '操作人名称',
  `module` VARCHAR(50) DEFAULT NULL COMMENT '模块',
  `action` VARCHAR(50) DEFAULT NULL COMMENT '操作类型',
  `method` VARCHAR(10) DEFAULT NULL COMMENT '请求方法',
  `url` VARCHAR(255) DEFAULT NULL COMMENT '请求URL',
  `params` TEXT COMMENT '请求参数',
  `result` TEXT COMMENT '响应结果',
  `ip` VARCHAR(50) DEFAULT NULL COMMENT 'IP地址',
  `user_agent` VARCHAR(500) DEFAULT NULL COMMENT 'UserAgent',
  `cost_time` INT DEFAULT NULL COMMENT '耗时（毫秒）',
  `status` TINYINT DEFAULT NULL COMMENT '状态：1成功 0失败',
  `error_msg` TEXT COMMENT '错误信息',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_create_time` (`create_time`),
  KEY `idx_module` (`module`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='操作日志表';

-- ============================================================
-- 商品模块 (prd_)
-- ============================================================

-- 商品分类表
DROP TABLE IF EXISTS `prd_category`;
CREATE TABLE `prd_category` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键',
  `name` VARCHAR(50) NOT NULL COMMENT '分类名称',
  `icon` VARCHAR(255) DEFAULT NULL COMMENT '图标',
  `sort` INT NOT NULL DEFAULT 0 COMMENT '排序',
  `is_active` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '是否启用：1是 0否',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `is_deleted` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '软删除：0否 1是',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='商品分类表';

-- 商品表
DROP TABLE IF EXISTS `prd_product`;
CREATE TABLE `prd_product` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键',
  `category_id` BIGINT DEFAULT NULL COMMENT '分类ID',
  `name` VARCHAR(100) NOT NULL COMMENT '商品名称',
  `description` TEXT COMMENT '商品描述',
  `cover_image` VARCHAR(255) DEFAULT NULL COMMENT '封面图',
  `points` INT NOT NULL COMMENT '所需积分',
  `stock` INT NOT NULL DEFAULT 0 COMMENT '库存数量',
  `type` TINYINT NOT NULL DEFAULT 1 COMMENT '类型：1实物 2虚拟 3卡券',
  `sort` INT NOT NULL DEFAULT 0 COMMENT '排序',
  `is_active` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '是否上架：1是 0否',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `create_by` BIGINT DEFAULT NULL COMMENT '创建人',
  `is_deleted` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '软删除：0否 1是',
  PRIMARY KEY (`id`),
  KEY `idx_category_id` (`category_id`),
  KEY `idx_is_active` (`is_active`),
  KEY `idx_sort` (`sort`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='商品表';

-- 商品图片表
DROP TABLE IF EXISTS `prd_product_image`;
CREATE TABLE `prd_product_image` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键',
  `product_id` BIGINT NOT NULL COMMENT '商品ID',
  `url` VARCHAR(255) NOT NULL COMMENT '图片URL',
  `sort` INT NOT NULL DEFAULT 0 COMMENT '排序',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_product_id` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='商品图片表';

-- ============================================================
-- 订单模块 (ord_)
-- ============================================================

-- 订单表
DROP TABLE IF EXISTS `ord_order`;
CREATE TABLE `ord_order` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键',
  `order_no` VARCHAR(32) NOT NULL COMMENT '订单号',
  `employee_id` BIGINT NOT NULL COMMENT '员工ID',
  `total_points` INT NOT NULL COMMENT '总积分',
  `status` TINYINT NOT NULL DEFAULT 1 COMMENT '状态：1待发货 2已发货 3已完成 4已取消 5已退款',
  `receiver_name` VARCHAR(50) DEFAULT NULL COMMENT '收货人',
  `receiver_phone` VARCHAR(20) DEFAULT NULL COMMENT '收货电话',
  `receiver_address` VARCHAR(255) DEFAULT NULL COMMENT '收货地址',
  `remark` VARCHAR(255) DEFAULT NULL COMMENT '备注',
  `shipped_at` DATETIME DEFAULT NULL COMMENT '发货时间',
  `completed_at` DATETIME DEFAULT NULL COMMENT '完成时间',
  `cancelled_at` DATETIME DEFAULT NULL COMMENT '取消时间',
  `cancel_reason` VARCHAR(255) DEFAULT NULL COMMENT '取消原因',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_order_no` (`order_no`),
  KEY `idx_employee_id` (`employee_id`),
  KEY `idx_status` (`status`),
  KEY `idx_create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='订单表';

-- 订单明细表
DROP TABLE IF EXISTS `ord_order_item`;
CREATE TABLE `ord_order_item` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键',
  `order_id` BIGINT NOT NULL COMMENT '订单ID',
  `product_id` BIGINT NOT NULL COMMENT '商品ID',
  `product_name` VARCHAR(100) NOT NULL COMMENT '商品名称',
  `product_image` VARCHAR(255) DEFAULT NULL COMMENT '商品图片',
  `points` INT NOT NULL COMMENT '单价积分',
  `quantity` INT NOT NULL DEFAULT 1 COMMENT '数量',
  `subtotal` INT NOT NULL COMMENT '小计积分',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_order_id` (`order_id`),
  KEY `idx_product_id` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='订单明细表';

-- ============================================================
-- 积分模块 (pts_)
-- ============================================================

-- 积分账户表
DROP TABLE IF EXISTS `pts_account`;
CREATE TABLE `pts_account` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键',
  `employee_id` BIGINT NOT NULL COMMENT '员工ID',
  `balance` INT NOT NULL DEFAULT 0 COMMENT '当前余额',
  `total_granted` INT NOT NULL DEFAULT 0 COMMENT '累计获得',
  `total_used` INT NOT NULL DEFAULT 0 COMMENT '累计使用',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_employee_id` (`employee_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='积分账户表';

-- 积分记录表
DROP TABLE IF EXISTS `pts_record`;
CREATE TABLE `pts_record` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键',
  `employee_id` BIGINT NOT NULL COMMENT '员工ID',
  `type` TINYINT NOT NULL COMMENT '类型：1月度发放 2手动调整 3兑换扣减 4退款返还 5月度清零',
  `amount` INT NOT NULL COMMENT '变动数量（正增负减）',
  `balance_after` INT NOT NULL COMMENT '变动后余额',
  `order_id` BIGINT DEFAULT NULL COMMENT '关联订单ID',
  `remark` VARCHAR(255) DEFAULT NULL COMMENT '备注',
  `operator_id` BIGINT DEFAULT NULL COMMENT '操作人ID',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_employee_id` (`employee_id`),
  KEY `idx_type` (`type`),
  KEY `idx_create_time` (`create_time`),
  KEY `idx_order_id` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='积分记录表';

-- 级别积分配置表
DROP TABLE IF EXISTS `pts_level_config`;
CREATE TABLE `pts_level_config` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键',
  `level_name` VARCHAR(50) NOT NULL COMMENT '级别名称',
  `level_code` VARCHAR(20) NOT NULL COMMENT '级别编码',
  `monthly_points` INT NOT NULL COMMENT '每月发放积分',
  `sort` INT NOT NULL DEFAULT 0 COMMENT '排序',
  `is_active` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '是否启用：1是 0否',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_level_code` (`level_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='级别积分配置表';

-- ============================================================
-- 地址模块 (emp_)
-- ============================================================

-- 员工收货地址表
DROP TABLE IF EXISTS `emp_address`;
CREATE TABLE `emp_address` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键',
  `employee_id` BIGINT NOT NULL COMMENT '员工ID',
  `receiver_name` VARCHAR(50) NOT NULL COMMENT '收货人姓名',
  `phone` VARCHAR(20) NOT NULL COMMENT '联系电话',
  `province` VARCHAR(50) DEFAULT NULL COMMENT '省',
  `city` VARCHAR(50) DEFAULT NULL COMMENT '市',
  `district` VARCHAR(50) DEFAULT NULL COMMENT '区',
  `detail` VARCHAR(255) NOT NULL COMMENT '详细地址',
  `is_default` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否默认：1是 0否',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `is_deleted` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '软删除：0否 1是',
  PRIMARY KEY (`id`),
  KEY `idx_employee_id` (`employee_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='员工收货地址表';

-- ============================================================
-- 初始化数据
-- ============================================================

-- 初始化超级管理员（密码：123456，bcrypt加密）
INSERT INTO `sys_user` (`username`, `password`, `nickname`, `is_active`) VALUES
('admin', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EH', '超级管理员', 1);

-- 初始化角色
INSERT INTO `sys_role` (`name`, `code`, `description`, `sort`) VALUES
('超级管理员', 'admin', '拥有所有权限', 1),
('运营人员', 'operator', '负责商品和订单管理', 2),
('财务人员', 'finance', '负责财务相关操作', 3);

-- 初始化员工级别
INSERT INTO `pts_level_config` (`level_name`, `level_code`, `monthly_points`, `sort`) VALUES
('初级员工', 'junior', 100, 1),
('中级员工', 'middle', 200, 2),
('高级员工', 'senior', 300, 3),
('管理层', 'manager', 500, 4);

-- 初始化权限（菜单）
INSERT INTO `sys_permission` (`parent_id`, `name`, `code`, `type`, `path`, `icon`, `sort`) VALUES
(0, '系统管理', 'system', 1, '/system', 'setting', 1),
(0, '员工管理', 'employee', 1, '/employee', 'user', 2),
(0, '商品管理', 'product', 1, '/product', 'shopping', 3),
(0, '订单管理', 'order', 1, '/order', 'file-text', 4),
(0, '积分管理', 'points', 1, '/points', 'gold', 5);

-- 系统管理子菜单
INSERT INTO `sys_permission` (`parent_id`, `name`, `code`, `type`, `path`, `icon`, `sort`) VALUES
(1, '用户管理', 'system:user', 1, '/system/user', NULL, 1),
(1, '角色管理', 'system:role', 1, '/system/role', NULL, 2),
(1, '权限管理', 'system:permission', 1, '/system/permission', NULL, 3),
(1, '操作日志', 'system:log', 1, '/system/log', NULL, 4);

-- 员工管理按钮权限
INSERT INTO `sys_permission` (`parent_id`, `name`, `code`, `type`, `path`, `icon`, `sort`) VALUES
(2, '员工列表', 'employee:list', 2, NULL, NULL, 1),
(2, '新增员工', 'employee:create', 2, NULL, NULL, 2),
(2, '编辑员工', 'employee:update', 2, NULL, NULL, 3),
(2, '删除员工', 'employee:delete', 2, NULL, NULL, 4),
(2, '导入员工', 'employee:import', 2, NULL, NULL, 5),
(2, '导出员工', 'employee:export', 2, NULL, NULL, 6);

-- 商品管理按钮权限
INSERT INTO `sys_permission` (`parent_id`, `name`, `code`, `type`, `path`, `icon`, `sort`) VALUES
(3, '商品列表', 'product:list', 2, NULL, NULL, 1),
(3, '新增商品', 'product:create', 2, NULL, NULL, 2),
(3, '编辑商品', 'product:update', 2, NULL, NULL, 3),
(3, '删除商品', 'product:delete', 2, NULL, NULL, 4),
(3, '上架商品', 'product:online', 2, NULL, NULL, 5),
(3, '下架商品', 'product:offline', 2, NULL, NULL, 6);

-- 订单管理按钮权限
INSERT INTO `sys_permission` (`parent_id`, `name`, `code`, `type`, `path`, `icon`, `sort`) VALUES
(4, '订单列表', 'order:list', 2, NULL, NULL, 1),
(4, '订单详情', 'order:detail', 2, NULL, NULL, 2),
(4, '订单发货', 'order:ship', 2, NULL, NULL, 3),
(4, '取消订单', 'order:cancel', 2, NULL, NULL, 4),
(4, '订单退款', 'order:refund', 2, NULL, NULL, 5);

-- 积分管理按钮权限
INSERT INTO `sys_permission` (`parent_id`, `name`, `code`, `type`, `path`, `icon`, `sort`) VALUES
(5, '积分记录', 'points:list', 2, NULL, NULL, 1),
(5, '手动调整', 'points:adjust', 2, NULL, NULL, 2),
(5, '级别配置', 'points:level', 2, NULL, NULL, 3);

-- 超级管理员拥有所有权限
INSERT INTO `sys_user_role` (`user_id`, `role_id`) VALUES (1, 1);

-- 超级管理员角色绑定所有权限
INSERT INTO `sys_role_permission` (`role_id`, `permission_id`)
SELECT 1, id FROM `sys_permission`;
