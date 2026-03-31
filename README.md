# Welfal - 企业内部员工福利兑换平台

企业内部员工福利积分兑换系统，支持积分发放、商品管理、订单兑换等功能。

## 技术栈

- **后端**: NestJS 10 + TypeORM 0.3 + MySQL 8 + Redis 7
- **前端**: React 18 + umi 4 + Ant Design 5 + TailwindCSS
- **包管理**: pnpm Monorepo

## 项目结构

```
welfal/
├── apps/
│   ├── server/          # NestJS 后端服务
│   └── admin/           # 管理后台前端
├── packages/
│   └── shared/          # 共享类型/常量
├── docker/
│   └── docker-compose.yml
├── doc/                 # 项目文档
└── openspec/            # OpenSpec 规格文档
```

## 快速开始

### 1. 环境要求

- Node.js >= 18.0.0
- pnpm >= 8.0.0
- Docker & Docker Compose

### 2. 安装依赖

```bash
# 安装 pnpm（如未安装）
npm install -g pnpm

# 安装项目依赖
pnpm install
```

### 3. 启动开发环境

```bash
# 启动 MySQL 和 Redis
cd docker && docker-compose up -d

# 复制环境变量配置
cp .env.example .env

# 启动后端服务
pnpm dev:server

# 启动前端服务（新终端）
pnpm dev:admin
```

### 4. 访问地址

- 前端页面: http://localhost:8000
- 后端 API: http://localhost:3000/api
- Swagger 文档: http://localhost:3000/api/docs

## 开发命令

```bash
# 启动后端开发服务
pnpm dev:server

# 启动前端开发服务
pnpm dev:admin

# 构建所有项目
pnpm build

# 代码检查
pnpm lint
```

## 文档

- [产品需求文档](./doc/prd.md)
- [开发规范](./doc/开发规范.md)
- [数据库设计](./doc/database.sql)
- [实施计划](./doc/实施计划.md)

## License

PRIVATE - 仅限内部使用
