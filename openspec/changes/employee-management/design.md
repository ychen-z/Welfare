# 员工管理模块 - 设计文档

## 架构设计

### 模块结构

```
apps/server/src/modules/employee/
├── employee.module.ts
├── employee.controller.ts
├── employee.service.ts
├── entities/
│   └── employee.entity.ts
└── dto/
    ├── create-employee.dto.ts
    ├── update-employee.dto.ts
    ├── query-employee.dto.ts
    └── employee-response.dto.ts
```

## 数据模型

### Employee 表设计

```sql
CREATE TABLE employee (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT UNIQUE COMMENT '关联sys_user表',
  employee_no VARCHAR(50) UNIQUE NOT NULL COMMENT '工号',
  name VARCHAR(50) NOT NULL COMMENT '姓名',
  department VARCHAR(100) COMMENT '部门',
  position VARCHAR(100) COMMENT '职位',
  phone VARCHAR(20) COMMENT '手机号',
  email VARCHAR(100) COMMENT '邮箱',
  hire_date DATE COMMENT '入职日期',
  status TINYINT DEFAULT 1 COMMENT '状态：1在职 2离职',
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_deleted TINYINT DEFAULT 0,
  INDEX idx_employee_no (employee_no),
  INDEX idx_user_id (user_id),
  FOREIGN KEY (user_id) REFERENCES sys_user(id)
);
```

## API 设计

### RESTful 接口

| Method | Path                     | Description  | Permission      |
| ------ | ------------------------ | ------------ | --------------- |
| GET    | /api/employee            | 获取员工列表 | employee:list   |
| GET    | /api/employee/:id        | 获取员工详情 | employee:view   |
| POST   | /api/employee            | 创建员工     | employee:create |
| PUT    | /api/employee/:id        | 更新员工     | employee:update |
| DELETE | /api/employee/:id        | 删除员工     | employee:delete |
| POST   | /api/employee/import     | 批量导入     | employee:import |
| GET    | /api/employee/export     | 导出Excel    | employee:export |
| PATCH  | /api/employee/:id/status | 更新状态     | employee:update |

## 前端设计

### 页面结构

```
apps/admin/src/pages/employee/
├── index.tsx           # 列表页（ProTable）
├── components/
│   ├── EmployeeForm.tsx    # 新增/编辑表单
│   └── ImportModal.tsx     # 导入弹窗
└── service.ts          # API 调用
```

### 核心功能

- 使用 ProTable 展示列表
- 支持搜索（姓名、工号、部门）
- 支持筛选（状态、部门）
- 支持导入/导出 Excel

## 技术要点

1. **权限控制**: 使用 @RequirePermission 装饰器
2. **数据验证**: class-validator + DTO
3. **Excel处理**: 使用 xlsx 库
4. **关联查询**: TypeORM relations
5. **离职处理**: 更新 employee.status 同时禁用 sys_user.is_active
