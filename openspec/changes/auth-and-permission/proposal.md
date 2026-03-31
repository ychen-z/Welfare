## Why

当前项目骨架已完成，但缺少身份认证和权限控制机制，所有接口处于未保护状态。需要实现完整的 JWT 认证体系和基于 RBAC 的细粒度权限控制，为后续业务模块提供安全基础。这是所有后续业务功能的前置依赖。

## What Changes

- 新增 JWT 认证机制（Access Token + Refresh Token）
- 新增 5 表 RBAC 权限模型（用户、角色、权限、用户角色、角色权限）
- 新增登录接口（用户名密码登录）
- 新增 Token 刷新接口
- 新增 JwtGuard 全局守卫（验证 Token）
- 新增 PermissionGuard 权限守卫（验证权限码）
- 新增 @CurrentUser 装饰器（获取当前登录用户）
- 新增 @RequirePermission 装饰器（声明权限要求）
- 新增种子数据（超级管理员 + 基础角色 + 菜单权限）
- 前端：登录页面 + Token 管理 + 路由守卫 + 菜单动态渲染

## Capabilities

### New Capabilities

- `user-authentication`: JWT 认证机制，包括登录、Token 生成、Token 验证、Token 刷新
- `rbac-permission`: 基于角色的访问控制（RBAC），支持用户-角色-权限三层模型，菜单级和按钮级权限控制
- `auth-guards`: NestJS 全局守卫和装饰器，用于保护接口和获取当前用户信息
- `admin-frontend-auth`: 管理后台前端的登录、状态管理、路由守卫、菜单渲染

### Modified Capabilities

<!-- 无需修改现有 capability -->

## Impact

**后端影响**：

- 新增 5 个 Entity：`SysUser`, `SysRole`, `SysPermission`, `SysUserRole`, `SysRolePermission`
- 新增 `AuthModule`：登录、JWT 相关逻辑
- 新增 `guards/`：`JwtGuard`, `PermissionGuard`
- 新增 `decorators/`：`@CurrentUser`, `@RequirePermission`, `@Public`
- 所有业务接口默认受 JwtGuard 保护（除非标记 `@Public`）

**前端影响**：

- 新增登录页面：`/login`
- 新增登录状态管理（localStorage + umi model）
- 修改 `request.ts`：自动添加 Authorization header、Token 过期自动刷新
- 新增路由守卫：未登录自动跳转登录页
- 修改布局：根据权限动态渲染菜单

**数据库影响**：

- 新增 5 张表：`sys_user`, `sys_role`, `sys_permission`, `sys_user_role`, `sys_role_permission`
- 新增种子数据：超管账号 `admin/123456`、默认角色、菜单权限

**依赖影响**：

- 后端新增依赖：`@nestjs/jwt`, `@nestjs/passport`, `passport`, `passport-jwt`, `bcrypt`
- 前端无新增依赖（umi4 内置状态管理）

**接口兼容性**：

- **BREAKING**：所有现有接口默认需要登录后才能访问（健康检查接口除外）
- 后续所有新接口都需要通过 `@RequirePermission()` 声明权限
