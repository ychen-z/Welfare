# 认证功能集成测试指南

## 测试环境准备

### 1. 启动依赖服务

```bash
# 确保 Docker 运行中
# 确保 MySQL (本地) 和 Redis (Docker) 已启动
docker ps  # 检查 Redis 容器状态
```

### 2. 启动后端服务

```bash
cd /Users/zhangzhang/projects/welfal
pnpm dev:server
```

等待服务启动完成，看到：

```
[Nest] ... - Application is running on: http://localhost:3000
```

### 3. 启动前端服务（可选）

```bash
# 新终端窗口
cd /Users/zhangzhang/projects/welfal
pnpm dev:admin
```

---

## 快速测试（使用脚本）

### 方法 1: 使用测试脚本

```bash
# 赋予执行权限
chmod +x test-auth-api.sh

# 运行测试
./test-auth-api.sh
```

该脚本会自动测试以下场景：

1. ✅ 健康检查接口 (无需认证)
2. ✅ 登录获取 Token
3. ✅ 获取用户信息 (需要认证)
4. ✅ 权限控制测试
5. ✅ Token 刷新
6. ✅ 登出
7. ✅ 验证登出后 Token 失效

---

## 手动测试

### 测试 1: 健康检查

```bash
curl -X GET http://localhost:3000/api/health
```

**预期结果:**

```json
{
  "code": 0,
  "message": "操作成功",
  "data": {
    "status": "ok",
    "timestamp": "2026-03-31T05:31:05.000Z"
  }
}
```

### 测试 2: 登录

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"123456"}'
```

**预期结果:**

```json
{
  "code": 0,
  "message": "操作成功",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tokenType": "Bearer",
    "expiresIn": 7200
  }
}
```

**保存返回的 Token 用于后续测试！**

### 测试 3: 获取用户信息（需认证）

```bash
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer <YOUR_ACCESS_TOKEN>"
```

**预期结果:**

```json
{
  "code": 0,
  "message": "操作成功",
  "data": {
    "userId": 1,
    "username": "admin",
    "roles": ["超级管理员"],
    "permissions": ["sys:user:view", "sys:user:add", ...]
  }
}
```

### 测试 4: 权限控制

```bash
curl -X GET http://localhost:3000/api/auth/test/permission \
  -H "Authorization: Bearer <YOUR_ACCESS_TOKEN>"
```

**预期结果:**

```json
{
  "code": 0,
  "message": "操作成功",
  "data": {
    "message": "你有 sys:user:view 权限！",
    "requiredPermission": "sys:user:view"
  }
}
```

### 测试 5: 无 Token 访问受保护接口

```bash
curl -X GET http://localhost:3000/api/auth/profile
```

**预期结果:** HTTP 401 错误

```json
{
  "code": 401,
  "message": "未授权",
  "data": null
}
```

### 测试 6: 刷新 Token

```bash
curl -X POST http://localhost:3000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"<YOUR_REFRESH_TOKEN>"}'
```

**预期结果:**

```json
{
  "code": 0,
  "message": "操作成功",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tokenType": "Bearer",
    "expiresIn": 7200
  }
}
```

### 测试 7: 登出

```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_ACCESS_TOKEN>" \
  -d '{"refreshToken":"<YOUR_REFRESH_TOKEN>"}'
```

**预期结果:**

```json
{
  "code": 0,
  "message": "操作成功",
  "data": null
}
```

### 测试 8: 验证登出后 Token 失效

```bash
# 使用已登出的 Refresh Token
curl -X POST http://localhost:3000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"<LOGGED_OUT_REFRESH_TOKEN>"}'
```

**预期结果:** HTTP 401 错误

---

## 前端测试

### 1. 访问登录页

打开浏览器访问: http://localhost:8000

应自动重定向到: http://localhost:8000/login

### 2. 登录测试

- **用户名**: `admin`
- **密码**: `123456`

点击"登录"按钮

### 3. 验证登录成功

- ✅ 页面跳转到 `/home`
- ✅ 右上角显示用户名 "admin"
- ✅ 显示"登出"按钮

### 4. 测试登出

点击"登出"按钮，应：

- ✅ 清除 localStorage 中的 Token
- ✅ 跳转到 `/login`

### 5. 测试路由守卫

登出后，手动访问 http://localhost:8000/home

应自动重定向到登录页

---

## Swagger 文档测试

### 访问 Swagger UI

打开浏览器访问: http://localhost:3000/api-docs

### 验证文档完整性

1. ✅ 查看 "认证管理" 标签下的所有接口
2. ✅ 每个接口都有完整的描述和示例
3. ✅ 尝试 "Try it out" 功能

### 使用 Swagger 测试登录

1. 展开 `POST /api/auth/login`
2. 点击 "Try it out"
3. 输入:
   ```json
   {
     "username": "admin",
     "password": "123456"
   }
   ```
4. 点击 "Execute"
5. 复制返回的 `accessToken`
6. 点击页面顶部的 "Authorize" 按钮
7. 输入: `Bearer <accessToken>`
8. 现在可以测试需要认证的接口了

---

## 测试检查清单

### 后端功能

- [ ] 健康检查接口正常
- [ ] 登录接口返回正确的 Token
- [ ] Token 存储在 Redis（使用 Redis CLI 验证）
- [ ] 获取用户信息接口正常
- [ ] 权限控制接口正常
- [ ] 无权限访问返回 403
- [ ] 无 Token 访问返回 401
- [ ] Token 刷新功能正常
- [ ] 登出清除 Redis Token
- [ ] Swagger 文档完整

### 前端功能

- [ ] 登录页面样式正常
- [ ] 表单验证生效
- [ ] 登录成功跳转首页
- [ ] Token 存储在 localStorage
- [ ] 首页显示用户信息
- [ ] 登出功能正常
- [ ] 路由守卫生效
- [ ] 未登录自动跳转登录页

### Redis 验证

```bash
# 连接 Redis
docker exec -it welfal-redis redis-cli

# 查看所有 Key
KEYS *

# 应该看到类似: refresh_token:<token_hash>
# 查看某个 Token
GET refresh_token:<token_hash>

# 登出后该 Key 应该被删除
```

---

## 常见问题排查

### 问题 1: 后端服务无法启动

**检查:**

- MySQL 是否运行且密码正确 (a123456)
- Redis 容器是否运行
- .env 文件是否存在且配置正确

### 问题 2: 登录返回 500 错误

**检查:**

- 数据库种子数据是否正确插入
- bcrypt 加密的密码是否正确
- 查看服务器日志详细错误

### 问题 3: Token 无法刷新

**检查:**

- Redis 连接是否正常
- Refresh Token 是否在 Redis 中
- Token 是否已过期 (7天)

### 问题 4: 前端 401 错误

**检查:**

- localStorage 中是否有 Token
- Token 是否格式正确 (应包含 access_token 和 refresh_token)
- request.ts 中是否正确添加 Authorization header

---

## 性能测试（可选）

### 使用 Apache Bench 压测登录接口

```bash
# 安装 ab 工具（macOS 自带）
# 准备请求体
echo '{"username":"admin","password":"123456"}' > login.json

# 100 个并发，1000 个请求
ab -n 1000 -c 100 -T 'application/json' -p login.json \
  http://localhost:3000/api/auth/login
```

---

## 下一步

测试通过后，可以继续：

1. **实施动态菜单**（任务 19）
2. **开始阶段 3：员工管理模块**
3. **优化和重构**
