# 员工管理模块 - 完整实施指南

## 📦 模块概述

员工管理模块实现了完整的员工信息 CRUD 功能，包括列表查询、详情查看、新增、编辑、删除等核心功能。

---

## ✅ 已完成内容

### 数据库

- ✅ `employee` 表已创建
- ✅ 包含所有必要字段和索引
- ✅ 与 `sys_user` 表建立外键关联

### 后端代码（NestJS）

- ✅ `Employee` Entity - 实体定义
- ✅ `CreateEmployeeDto` - 创建DTO
- ✅ `UpdateEmployeeDto` - 更新DTO
- ✅ `QueryEmployeeDto` - 查询DTO
- ✅ `EmployeeService` - 业务逻辑层
  - 创建员工（含工号唯一性验证）
  - 列表查询（分页、搜索、筛选、排序）
  - 详情查询
  - 更新员工
  - 删除员工（软删除）
  - 更新状态
- ✅ `EmployeeController` - 控制器层
  - 6个 RESTful 接口
  - 完整的 Swagger 文档注解
  - 权限控制装饰器
- ✅ `EmployeeModule` - 模块配置
- ✅ 已在 `AppModule` 中注册

### 前端代码（React + Umi）

- ✅ `service.ts` - API 调用层
- ✅ `index.tsx` - 列表页（ProTable）
  - 搜索、筛选功能
  - 编辑、删除操作
  - 分页展示
- ✅ `EmployeeForm.tsx` - 表单组件
  - 新增/编辑复用
  - 完整的表单验证
  - 状态管理

---

## 🚀 如何使用

### 1. 安装前端依赖（如果缺少）

```bash
cd apps/admin
pnpm add @ant-design/pro-table dayjs
```

### 2. 配置路由

在 `apps/admin/.umirc.ts` 中添加员工管理路由：

```typescript
routes: [
  // ... 其他路由
  {
    path: "/employee",
    name: "员工管理",
    icon: "TeamOutlined",
    component: "./employee",
    access: "canAccessRoute",
  },
];
```

### 3. 添加权限数据

在数据库中插入员工管理权限：

```sql
INSERT INTO sys_permission (name, code, type, path, icon, sort, is_active, parent_id) VALUES
('员工管理', 'employee', 1, '/employee', 'TeamOutlined', 20, 1, 0),
('员工列表', 'employee:list', 2, '', '', 1, 1, (SELECT id FROM (SELECT id FROM sys_permission WHERE code='employee') AS temp)),
('员工详情', 'employee:view', 2, '', '', 2, 1, (SELECT id FROM (SELECT id FROM sys_permission WHERE code='employee') AS temp)),
('新增员工', 'employee:create', 2, '', '', 3, 1, (SELECT id FROM (SELECT id FROM sys_permission WHERE code='employee') AS temp)),
('编辑员工', 'employee:update', 2, '', '', 4, 1, (SELECT id FROM (SELECT id FROM sys_permission WHERE code='employee') AS temp)),
('删除员工', 'employee:delete', 2, '', '', 5, 1, (SELECT id FROM (SELECT id FROM sys_permission WHERE code='employee') AS temp));

-- 为超级管理员角色分配权限
INSERT INTO sys_role_permission (role_id, permission_id)
SELECT 1, id FROM sys_permission WHERE code LIKE 'employee%';
```

### 4. 启动服务

```bash
# 后端（如果未运行）
cd apps/server
pnpm start:dev

# 前端（新终端）
cd apps/admin
pnpm dev
```

### 5. 访问测试

访问 http://localhost:8000/employee

---

## 📝 API 接口文档

### 1. 获取员工列表

```
GET /api/employee
Query: page, pageSize, keyword, department, status, sortBy, sortOrder
```

### 2. 获取员工详情

```
GET /api/employee/:id
```

### 3. 创建员工

```
POST /api/employee
Body: { employeeNo, name, department, position, phone, email, hireDate }
```

### 4. 更新员工

```
PUT /api/employee/:id
Body: { ... }
```

### 5. 删除员工

```
DELETE /api/employee/:id
```

### 6. 更新员工状态

```
PATCH /api/employee/:id/status
Body: { status }
```

---

## 🔧 扩展功能建议

### 1. Excel 导入导出

安装依赖：

```bash
cd apps/server
pnpm add xlsx
```

在 `EmployeeService` 中添加：

```typescript
async import(file: Express.Multer.File) {
  const workbook = xlsx.read(file.buffer);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = xlsx.utils.sheet_to_json(sheet);
  // 批量插入逻辑
}

async export(query: QueryEmployeeDto) {
  const { list } = await this.findAll({ ...query, pageSize: 10000 });
  const worksheet = xlsx.utils.json_to_sheet(list);
  const workbook = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(workbook, worksheet, '员工列表');
  return xlsx.write(workbook, { type: 'buffer' });
}
```

### 2. 头像上传

参考文件上传模块实现

### 3. 批量操作

- 批量删除
- 批量更新状态
- 批量导出选中项

---

## 📚 复用此模板

此模块可作为其他 CRUD 模块的模板：

1. **商品管理** - 替换 Employee 为 Product
2. **订单管理** - 替换为 Order
3. **积分管理** - 替换为 Points

**复用步骤**：

1. 复制整个 `employee` 文件夹
2. 全局替换关键词：employee → product, Employee → Product
3. 调整字段定义
4. 修改业务逻辑
5. 更新权限码

---

## ✨ 代码亮点

1. **类型安全** - 完整的 TypeScript 类型定义
2. **权限控制** - 使用装饰器实现细粒度权限
3. **数据验证** - DTO + class-validator
4. **用户体验** - ProTable + Modal 表单
5. **代码复用** - Service 层可被其他模块调用
6. **软删除** - 保留历史数据
7. **关联查询** - 支持关联用户信息

---

## 🐛 故障排查

### 问题 1: 编译错误

确保已安装所有依赖：

```bash
pnpm install
```

### 问题 2: 权限错误 403

检查：

1. 用户是否已登录
2. 用户角色是否有对应权限
3. 权限码是否正确

### 问题 3: 前端接口调用失败

检查：

1. 后端服务是否启动
2. Token 是否有效
3. 浏览器 Network 面板查看详细错误

---

## 📊 性能优化建议

1. **数据库索引** - 已添加工号、user_id、状态索引
2. **分页查询** - 默认20条，避免一次性加载过多数据
3. **软删除优化** - 查询时始终过滤 is_deleted=0
4. **缓存策略** - 可考虑对部门列表等静态数据进行缓存

---

## 🎯 下一步

1. ✅ 测试所有接口功能
2. ✅ 添加集成测试
3. ✅ 补充单元测试
4. ✅ 优化前端交互
5. ✅ 添加导入导出功能
6. ✅ 实现头像上传

---

## 📞 技术支持

如有问题，请参考：

- 后端文档：`openspec/changes/employee-management/`
- 认证模块：参考已完成的 `auth` 模块
- 数据库设计：`doc/database.sql`
