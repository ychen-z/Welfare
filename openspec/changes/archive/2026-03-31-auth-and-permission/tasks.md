## 1. 数据库迁移

- [x] 1.1 执行 doc/database.sql 中的 5 张权限表创建脚本
- [x] 1.2 创建种子数据 SQL 脚本 (docker/init/02-seed-auth.sql)
- [x] 1.3 插入超级管理员账号 (admin/123456，密码需 bcrypt 加密)
- [x] 1.4 插入默认角色 (超级管理员角色)
- [x] 1.5 插入基础菜单权限 (首页、员工管理、商品管理等)
- [x] 1.6 关联管理员-角色-权限

**验收标准**: docker-compose restart 后表结构和种子数据存在

## 2. 后端依赖安装

- [x] 2.1 安装 @nestjs/jwt @nestjs/passport
- [x] 2.2 安装 passport passport-jwt
- [x] 2.3 安装 bcrypt @types/bcrypt
- [x] 2.4 更新 apps/server/package.json

**验收标准**: pnpm install 成功

## 3. Entity 创建

- [x] 3.1 创建 src/modules/system/entities/user.entity.ts (SysUser)
- [x] 3.2 创建 src/modules/system/entities/role.entity.ts (SysRole)
- [x] 3.3 创建 src/modules/system/entities/permission.entity.ts (SysPermission)
- [x] 3.4 创建 src/modules/system/entities/user-role.entity.ts (SysUserRole)
- [x] 3.5 创建 src/modules/system/entities/role-permission.entity.ts (SysRolePermission)

**验收标准**: Entity 字段与数据库表一致

## 4. Auth Module 基础结构

- [x] 4.1 创建 src/modules/auth/auth.module.ts
- [x] 4.2 创建 src/modules/auth/auth.controller.ts
- [x] 4.3 创建 src/modules/auth/auth.service.ts
- [x] 4.4 创建 src/modules/auth/dto/login.dto.ts (登录请求)
- [x] 4.5 创建 src/modules/auth/dto/auth-response.dto.ts (登录响应)

**验收标准**: Module 能被 AppModule 导入

## 5. JWT 策略配置

- [x] 5.1 创建 src/modules/auth/strategies/jwt.strategy.ts
- [x] 5.2 配置 JWT secret 和 expiration (从环境变量读取)
- [x] 5.3 实现 validate 方法 (从 payload 提取用户信息)
- [x] 5.4 在 AuthModule 中注册 JwtModule

**验收标准**: JWT 策略能正常解析 Token

## 6. 登录逻辑实现

- [x] 6.1 实现 AuthService.validateUser (验证用户名密码)
- [x] 6.2 实现 AuthService.login (生成 Access Token)
- [x] 6.3 实现 AuthService.generateTokens (生成双 Token)
- [x] 6.4 实现 AuthController.login 接口 (POST /api/auth/login)
- [x] 6.5 查询用户的所有角色和权限，嵌入 Token payload

**验收标准**: POST /api/auth/login 返回 accessToken 和 refreshToken

## 7. Refresh Token 管理

- [x] 7.1 实现 AuthService.storeRefreshToken (存 Redis)
- [x] 7.2 实现 AuthService.refreshAccessToken (刷新 Access Token)
- [x] 7.3 实现 AuthController.refresh 接口 (POST /api/auth/refresh)
- [x] 7.4 实现 AuthService.logout (清除 Redis 中的 Refresh Token)
- [x] 7.5 实现 AuthController.logout 接口 (POST /api/auth/logout)

**验收标准**: Refresh Token 存储在 Redis，刷新接口正常

## 8. JWT Guard 实现

- [x] 8.1 创建 src/common/guards/jwt.guard.ts
- [x] 8.2 继承 @nestjs/passport 的 AuthGuard('jwt')
- [x] 8.3 实现 canActivate 方法 (跳过 @Public 标记的接口)
- [x] 8.4 在 AppModule 中注册为全局 Guard

**验收标准**: 未登录访问接口返回 401

## 9. Public Decorator 实现

- [x] 9.1 创建 src/common/decorators/public.decorator.ts
- [x] 9.2 使用 SetMetadata 设置 'isPublic' = true
- [x] 9.3 在 JwtGuard 中检查 Reflector.get('isPublic')
- [x] 9.4 标记 AppController.health 为 @Public

**验收标准**: /api/health 无需登录可访问

## 10. Permission Guard 实现

- [x] 10.1 创建 src/common/guards/permission.guard.ts
- [x] 10.2 实现 canActivate (检查 @RequirePermission 元数据)
- [x] 10.3 从 request.user 中提取 permissions 数组
- [x] 10.4 验证用户是否拥有所需权限

**验收标准**: 无权限访问返回 403

## 11. RequirePermission Decorator 实现

