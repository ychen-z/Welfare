import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { APP_GUARD } from "@nestjs/core";

import configuration from "./config/configuration";
import databaseConfig from "./config/database.config";
import redisConfig from "./config/redis.config";

import { RedisModule } from "./common/redis/redis.module";
import { AuthModule } from "./modules/auth/auth.module";
import { EmployeeModule } from "./modules/employee/employee.module";
import { JwtAuthGuard } from "./common/guards/jwt.guard";
import { PermissionGuard } from "./common/guards/permission.guard";
import { AppController } from "./app.controller";

@Module({
  imports: [
    // 配置模块
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration, databaseConfig, redisConfig],
      envFilePath: [".env.local", ".env", "../../.env.local", "../../.env"],
    }),

    // 数据库模块
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: "mysql",
        host: configService.get<string>("database.host"),
        port: configService.get<number>("database.port"),
        username: configService.get<string>("database.username"),
        password: configService.get<string>("database.password"),
        database: configService.get<string>("database.database"),
        entities: [__dirname + "/**/*.entity{.ts,.js}"],
        synchronize: false,
        logging: process.env.NODE_ENV !== "production",
        timezone: "+08:00",
        charset: "utf8mb4_unicode_ci",
      }),
      inject: [ConfigService],
    }),

    // Redis 模块
    RedisModule,

    // 认证模块
    AuthModule,

    // 员工管理模块
    EmployeeModule,
  ],
  controllers: [AppController],
  providers: [
    // 全局 JWT Guard
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    // 全局 Permission Guard
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
  ],
})
export class AppModule {}
