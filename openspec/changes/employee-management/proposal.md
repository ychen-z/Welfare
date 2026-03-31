## Why

员工信息是福利兑换平台的核心基础数据。需要为管理员提供完整的员工信息管理功能，包括基本信息维护、批量导入导出、状态管理等，确保5000名员工的信息准确性和可维护性。

当前系统只有认证用户表，缺少完整的员工档案管理，无法满足HR部门对员工信息的维护需求。

## What Changes

- 新增员工信息管理的完整 CRUD 接口
- 实现员工列表的分页、搜索、排序功能
- 支持员工信息的批量导入（Excel）和导出
- 实现员工状态管理（在职/离职）
- 添加员工详情查看和编辑功能
- 集成现有的 RBAC 权限控制
- 前端实现 ProTable 驱动的员工管理页面

## Capabilities

### New Capabilities

- `employee-crud`: 员工信息的增删改查功能，包括基本信息字段（姓名、工号、部门、职位、手机、邮箱、入职日期等）
- `employee-list-view`: 员工列表展示功能，支持分页、搜索、排序、筛选
- `employee-import-export`: 员工信息的批量导入（Excel）和导出功能
- `employee-status-management`: 员工状态管理（在职/离职切换，离职员工账号自动禁用）

### Modified Capabilities

<!-- 无需修改现有 capability 的需求 -->

## Impact

### 后端影响

- 新增 `employee` 模块（Controller, Service, Entity, DTO）
- 新增 `employee` 表（与 `sys_user` 表关联）
- 新增 Excel 处理依赖（xlsx 库）
- 新增文件上传处理（如果支持头像上传）

### 前端影响

- 新增 `apps/admin/src/pages/employee/` 目录
  - 列表页（使用 ProTable）
  - 详情/编辑表单页
  - 导入/导出功能组件
- 新增员工管理相关路由和菜单项

### 数据库影响

- 新增 `employee` 表
- 与 `sys_user` 表建立关联（一对一或外键关联）
- 员工离职时自动更新 `sys_user.is_active` 状态

### 权限影响

- 复用现有 RBAC 系统
- 新增权限码：
  - `employee:list` - 查看员工列表
  - `employee:view` - 查看员工详情
  - `employee:create` - 新增员工
  - `employee:update` - 编辑员工
  - `employee:delete` - 删除员工
  - `employee:import` - 导入员工
  - `employee:export` - 导出员工
