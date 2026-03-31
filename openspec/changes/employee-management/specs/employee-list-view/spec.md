# Capability: Employee List View

## Requirements

### R1: 列表展示

- 支持分页（默认每页20条）
- 显示字段：工号、姓名、部门、职位、手机、状态
- 按创建时间倒序排列

### R2: 搜索功能

- 支持按姓名模糊搜索
- 支持按工号精确搜索
- 支持按部门筛选

### R3: 状态筛选

- 支持筛选在职员工
- 支持筛选离职员工
- 支持查看全部

### R4: 排序功能

- 支持按入职日期排序
- 支持按工号排序
- 支持按姓名排序

## API Spec

### GET /api/employee

获取员工列表

**Query Parameters:**

- `page`: 页码（默认1）
- `pageSize`: 每页数量（默认20）
- `keyword`: 搜索关键词
- `department`: 部门筛选
- `status`: 状态筛选（1在职/2离职）
- `sortBy`: 排序字段
- `sortOrder`: 排序方向（asc/desc）

**Response:** 200 OK

```json
{
  "code": 0,
  "message": "操作成功",
  "data": {
    "list": [...],
    "total": 100,
    "page": 1,
    "pageSize": 20
  }
}
```
