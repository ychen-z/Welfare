## 1. 初始化 Monorepo

- [x] 1.1 创建根目录 package.json（name: welfal, private: true）
- [x] 1.2 创建 pnpm-workspace.yaml 配置 workspace
- [x] 1.3 创建 .gitignore 文件
- [x] 1.4 创建 .env.example 环境变量模板
- [x] 1.5 创建 README.md 项目说明文档

**验收标准**: pnpm install 能正常执行

## 2. 创建共享包 (packages/shared)

- [x] 2.1 创建 packages/shared/package.json
- [x] 2.2 创建 packages/shared/tsconfig.json
- [x] 2.3 创建 packages/shared/src/index.ts 入口文件
- [x] 2.4 创建 packages/shared/src/types/response.ts 统一响应类型
- [x] 2.5 创建 packages/shared/src/constants/error-codes.ts 错误码常量

**验收标准**: 能被 apps/server 和 apps/admin 引用

## 3. 创建后端骨架 (apps/server)

- [x] 3.1 使用 @nestjs/cli 创建 NestJS 项目
- [x] 3.2 配置 tsconfig.json（开启严格模式）
- [x] 3.3 配置 nest-cli.json
- [x] 3.4 安装依赖：@nestjs/config, @nestjs/typeorm, typeorm, mysql2, ioredis, @nestjs/swagger

**验收标准**: pnpm run start:dev 能启动

## 4. 后端配置模块

- [x] 4.1 创建 src/config/configuration.ts 配置加载函数
- [x] 4.2 创建 src/config/database.config.ts 数据库配置
- [x] 4.3 创建 src/config/redis.config.ts Redis 配置
- [x] 4.4 在 app.module.ts 中注册 ConfigModule

**验收标准**: 能从 .env 读取配置

## 5. 后端数据库连接

- [x] 5.1 在 app.module.ts 中配置 TypeOrmModule
- [x] 5.2 配置连接参数（从环境变量读取）
- [x] 5.3 测试数据库连接成功

**验收标准**: 应用启动时能连接 MySQL

## 6. 后端 Redis 连接

- [x] 6.1 创建 src/common/redis/redis.module.ts
- [x] 6.2 创建 src/common/redis/redis.service.ts
- [x] 6.3 在 app.module.ts 中注册 RedisModule

**验收标准**: 能执行 Redis get/set 操作

## 7. 后端统一响应

- [x] 7.1 创建 src/common/dto/response.dto.ts 响应 DTO
- [x] 7.2 创建 src/common/interceptors/response.interceptor.ts 响应拦截器
- [x] 7.3 在 main.ts 中注册全局拦截器

**验收标准**: 所有响应自动包装为 {code, message, data} 格式

## 8. 后端异常处理

- [x] 8.1 创建 src/common/exceptions/business.exception.ts 业务异常类
- [x] 8.2 创建 src/common/filters/http-exception.filter.ts 异常过滤器
- [x] 8.3 在 main.ts 中注册全局过滤器

**验收标准**: 所有异常返回统一格式

## 9. 后端日志拦截

- [x] 9.1 创建 src/common/interceptors/logging.interceptor.ts 日志拦截器
- [x] 9.2 记录请求方法、URL、耗时
- [x] 9.3 在 main.ts 中注册全局拦截器

**验收标准**: 每个请求都有日志输出

## 10. 后端健康检查

- [x] 10.1 创建 src/app.controller.ts 健康检查接口
- [x] 10.2 返回 {code: 0, data: {timestamp, status: 'ok'}}

**验收标准**: GET /api/health 返回成功

## 11. 后端 Swagger 文档

- [x] 11.1 在 main.ts 中配置 SwaggerModule
- [x] 11.2 设置文档标题、描述、版本
- [x] 11.3 配置路径 /api/docs

**验收标准**: 访问 /api/docs 显示 Swagger UI

## 12. 创建前端骨架 (apps/admin)

- [x] 12.1 使用 create-umi 创建 umi4 项目
- [x] 12.2 安装依赖：antd, @ant-design/icons, tailwindcss
- [x] 12.3 配置 .umirc.ts

**验收标准**: pnpm run dev 能启动

## 13. 前端 TailwindCSS 配置

- [x] 13.1 创建 tailwind.config.js
- [x] 13.2 创建 src/global.css 引入 Tailwind
- [x] 13.3 在 .umirc.ts 中配置样式

**验收标准**: Tailwind 类名生效

## 14. 前端基础布局

- [x] 14.1 创建 src/layouts/index.tsx 主布局
- [x] 14.2 实现 Header 组件（顶部导航）
- [x] 14.3 实现 Sidebar 组件（侧边菜单）
- [x] 14.4 实现内容区域

**验收标准**: 显示完整的后台管理布局

## 15. 前端请求封装

- [x] 15.1 创建 src/utils/request.ts 请求工具
- [x] 15.2 配置 baseURL 和拦截器
- [x] 15.3 处理统一响应格式
- [x] 15.4 处理错误提示

**验收标准**: 能正确调用后端接口

## 16. 前端开发代理

- [x] 16.1 在 .umirc.ts 中配置 proxy
- [x] 16.2 将 /api/\* 代理到 localhost:3000

**验收标准**: 前端能访问后端接口

## 17. 前端首页

- [x] 17.1 创建 src/pages/index.tsx 首页
- [x] 17.2 显示欢迎信息
- [x] 17.3 测试调用健康检查接口

**验收标准**: 首页能显示并调用后端接口

## 18. Docker 开发环境

- [x] 18.1 创建 docker/docker-compose.yml
- [x] 18.2 配置 MySQL 8.0 服务
- [x] 18.3 配置 Redis 7 服务
- [x] 18.4 配置数据持久化 volume

**验收标准**: docker-compose up -d 能启动 MySQL 和 Redis

## 19. 最终验收

- [x] 19.1 启动 Docker 容器（使用本地 MySQL + Docker Redis）
- [x] 19.2 启动后端服务，验证健康检查
- [x] 19.3 启动前端服务，验证页面显示
- [x] 19.4 验证 Swagger 文档可访问
- [x] 19.5 更新 README 文档

**验收标准**: 整体项目能正常运行 ✓

**验收结果**:

- ✅ MySQL 数据库连接成功（本地 MySQL）
- ✅ Redis 连接成功（Docker 容器）
- ✅ 后端健康检查: <http://localhost:3000/api/health>
- ✅ Swagger 文档: <http://localhost:3000/api/docs>
- ✅ 前端页面: <http://localhost:8000>
