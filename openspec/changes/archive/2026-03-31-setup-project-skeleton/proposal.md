## Why

项目需要一个可运行的基础骨架，作为后续所有功能开发的基础。当前项目是一个空目录，需要搭建 Monorepo 结构、后端基础设施、前端基础设施和开发环境，才能开始业务功能的开发。

## What Changes

### 后端 (NestJS)

- 初始化 pnpm Monorepo 工作区
- 创建 NestJS 项目骨架 (apps/server)
- 配置 TypeORM + MySQL 数据库连接
- 配置 Redis 连接
- 创建统一响应格式 (code/message/data)
- 创建全局异常过滤器
- 创建请求日志拦截器
- 配置 Swagger API 文档
- 配置环境变量管理

### 前端 (React + umi)

- 创建 umi4 项目骨架 (apps/admin)
- 配置基础路由框架
- 创建基础布局 (Layout)
- 封装统一请求方法
- 配置 TailwindCSS
- 配置开发代理

### 基础设施

- 创建 docker-compose.yml (MySQL + Redis 开发环境)
- 创建共享包结构 (packages/shared)
- 配置 .gitignore
- 创建项目 README

## Capabilities

### New Capabilities

- `server-core`: 后端核心基础设施，包括统一响应、异常处理、日志拦截、配置管理
- `admin-core`: 前端核心基础设施，包括路由、布局、请求封装、样式配置

### Modified Capabilities

（无，这是新项目）

## Impact

### 受影响范围

- **目录结构**: 创建完整的 Monorepo 结构
- **依赖**: 安装后端和前端的基础依赖包
- **配置文件**: 创建多个配置文件（tsconfig、eslint、docker-compose 等）
- **开发环境**: 需要 Docker 运行 MySQL 和 Redis

### 非目标（不在本阶段范围）

- 不创建任何业务模块（员工、商品、订单等）
- 不创建数据库表（Entity）
- 不实现登录认证
- 不实现权限控制

### 验收标准

- 后端能启动，访问 `/api/health` 返回成功响应
- 前端能启动，显示空白布局页面
- Swagger 文档能正常访问
- Docker 容器（MySQL + Redis）能正常启动
