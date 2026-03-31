## Context

当前项目已完成基础骨架（阶段1），具备基本的请求响应处理、异常过滤、日志记录等能力，但所有接口处于未保护状态。

**现状**：

- 已有统一响应格式、异常处理机制
- 已有 MySQL + Redis 连接
- 数据库中已定义 5 张权限表结构（`sys_user`, `sys_role`, `sys_permission`, `sys_user_role`, `sys_role_permission`）
- 前端已有基础布局和请求封装

**约束**：

- 用户规模 5000 人，Token 验证需高效（Redis 缓存）
- 支持菜单级和按钮级权限控制
- 前后端分离架构，使用 JWT 无状态认证

## Goals / Non-Goals

**Goals:**

- 实现 JWT 认证（Access Token 2h + Refresh Token 7d）
- 实现 RBAC 5 表权限模型
- 提供可复用的 Guard 和 Decorator
- 前端自动处理 Token 刷新
- 支持细粒度权限控制（菜单 + 按钮）
- 提供种子数据，开箱即用

**Non-Goals:**

- 不实现 OAuth 第三方登录（仅用户名密码）
- 不实现验证码（后续阶段可选）
- 不实现密码找回（MVP 不需要）
- 不实现员工端登录（本阶段仅管理员）

## Decisions

### 1. JWT 认证方案

**决策**：Access Token (短期) + Refresh Token (长期) 双 Token 机制

```typescript
Access Token: {
  userId: number,
  username: string,
  roles: string[],     // 角色编码数组
  permissions: string[] // 权限编码数组
  exp: 2h
}

Refresh Token: {
  userId: number,
  tokenId: string, // 唯一标识，用于撤销
  exp: 7d
}
```

**理由**：

- Access Token 短期有效（2h），泄露风险可控
- Refresh Token 存 Redis，可主动撤销（登出、修改角色后立即失效）
- 权限信息放 Access Token 内，减少数据库查询

**备选方案**：

- ❌ Session + Cookie：不适合前后端分离
- ❌ 单 Token 长期有效：泄露风险大，无法主动撤销

### 2. 权限模型设计

**决策**：5 表 RBAC 模型 + 权限编码嵌入 Token

```
sys_user (管理员)
  ├─ sys_user_role (多对多)
  │   └─ sys_role (角色)
  │       └─ sys_role_permission (多对多)
  │           └─ sys_permission (权限)
  │               ├─ type=1 菜单
  │               └─ type=2 按钮
```

**权限编码规范**：

- 菜单：`menu:employee`
- 按钮：`employee:create`, `employee:update`, `employee:delete`

**理由**：

- 5 表模型灵活，支持一人多角色
- 权限编码扁平化，易于理解和管理
- Token 中包含权限数组，Guard 直接验证，无需查库

**备选方案**：

- ❌ 3 表模型（用户-角色）：无法细粒度控制
- ❌ 层级权限树：复杂度高，MVP 不需要

### 3. Token 存储策略

**决策**：

- **Access Token**：前端 localStorage（或 sessionStorage）
- **Refresh Token**：前端 localStorage + 后端 Redis 白名单

**Redis 结构**：

```
Key: auth:refresh:{userId}:{tokenId}
Value: { username, roles }
TTL: 7天
```

**理由**：

- localStorage 持久化，刷新页面不丢失
- Refresh Token 需后端可撤销（修改角色后立即失效）
- Redis TTL 自动过期，无需定时清理

**备选方案**：

- ❌ 仅前端存储：无法主动撤销
- ❌ Token 黑名单：空间浪费大（需存所有被撤销的）

### 4. 守卫 (Guard) 设计

**决策**：两层守卫机制

```typescript
// 全局 JwtGuard（所有接口默认需要登录）
@UseGuards(JwtGuard)
export class AppModule {}

// 接口级 PermissionGuard（按需声明权限）
@RequirePermission('employee:create')
@Post()
create() {}

// 公开接口（例外）
@Public()
@Get('health')
health() {}
```

**执行顺序**：

1. JwtGuard 验证 Token 合法性 → 解析 userId 和 permissions
2. PermissionGuard 检查 `@RequirePermission` → 验证权限数组
3. 两者都通过 → 执行 Controller

**理由**：

- 全局守卫保证安全默认（Secure by default）
- `@Public` 装饰器提供例外机制（健康检查、登录接口）
- 权限守卫按需启用，避免所有接口都强制检查

**备选方案**：

- ❌ 接口级手动声明 `@UseGuards`：容易遗漏，不安全
- ❌ 单一 Guard 处理认证+权限：职责不清晰

### 5. 密码加密

**决策**：使用 bcrypt（成本因子 10）

```typescript
import * as bcrypt from "bcrypt";

// 加密
const hash = await bcrypt.hash(password, 10);

// 验证
const isMatch = await bcrypt.compare(password, hash);
```

**理由**：

- bcrypt 是业界标准，抗暴力破解
- 成本因子 10 在性能和安全之间平衡
- NestJS 生态成熟，依赖稳定

**备选方案**：

- ❌ MD5/SHA256：不抗彩虹表攻击
- ❌ argon2：依赖 C++ 编译，部署复杂

### 6. 前端 Token 刷新策略

**决策**：响应拦截器检测 401 → 自动调用刷新接口 → 重试原请求

```typescript
// 伪代码
interceptor.response((error) => {
  if (error.status === 401 && !isRefreshRequest) {
    const newToken = await refreshToken();
    retryOriginalRequest(newToken);
  }
});
```

**理由**：

- 用户无感知，体验流畅
- 避免频繁刷新（仅在 401 时触发）
- 刷新失败则跳转登录页

**备选方案**：

- ❌ 定时刷新：浪费请求，可能在非活跃时刷新
- ❌ 手动刷新：用户体验差

### 7. 种子数据

**决策**：提供 SQL 种子脚本，启动时自动执行

**初始数据**：

- 超级管理员：`admin / 123456`（生产需修改）
- 角色：`超级管理员`（拥有所有权限）
- 权限：基础菜单（首页、员工管理、商品管理等）

**理由**：

- 开箱即用，快速验证功能
- SQL 脚本可复用到测试/生产环境

## Risks / Trade-offs

| 风险                        | 缓解措施                                   |
| --------------------------- | ------------------------------------------ |
| Access Token 泄露           | 短期有效（2h），配合 HTTPS 传输            |
| Refresh Token 泄露          | Redis 白名单可主动撤销，修改密码后清空     |
| 权限数据过大导致 Token 膨胀 | 仅存权限编码（字符串数组），不存详细信息   |
| 并发刷新 Token 导致冲突     | 加锁（请求级），同一用户同时仅一个刷新请求 |
| 种子数据密码固定            | 文档明确提示生产环境必须修改               |

## Migration Plan

**部署步骤**：

1. 执行数据库迁移（5 张表 + 种子数据）
2. 部署后端新版本（包含 AuthModule）
3. 部署前端新版本（包含登录页）
4. 验证登录功能（admin/123456）

**回滚策略**：

- 后端：删除 AuthModule，移除全局 JwtGuard
- 前端：回滚到无登录版本
- 数据库：保留表结构（不影响其他功能）

**兼容性**：

- **BREAKING**: 所有接口默认需要登录
- 需同时部署前后端，否则前端无法访问接口

## Open Questions

- ❓ 是否需要"记住我"功能（延长 Refresh Token 有效期）？
  → **暂不需要**，管理后台无此需求
- ❓ 是否需要限制同一账号登录设备数？
  → **暂不需要**，管理员可多设备登录
- ❓ 密码复杂度要求？
  → **暂不限制**，由管理员自行管理（后续可配置）
