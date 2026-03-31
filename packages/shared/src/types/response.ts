/**
 * 统一响应格式
 */
export interface ApiResponse<T = unknown> {
  /** 状态码：0=成功，其他=错误码 */
  code: number;
  /** 提示信息 */
  message: string;
  /** 业务数据 */
  data: T | null;
}

/**
 * 分页请求参数
 */
export interface PaginationQuery {
  /** 页码，从1开始 */
  page?: number;
  /** 每页数量，默认10 */
  pageSize?: number;
}

/**
 * 分页响应数据
 */
export interface PaginationData<T> {
  /** 数据列表 */
  list: T[];
  /** 总数 */
  total: number;
  /** 当前页码 */
  page: number;
  /** 每页数量 */
  pageSize: number;
  /** 总页数 */
  totalPages: number;
}

/**
 * 带分页的响应
 */
export type PaginatedResponse<T> = ApiResponse<PaginationData<T>>;
