-- ============================================================
-- 认证权限模块种子数据
-- ============================================================

USE `welfal`;

-- 1. 插入超级管理员账号
-- 密码: 123456 (bcrypt 加密后的哈希值)
INSERT INTO `sys_user` (`id`, `username`, `password`, `nickname`, `is_active`, `create_time`, `update_time`)
VALUES (1, 'admin', '$2b$10$N9qo8uLOickgx2ZMRZoMy.GV1G8hMDMJEiGUmWNhVAv3LNdZDFMLC', '超级管理员', 1, NOW(), NOW());

-- 2. 插入默认角色
INSERT INTO `sys_role` (`id`, `name`, `code`, `description`, `sort`, `is_active`, `create_time`, `update_time`)
VALUES 
(1, '超级管理员', 'admin', '拥有所有权限', 1, 1, NOW(), NOW()),
(2, '普通管理员', 'manager', '普通管理员角色', 2, 1, NOW(), NOW());

-- 3. 插入基础菜单权限
INSERT INTO `sys_permission` (`id`, `parent_id`, `name`, `code`, `type`, `path`, `icon`, `sort`, `is_active`, `create_time`, `update_time`)
VALUES
-- 一级菜单
(1, 0, '首页', 'menu:home', 1, '/home', 'HomeOutlined', 1, 1, NOW(), NOW()),
(2, 0, '员工管理', 'menu:employee', 1, '/employee', 'TeamOutlined', 2, 1, NOW(), NOW()),
(3, 0, '商品管理', 'menu:product', 1, '/product', 'ShoppingOutlined', 3, 1, NOW(), NOW()),
(4, 0, '订单管理', 'menu:order', 1, '/order', 'ShoppingCartOutlined', 4, 1, NOW(), NOW()),
(5, 0, '积分管理', 'menu:points', 1, '/points', 'WalletOutlined', 5, 1, NOW(), NOW()),
(6, 0, '系统管理', 'menu:system', 1, '/system', 'SettingOutlined', 6, 1, NOW(), NOW()),

-- 员工管理子菜单
(11, 2, '员工列表', 'menu:employee:list', 1, '/employee/list', NULL, 1, 1, NOW(), NOW()),
(12, 2, '员工级别', 'menu:employee:level', 1, '/employee/level', NULL, 2, 1, NOW(), NOW()),

-- 商品管理子菜单
(21, 3, '商品列表', 'menu:product:list', 1, '/product/list', NULL, 1, 1, NOW(), NOW()),
(22, 3, '商品分类', 'menu:product:category', 1, '/product/category', NULL, 2, 1, NOW(), NOW()),

-- 订单管理子菜单
(31, 4, '兑换订单', 'menu:order:list', 1, '/order/list', NULL, 1, 1, NOW(), NOW()),

-- 积分管理子菜单
(41, 5, '积分流水', 'menu:points:log', 1, '/points/log', NULL, 1, 1, NOW(), NOW()),
(42, 5, '积分发放', 'menu:points:grant', 1, '/points/grant', NULL, 2, 1, NOW(), NOW()),

-- 系统管理子菜单
(51, 6, '用户管理', 'menu:system:user', 1, '/system/user', NULL, 1, 1, NOW(), NOW()),
(52, 6, '角色管理', 'menu:system:role', 1, '/system/role', NULL, 2, 1, NOW(), NOW()),
(53, 6, '权限管理', 'menu:system:permission', 1, '/system/permission', NULL, 3, 1, NOW(), NOW()),

-- 按钮权限（员工模块）
(101, 11, '新增员工', 'employee:create', 2, NULL, NULL, 1, 1, NOW(), NOW()),
(102, 11, '编辑员工', 'employee:update', 2, NULL, NULL, 2, 1, NOW(), NOW()),
(103, 11, '删除员工', 'employee:delete', 2, NULL, NULL, 3, 1, NOW(), NOW()),
(104, 11, '查看员工', 'employee:view', 2, NULL, NULL, 4, 1, NOW(), NOW()),

-- 按钮权限（商品模块）
(201, 21, '新增商品', 'product:create', 2, NULL, NULL, 1, 1, NOW(), NOW()),
(202, 21, '编辑商品', 'product:update', 2, NULL, NULL, 2, 1, NOW(), NOW()),
(203, 21, '删除商品', 'product:delete', 2, NULL, NULL, 3, 1, NOW(), NOW()),
(204, 21, '上下架', 'product:shelf', 2, NULL, NULL, 4, 1, NOW(), NOW()),

-- 按钮权限（订单模块）
(301, 31, '查看订单', 'order:view', 2, NULL, NULL, 1, 1, NOW(), NOW()),
(302, 31, '处理订单', 'order:process', 2, NULL, NULL, 2, 1, NOW(), NOW()),
(303, 31, '取消订单', 'order:cancel', 2, NULL, NULL, 3, 1, NOW(), NOW());

-- 4. 关联超级管理员与角色
INSERT INTO `sys_user_role` (`user_id`, `role_id`, `create_time`)
VALUES (1, 1, NOW());

-- 5. 为超级管理员角色分配所有权限
INSERT INTO `sys_role_permission` (`role_id`, `permission_id`, `create_time`)
SELECT 1, id, NOW() FROM `sys_permission` WHERE `is_active` = 1;

-- 验证数据
SELECT '=== 用户数据 ===' AS '';
SELECT id, username, nickname FROM sys_user;

SELECT '=== 角色数据 ===' AS '';
SELECT id, name, code FROM sys_role;

SELECT '=== 权限数据（前10条） ===' AS '';
SELECT id, name, code, type FROM sys_permission LIMIT 10;

SELECT '=== 超管角色拥有的权限数 ===' AS '';
SELECT COUNT(*) as permission_count FROM sys_role_permission WHERE role_id = 1;
