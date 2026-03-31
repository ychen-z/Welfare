import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { Response, Request } from "express";
import { BusinessException } from "../exceptions/business.exception";
import { ResponseDto } from "../dto/response.dto";

/**
 * 全局异常过滤器
 * 捕获所有异常并返回统一格式
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let code: number;
    let message: string;
    let httpStatus: HttpStatus;

    if (exception instanceof BusinessException) {
      // 业务异常
      code = exception.getErrorCode();
      message = exception.message;
      httpStatus = exception.getStatus();
    } else if (exception instanceof HttpException) {
      // HTTP 异常
      httpStatus = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === "object" && exceptionResponse !== null) {
        const responseObj = exceptionResponse as Record<string, unknown>;
        code =
          typeof responseObj["code"] === "number"
            ? responseObj["code"]
            : httpStatus;
        message =
          typeof responseObj["message"] === "string"
            ? responseObj["message"]
            : Array.isArray(responseObj["message"])
              ? responseObj["message"].join(", ")
              : exception.message;
      } else {
        code = httpStatus;
        message = exception.message;
      }
    } else if (exception instanceof Error) {
      // 未知错误
      httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
      code = 1000; // UNKNOWN_ERROR
      message = "系统错误，请稍后重试";

      // 记录错误日志
      this.logger.error(
        `${request.method} ${request.url} - ${exception.message}`,
        exception.stack,
      );
    } else {
      // 其他情况
      httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
      code = 1000;
      message = "系统错误，请稍后重试";
    }

    const responseBody = ResponseDto.error(code, message);

    response.status(httpStatus).json(responseBody);
  }
}
