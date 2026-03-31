import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ResponseDto } from "../dto/response.dto";

/**
 * 统一响应拦截器
 * 自动将 Controller 返回值包装为 { code: 0, message: '操作成功', data: ... }
 */
@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
  T,
  ResponseDto<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseDto<T>> {
    return next.handle().pipe(
      map((data) => {
        // 如果已经是 ResponseDto 格式，直接返回
        if (data instanceof ResponseDto) {
          return data;
        }
        // 如果是对象且有 code 字段，认为已经是标准格式
        if (data && typeof data === "object" && "code" in data) {
          return data as ResponseDto<T>;
        }
        // 其他情况，包装为标准响应
        return ResponseDto.success(data);
      }),
    );
  }
}
