import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { message } from "antd";
import { getToken, setToken, getRefreshToken, clearAuth } from "./auth";

// 响应数据类型
interface ApiResponse<T = unknown> {
  code: number;
  message: string;
  data: T;
}

// 创建 axios 实例
const request = axios.create({
  baseURL: "/api",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 是否正在刷新 Token
let isRefreshing = false;
// 重试队列
let requestsQueue: Array<(token: string) => void> = [];

// 请求拦截器
request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 从 localStorage 获取 token
    const token = getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

// 响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const { code, message: msg, data } = response.data;

    // 业务成功
    if (code === 0) {
      return data as AxiosResponse<ApiResponse>["data"];
    }

    // Token 过期
    if (code === 2001 || code === 2002) {
      clearAuth();
      message.error("登录已过期，请重新登录");
      // 跳转登录页
      window.location.href = "/login";
      return Promise.reject(new Error(msg));
    }

    // 其他业务错误
    message.error(msg || "请求失败");
    return Promise.reject(new Error(msg));
  },
  (error: AxiosError<ApiResponse>) => {
    // HTTP 错误
    if (error.response) {
      const { status, data } = error.response;
      switch (status) {
        case 401:
          message.error("未授权，请登录");
          window.location.href = "/login";
          break;
        case 403:
          message.error("没有权限访问");
          break;
        case 404:
          message.error("请求的资源不存在");
          break;
        case 500:
          message.error("服务器错误");
          break;
        default:
          message.error(data?.message || `请求失败 (${status})`);
      }
    } else if (error.request) {
      message.error("网络错误，请检查网络连接");
    } else {
      message.error("请求配置错误");
    }
    return Promise.reject(error);
  },
);

export default request;

// 快捷方法
export const get = <T = unknown>(
  url: string,
  params?: Record<string, unknown>,
) => request.get<unknown, T>(url, { params });

export const post = <T = unknown>(
  url: string,
  data?: Record<string, unknown>,
) => request.post<unknown, T>(url, data);

export const put = <T = unknown>(url: string, data?: Record<string, unknown>) =>
  request.put<unknown, T>(url, data);

export const del = <T = unknown>(url: string) =>
  request.delete<unknown, T>(url);
