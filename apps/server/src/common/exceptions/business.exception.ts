import { HttpException, HttpStatus } from "@nestjs/common";

/**
 * 业务异常类
 * 用于抛出业务逻辑错误，会被异常过滤器捕获并返回统一格式
 */
export class BusinessException extends HttpException {
  private readonly errorCode: number;

  constructor(
    code: number,
    message: string,
    httpStatus: HttpStatus = HttpStatus.OK,
  ) {
    super({ code, message }, httpStatus);
    this.errorCode = code;
  }

  getErrorCode(): number {
    return this.errorCode;
  }

  /**
   * 快速创建常见业务异常
   */
  static throwError(code: number, message: string): never {
    throw new BusinessException(code, message);
  }
}
