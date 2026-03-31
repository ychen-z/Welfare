/**
 * Token 管理工具
 */

const TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

/**
 * 获取 Access Token
 */
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * 设置 Access Token
 */
export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

/**
 * 移除 Access Token
 */
export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

/**
 * 获取 Refresh Token
 */
export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

/**
 * 设置 Refresh Token
 */
export function setRefreshToken(token: string): void {
  localStorage.setItem(REFRESH_TOKEN_KEY, token);
}

/**
 * 移除 Refresh Token
 */
export function removeRefreshToken(): void {
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

/**
 * 判断是否已登录
 */
export function isAuthenticated(): boolean {
  const token = getToken();
  return !!token;
}

/**
 * 清除所有认证信息
 */
export function clearAuth(): void {
  removeToken();
  removeRefreshToken();
}

/**
 * 解析 JWT Token（不验证签名）
 */
export function parseToken(token: string): any {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
}

/**
 * 获取当前用户信息（从Token解析）
 */
export function getCurrentUser(): {
  userId: number;
  username: string;
  roles: string[];
  permissions: string[];
} | null {
  const token = getToken();
  if (!token) return null;
  return parseToken(token);
}
