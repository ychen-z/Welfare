import { registerAs } from "@nestjs/config";

export default registerAs("database", () => ({
  type: "mysql" as const,
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3306", 10),
  username: process.env.DB_USERNAME || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_DATABASE || "welfal",
  entities: ["dist/**/*.entity{.ts,.js}"],
  synchronize: false, // 生产环境禁用，使用 migration
  logging: process.env.NODE_ENV !== "production",
  timezone: "+08:00",
  charset: "utf8mb4",
}));
