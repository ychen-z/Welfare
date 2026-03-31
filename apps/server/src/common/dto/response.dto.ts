import { ApiProperty } from "@nestjs/swagger";

/**
 * 统一响应 DTO
 */
export class ResponseDto<T = unknown> {
  @ApiProperty({ description: "状态码：0=成功，其他=错误码", example: 0 })
  code: number;

  @ApiProperty({ description: "提示信息", example: "操作成功" })
  message: string;

  @ApiProperty({ description: "业务数据" })
  data: T | null;

  constructor(code: number, message: string, data: T | null = null) {
    this.code = code;
    this.message = message;
    this.data = data;
  }

  static success<T>(data: T, message = "操作成功"): ResponseDto<T> {
    return new ResponseDto(0, message, data);
  }

  static error(code: number, message: string): ResponseDto<null> {
    return new ResponseDto(code, message, null);
  }
}

/**
 * 分页数据 DTO
 */
export class PaginationDto<T> {
  @ApiProperty({ description: "数据列表" })
  list: T[];

  @ApiProperty({ description: "总数", example: 100 })
  total: number;

  @ApiProperty({ description: "当前页码", example: 1 })
  page: number;

  @ApiProperty({ description: "每页数量", example: 10 })
  pageSize: number;

  @ApiProperty({ description: "总页数", example: 10 })
  totalPages: number;

  constructor(list: T[], total: number, page: number, pageSize: number) {
    this.list = list;
    this.total = total;
    this.page = page;
    this.pageSize = pageSize;
    this.totalPages = Math.ceil(total / pageSize);
  }
}
