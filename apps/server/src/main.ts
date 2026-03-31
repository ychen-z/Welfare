import { NestFactory } from "@nestjs/core";
import { ValidationPipe, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";

import { AppModule } from "./app.module";
import { ResponseInterceptor } from "./common/interceptors/response.interceptor";
import { LoggingInterceptor } from "./common/interceptors/logging.interceptor";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";

async function bootstrap() {
  const logger = new Logger("Bootstrap");
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>("app.port") || 3000;
  const prefix = configService.get<string>("app.prefix") || "api";

  // 设置全局前缀
  app.setGlobalPrefix(prefix);

  // 启用 CORS
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // 全局验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 自动剥离非白名单属性
      forbidNonWhitelisted: true, // 非白名单属性抛出异常
      transform: true, // 自动转换类型
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // 全局拦截器
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new ResponseInterceptor(),
  );

  // 全局异常过滤器
  app.useGlobalFilters(new HttpExceptionFilter());

  // Swagger 文档配置
  const swaggerConfig = new DocumentBuilder()
    .setTitle("Welfal API")
    .setDescription("企业内部员工福利兑换平台 API 文档")
    .setVersion("1.0.0")
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "请输入 JWT Token",
      },
      "JWT",
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(`${prefix}/docs`, app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(port);

  logger.log(
    `🚀 Application is running on: http://localhost:${port}/${prefix}`,
  );
  logger.log(`📚 Swagger docs: http://localhost:${port}/${prefix}/docs`);
}

bootstrap();
