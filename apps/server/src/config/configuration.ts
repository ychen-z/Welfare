/**
 * 应用配置加载
 */
export default () => ({
  app: {
    port: parseInt(process.env.APP_PORT || "3000", 10),
    prefix: process.env.APP_PREFIX || "api",
  },
  database: {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "3306", 10),
    username: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_DATABASE || "welfal",
  },
  redis: {
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT || "6379", 10),
  },
  jwt: {
    secret: process.env.JWT_SECRET || "default-secret-change-me",
    expiresIn: process.env.JWT_EXPIRES_IN || "2h",
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  },
});
