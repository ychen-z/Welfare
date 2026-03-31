## Context

当前项目是一个全新的企业内部员工福利兑换平台，需要搭建完整的技术基础设施。技术栈已确定：

- 后端：NestJS 10 + TypeScript 5 + TypeORM 0.3 + MySQL 8 + Redis 7
- 前端：React 18 + umi 4 + Ant Design 5 + TailwindCSS
- 包管理：pnpm Monorepo

开发规范已定义在 `doc/开发规范.md`，需要严格遵循。

## Goals / Non-Goals

**Goals:**

- 建立可扩展的 Monorepo 项目结构
- 后端具备完整的基础设施（配置、异常处理、日志、API文档）
- 前端具备完整的基础设施（路由、布局、请求封装）
- 开发环境容器化（MySQL + Redis）

**Non-Goals:**

- 不实现任何业务功能
- 不创建数据库 Entity
- 不实现认证授权

## Decisions

### 1. Monorepo 结构

```
welfal/
├── apps/
│   ├── server/          # NestJS 后端
│   └── admin/           # 管理后台前端
├── packages/
│   └── shared/          # 共享类型/常量
├── docker/
│   └── docker-compose.yml
├── pnpm-workspace.yaml
└── package.json
```

**理由**:

- pnpm workspace 原生支持 Monorepo，性能优于 yarn/npm
- apps 放应用，packages 放共享库，结构清晰
- 后续可轻松添加移动端应用

### 2. 后端统一响应格式

```typescript
{
  code: number; // 0=成功，其他=错误码
  message: string; // 提示信息
  data: T | null; // 业务数据
}
```

**实现方式**:

- 创建 `ResponseInterceptor` 拦截器，自动包装成功响应
- 创建 `HttpExceptionFilter` 过滤器，统一处理异常响应
- Controller 直接返回业务数据，由拦截器统一包装

### 3. 配置管理

使用 NestJS 的 `@nestjs/config` 模块：

- `.env` 文件存储环境变量
- `config/` 目录定义配置 schema
- 支持多环境配置（development/production）

**配置项**:

```
# 数据库
DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_DATABASE

# Redis
REDIS_HOST, REDIS_PORT

# JWT
JWT_SECRET, JWT_EXPIRES_IN, JWT_REFRESH_EXPIRES_IN

# 应用
APP_PORT, APP_PREFIX
```

### 4. 前端请求封装

基于 umi-request 封装：

- 自动添加 Authorization header
- 统一处理响应格式
- 统一处理错误（弹出 message）
- Token 过期自动刷新（后续阶段实现）

### 5. Docker 开发环境

```yaml
services:
  mysql:
    image: mysql:8.0
    ports: "3306:3306"
    volumes: mysql_data

  redis:
    image: redis:7
    ports: "6379:6379"
```

**理由**: 统一开发环境，避免"在我电脑上能跑"问题

## Risks / Trade-offs

| 风险                    | 缓解措施             |
| ----------------------- | -------------------- |
| pnpm 部分开发者不熟悉   | 提供 README 文档说明 |
| umi4 配置与 umi3 不兼容 | 使用官方文档配置     |
| TypeORM 版本兼容性      | 锁定 0.3.x 版本      |

## 文件清单

### 根目录

- `package.json` - 根 package
- `pnpm-workspace.yaml` - workspace 配置
- `.gitignore`
- `README.md`
- `.env.example`

### apps/server/

- `package.json`
- `tsconfig.json`
- `nest-cli.json`
- `src/main.ts`
- `src/app.module.ts`
- `src/app.controller.ts` - 健康检查
- `src/config/` - 配置模块
- `src/common/dto/response.dto.ts`
- `src/common/filters/http-exception.filter.ts`
- `src/common/interceptors/response.interceptor.ts`
- `src/common/interceptors/logging.interceptor.ts`

### apps/admin/

- `package.json`
- `.umirc.ts`
- `tailwind.config.js`
- `src/layouts/index.tsx`
- `src/pages/index.tsx`
- `src/utils/request.ts`

### packages/shared/

- `package.json`
- `src/index.ts`
- `src/types/response.ts`
- `src/constants/error-codes.ts`

### docker/

- `docker-compose.yml`
