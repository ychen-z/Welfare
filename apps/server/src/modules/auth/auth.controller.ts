import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  Get,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { Public } from "../../common/decorators/public.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { RequirePermission } from "../../common/decorators/require-permission.decorator";

@ApiTags("认证管理")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "用户登录",
    description: "使用用户名和密码进行登录，成功后返回访问令牌和刷新令牌",
  })
  @ApiResponse({
    status: 200,
    description: "登录成功",
    schema: {
      example: {
        code: 0,
        message: "操作成功",
        data: {
          accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
          refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
          tokenType: "Bearer",
          expiresIn: 7200,
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: "用户名或密码错误" })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.username, loginDto.password);
  }

  @Public()
  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "刷新访问令牌",
    description: "使用刷新令牌获取新的访问令牌",
  })
  @ApiResponse({
    status: 200,
    description: "刷新成功",
    schema: {
      example: {
        code: 0,
        message: "操作成功",
        data: {
          accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
          tokenType: "Bearer",
          expiresIn: 7200,
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: "刷新令牌无效或已过期" })
  async refresh(@Body("refreshToken") refreshToken: string) {
    return this.authService.refreshAccessToken(refreshToken);
  }

  @Post("logout")
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "用户登出",
    description: "清除刷新令牌，用户退出登录",
  })
  @ApiResponse({
    status: 200,
    description: "登出成功",
    schema: {
      example: {
        code: 0,
        message: "操作成功",
        data: null,
      },
    },
  })
  async logout(@Body("refreshToken") refreshToken: string) {
    await this.authService.logout(refreshToken);
    return null;
  }

  @Get("profile")
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "获取当前用户信息",
    description: "获取当前登录用户的详细信息（测试 @CurrentUser 装饰器）",
  })
  @ApiResponse({
    status: 200,
    description: "获取成功",
    schema: {
      example: {
        code: 0,
        message: "操作成功",
        data: {
          userId: 1,
          username: "admin",
          roles: ["超级管理员"],
          permissions: ["sys:user:view", "sys:user:add"],
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: "未登录或令牌无效" })
  async getProfile(@CurrentUser() user: any) {
    return user;
  }

  @Get("test/permission")
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @RequirePermission("sys:user:view")
  @ApiOperation({
    summary: "测试权限控制",
    description:
      "需要 sys:user:view 权限才能访问（测试 @RequirePermission 装饰器）",
  })
  @ApiResponse({
    status: 200,
    description: "有权限",
    schema: {
      example: {
        code: 0,
        message: "操作成功",
        data: {
          message: "你有 sys:user:view 权限！",
          requiredPermission: "sys:user:view",
        },
      },
    },
  })
  @ApiResponse({ status: 403, description: "无权限" })
  async testPermission() {
    return {
      message: "你有 sys:user:view 权限！",
      requiredPermission: "sys:user:view",
    };
  }
}
