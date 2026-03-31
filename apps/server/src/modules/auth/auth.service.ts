import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

import { SysUser } from "../system/entities/user.entity";
import { RedisService } from "../../common/redis/redis.service";
import { BusinessException } from "../../common/exceptions/business.exception";
import { ErrorCodes } from "@welfal/shared";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(SysUser)
    private userRepository: Repository<SysUser>,
    private jwtService: JwtService,
    private configService: ConfigService,
    private redisService: RedisService,
  ) {}

  /**
   * 验证用户
   */
  async validateUser(
    username: string,
    password: string,
  ): Promise<SysUser | null> {
    const user = await this.userRepository.findOne({
      where: { username, isDeleted: 0 },
      relations: ["roles", "roles.permissions"],
    });

    if (!user) {
      return null;
    }

    // 验证密码
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return null;
    }

    return user;
  }

  /**
   * 登录
   */
  async login(username: string, password: string) {
    // 验证用户
    const user = await this.validateUser(username, password);
    if (!user) {
      throw new BusinessException(
        ErrorCodes.PASSWORD_WRONG,
        "用户名或密码错误",
      );
    }

    // 检查账号是否启用
    if (user.isActive === 0) {
      throw new BusinessException(ErrorCodes.ACCOUNT_DISABLED, "账号已被禁用");
    }

    // 收集角色和权限
    const roles = user.roles
      .filter((role: any) => role.isActive === 1)
      .map((role: any) => role.code);
    const permissionSet = new Set<string>();
    user.roles.forEach((role: any) => {
      if (role.isActive === 1) {
        role.permissions.forEach((permission: any) => {
          if (permission.isActive === 1) {
            permissionSet.add(permission.code);
          }
        });
      }
    });
    const permissions = Array.from(permissionSet);

    // 生成 Token
    const { accessToken, refreshToken, expiresIn } = await this.generateTokens(
      user.id,
      user.username,
      roles,
      permissions,
    );

    // 更新最后登录时间
    await this.userRepository.update(user.id, {
      lastLoginAt: new Date(),
    });

    return {
      accessToken,
      refreshToken,
      tokenType: "Bearer",
      expiresIn,
    };
  }

  /**
   * 生成 Access Token 和 Refresh Token
   */
  async generateTokens(
    userId: number,
    username: string,
    roles: string[],
    permissions: string[],
  ) {
    const payload = {
      userId,
      username,
      roles,
      permissions,
    };

    // 生成 Access Token
    const accessToken = this.jwtService.sign(payload);

    // 生成 Refresh Token
    const tokenId = uuidv4();
    const refreshPayload = { userId, username, tokenId };
    const refreshToken = this.jwtService.sign(refreshPayload, {
      expiresIn: parseInt(
        this.configService.get<string>("JWT_REFRESH_EXPIRES_IN") || "604800",
      ), // 7天
    });

    // 存储 Refresh Token 到 Redis
    await this.storeRefreshToken(userId, tokenId, { username, roles });

    const expiresIn = 7200; // 2小时

    return { accessToken, refreshToken, expiresIn };
  }

  /**
   * 存储 Refresh Token 到 Redis
   */
  async storeRefreshToken(
    userId: number,
    tokenId: string,
    data: { username: string; roles: string[] },
  ) {
    const key = `auth:refresh:${userId}:${tokenId}`;
    const ttl = 7 * 24 * 60 * 60; // 7天
    await this.redisService.set(key, JSON.stringify(data), ttl);
  }

  /**
   * 刷新 Access Token
   */
  async refreshAccessToken(refreshToken: string) {
    try {
      // 验证 Refresh Token
      const payload = this.jwtService.verify(refreshToken);
      const { userId, username, tokenId } = payload;

      // 检查 Redis 中是否存在
      const key = `auth:refresh:${userId}:${tokenId}`;
      const data = await this.redisService.get(key);
      if (!data) {
        throw new UnauthorizedException("Refresh Token 已失效");
      }

      // 查询用户最新权限
      const user = await this.userRepository.findOne({
        where: { id: userId, isDeleted: 0 },
        relations: ["roles", "roles.permissions"],
      });

      if (!user || user.isActive === 0) {
        throw new UnauthorizedException("用户不存在或已禁用");
      }

      // 收集角色和权限
      const roles = user.roles
        .filter((role: any) => role.isActive === 1)
        .map((role: any) => role.code);
      const permissionSet = new Set<string>();
      user.roles.forEach((role: any) => {
        if (role.isActive === 1) {
          role.permissions.forEach((permission: any) => {
            if (permission.isActive === 1) {
              permissionSet.add(permission.code);
            }
          });
        }
      });
      const permissions = Array.from(permissionSet);

      // 生成新的 Access Token
      const newPayload = { userId, username, roles, permissions };
      const accessToken = this.jwtService.sign(newPayload);

      return { accessToken, tokenType: "Bearer", expiresIn: 7200 };
    } catch (error) {
      throw new UnauthorizedException("Refresh Token 无效");
    }
  }

  /**
   * 登出
   */
  async logout(refreshToken: string): Promise<void> {
    try {
      // 验证 Refresh Token
      const payload = this.jwtService.verify(refreshToken);
      const { userId, tokenId } = payload;

      // 删除该用户的所有 Refresh Token
      const pattern = `auth:refresh:${userId}:*`;
      const client = this.redisService.getClient();
      const keys = await client.keys(pattern);
      if (keys.length > 0) {
        await client.del(...keys);
      }
    } catch (error) {
      // 忽略无效的 Refresh Token
    }
  }
}
