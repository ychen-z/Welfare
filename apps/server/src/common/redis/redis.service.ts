import {
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
  Logger,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Redis from "ioredis";

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private client: Redis;

  constructor(private configService: ConfigService) {
    this.client = new Redis({
      host: this.configService.get<string>("redis.host"),
      port: this.configService.get<number>("redis.port"),
      password: this.configService.get<string>("redis.password") || undefined,
      db: this.configService.get<number>("redis.db") || 0,
      lazyConnect: true,
    });
  }

  async onModuleInit() {
    try {
      await this.client.connect();
      this.logger.log("Redis connected successfully");
    } catch (error) {
      this.logger.error("Redis connection failed", error);
    }
  }

  async onModuleDestroy() {
    await this.client.quit();
    this.logger.log("Redis disconnected");
  }

  /**
   * 获取 Redis 客户端实例
   */
  getClient(): Redis {
    return this.client;
  }

  /**
   * 获取值
   */
  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  /**
   * 设置值
   */
  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (ttlSeconds) {
      await this.client.set(key, value, "EX", ttlSeconds);
    } else {
      await this.client.set(key, value);
    }
  }

  /**
   * 删除键
   */
  async del(key: string): Promise<number> {
    return this.client.del(key);
  }

  /**
   * 设置过期时间
   */
  async expire(key: string, seconds: number): Promise<number> {
    return this.client.expire(key, seconds);
  }

  /**
   * 检查键是否存在
   */
  async exists(key: string): Promise<number> {
    return this.client.exists(key);
  }

  /**
   * SETNX - 仅当键不存在时设置（用于分布式锁/幂等控制）
   * @returns 1 设置成功，0 键已存在
   */
  async setnx(
    key: string,
    value: string,
    ttlSeconds?: number,
  ): Promise<boolean> {
    if (ttlSeconds) {
      // SET key value NX EX seconds
      const result = await this.client.set(key, value, "EX", ttlSeconds, "NX");
      return result === "OK";
    }
    const result = await this.client.setnx(key, value);
    return result === 1;
  }

  /**
   * 自增
   */
  async incr(key: string): Promise<number> {
    return this.client.incr(key);
  }

  /**
   * 自减
   */
  async decr(key: string): Promise<number> {
    return this.client.decr(key);
  }
}
