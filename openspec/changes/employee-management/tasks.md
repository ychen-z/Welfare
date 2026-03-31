# 员工管理模块 - 实施任务

## 后端任务

### 1. 数据库准备

- [x] 1.1 创建 employee 表（已在 database.sql 中）
- [ ] 1.2 添加测试数据

### 2. Entity 和 DTO

- [ ] 2.1 创建 Employee Entity
- [ ] 2.2 创建 CreateEmployeeDto
- [ ] 2.3 创建 UpdateEmployeeDto
- [ ] 2.4 创建 QueryEmployeeDto

### 3. Service 层

- [ ] 3.1 实现 create 方法
- [ ] 3.2 实现 findAll 方法（分页、搜索）
- [ ] 3.3 实现 findOne 方法
- [ ] 3.4 实现 update 方法
- [ ] 3.5 实现 remove 方法（软删除）
- [ ] 3.6 实现 updateStatus 方法

### 4. Controller 层

- [ ] 4.1 实现 POST /api/employee
- [ ] 4.2 实现 GET /api/employee
- [ ] 4.3 实现 GET /api/employee/:id
- [ ] 4.4 实现 PUT /api/employee/:id
- [ ] 4.5 实现 DELETE /api/employee/:id
- [ ] 4.6 实现 PATCH /api/employee/:id/status
- [ ] 4.7 添加 Swagger 文档注解
- [ ] 4.8 添加权限装饰器

### 5. Module 配置

- [ ] 5.1 创建 EmployeeModule
- [ ] 5.2 在 AppModule 中注册
- [ ] 5.3 配置 TypeORM Entity

## 前端任务

### 6. 基础配置

- [ ] 6.1 创建 pages/employee 目录
- [ ] 6.2 创建 service.ts（API 调用）
- [ ] 6.3 添加路由配置

### 7. 列表页

- [ ] 7.1 创建 index.tsx（ProTable）
- [ ] 7.2 实现搜索功能
- [ ] 7.3 实现筛选功能
- [ ] 7.4 实现操作按钮（新增、编辑、删除）

### 8. 表单页

- [ ] 8.1 创建 EmployeeForm 组件
- [ ] 8.2 实现表单验证
- [ ] 8.3 实现新增逻辑
- [ ] 8.4 实现编辑逻辑

### 9. 集成测试

- [ ] 9.1 测试创建员工
- [ ] 9.2 测试列表查询
- [ ] 9.3 测试编辑员工
- [ ] 9.4 测试删除员工
- [ ] 9.5 测试权限控制
