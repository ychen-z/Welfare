import { Controller, Get } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { Public } from "./common/decorators/public.decorator";

@ApiTags("系统")
@Controller()
export class AppController {
  @Get("health")
  @Public()
  @ApiOperation({ summary: "健康检查" })
  @ApiResponse({
    status: 200,
    description: "服务正常",
    schema: {
      type: "object",
      properties: {
        code: { type: "number", example: 0 },
        message: { type: "string", example: "操作成功" },
        data: {
          type: "object",
          properties: {
            timestamp: { type: "string", example: "2024-01-01T00:00:00.000Z" },
            status: { type: "string", example: "ok" },
          },
        },
      },
    },
  })
  health() {
    return {
      timestamp: new Date().toISOString(),
      status: "ok",
    };
  }
}