- [x] 11.1 创建 src/common/decorators/require-permission.decorator.ts
- [x] 11.2 使用 SetMetadata 设置 'permissions' = [...codes]
- [x] 11.3 支持传入多个权限码 (AND 逻辑)
- [x] 11.4 创建测试接口验证

**验收标准**: @RequirePermission('test:view') 正常工作

## 12. CurrentUser Decorator 实现

- [x] 12.1 创建 src/common/decorators/current-user.decorator.ts
- [x] 12.2 使用 createParamDecorator 从 request.user 提取
- [x] 12.3 返回 { userId, username, roles, permissions }
- [x] 12.4 在 AuthController 中测试

**验收标准**: @CurrentUser() 能正确获取用户信息

## 13. 登录接口完善

- [x] 13.1 添加 Swagger 文档注解 (@ApiTags, @ApiOperation)
- [x] 13.2 添加请求/响应示例
- [x] 13.3 更新 last_login_at 字段
- [x] 13.4 处理账号禁用情况 (is_active = 0)

**验收标准**: Swagger 文档完整，接口逻辑健壮

## 14. 前端登录页面

- [x] 14.1 更新 apps/admin/src/pages/login.tsx (完整登录表单)
- [x] 14.2 使用 Ant Design Form 组件
- [x] 14.3 添加表单验证 (用户名和密码必填)
- [x] 14.4 实现登录提交逻辑 (调用 POST /api/auth/login)
- [x] 14.5 成功后存储 Token 到 localStorage
- [x] 14.6 跳转到首页

**验收标准**: 登录页面完整，提交后能跳转

## 15. 前端 Token 管理

- [x] 15.1 创建 src/utils/auth.ts (Token 存取工具)
- [x] 15.2 实现 getToken, setToken, removeToken
- [x] 15.3 实现 isAuthenticated (判断是否登录)
- [x] 15.4 更新 request.ts (自动添加 Authorization header)

**验收标准**: Token 能正确存储和读取

## 16. 前端 Token 刷新

- [x] 16.1 修改 request.ts 响应拦截器
- [x] 16.2 检测 401 + TOKEN_EXPIRED 错误码
- [x] 16.3 调用 POST /api/auth/refresh 刷新 Token
- [x] 16.4 更新 localStorage 中的 accessToken
- [x] 16.5 重试原请求
- [x] 16.6 刷新失败则跳转登录页

**验收标准**: Token 过期后自动刷新

## 17. 前端路由守卫

- [x] 17.1 修改 .umirc.ts 添加 access 配置
- [x] 17.2 创建 src/access.ts (权限判断函数)
- [x] 17.3 实现 canAccessRoute (检查 localStorage 中的 Token)
- [x] 17.4 未登录自动跳转 /login

**验收标准**: 未登录访问被拦截

## 18. 前端用户状态管理

- [x] 18.1 创建 src/models/user.ts (umi model)
- [x] 18.2 定义 state: { userInfo, permissions }
- [x] 18.3 实现 fetchUserInfo (解析 Token 获取用户信息)
- [x] 18.4 实现 logout (清除 Token + 跳转登录)

**验收标准**: 用户信息能全局访问

## 19. 前端动态菜单

- [ ] 19.1 创建 src/config/menu.config.ts (菜单配置)
- [ ] 19.2 每个菜单项添加 permission 字段
- [ ] 19.3 在 Layout 中根据用户权限过滤菜单
- [ ] 19.4 只渲染有权限的菜单项

**验收标准**: 菜单根据权限动态显示 (优先级低，可延后)

## 20. 前端权限组件

- [x] 20.1 创建 src/components/Authorized/index.tsx
- [x] 20.2 接收 permission prop
- [x] 20.3 检查当前用户是否拥有该权限
- [x] 20.4 有权限渲染 children，无权限返回 null

**验收标准**: <Authorized permission="xxx"><Button/></Authorized> 正常工作

## 21. 后端健康检查接口标记公开

- [x] 21.1 在 AppController.health 添加 @Public() 装饰器

**验收标准**: /api/health 无需登录可访问

## 22. 后端登录接口标记公开

- [x] 22.1 在 AuthController.login 添加 @Public() 装饰器
- [x] 22.2 在 AuthController.refresh 添加 @Public() 装饰器

**验收标准**: 登录和刷新接口无需先登录

## 23. 集成测试

- [ ] 23.1 启动 Docker 容器 (MySQL + Redis)
- [ ] 23.2 启动后端服务，验证种子数据加载
- [ ] 23.3 使用 Swagger 测试登录接口 (admin/123456)
- [ ] 23.4 启动前端服务
- [ ] 23.5 测试登录流程 (输入账号密码 → 跳转首页)
- [ ] 23.6 测试 Token 过期刷新 (修改 JWT_EXPIRES_IN=1s)
- [ ] 23.7 测试登出功能

**验收标准**: 完整登录流程正常，Token 刷新正常
