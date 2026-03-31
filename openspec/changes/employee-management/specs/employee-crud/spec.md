# Capability: Employee CRUD

## Requirements

### R1: 创建员工

- 必填字段：工号、姓名
- 可选字段：部门、职位、手机、邮箱、入职日期
- 工号必须唯一
- 手机号格式验证
- 邮箱格式验证

### R2: 更新员工

- 支持更新所有字段（除工号）
- 工号不可修改
- 更新时验证数据格式

### R3: 删除员工

- 软删除（is_deleted=1）
- 保留历史数据
- 同时禁用关联的登录账号

### R4: 查询员工详情

- 返回完整员工信息
- 包含关联的用户账号信息

## API Spec

### POST /api/employee

创建员工

**Request:**

```json
{
  "employeeNo": "EMP001",
  "name": "张三",
  "department": "技术部",
  "position": "工程师",
  "phone": "13800138000",
  "email": "zhangsan@example.com",
  "hireDate": "2024-01-01"
}
```

**Response:** 200 OK

```json
{
  "code": 0,
  "message": "操作成功",
  "data": {
    "id": 1,
    "employeeNo": "EMP001",
    ...
  }
}
```

### PUT /api/employee/:id

更新员工

### DELETE /api/employee/:id

删除员工

### GET /api/employee/:id

获取员工详情
