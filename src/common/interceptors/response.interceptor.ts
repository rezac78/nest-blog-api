import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { map } from "rxjs/operators";

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      map((response) => {
        const result: any = {
          success: true,
        };

        if (response?.message) result.message = response.message;

        if (response?.data !== undefined) {
          result.data = response.data;
        } else if (!response?.pagination) {
          result.data = response;
        }

        if (response?.pagination && Object.keys(response.pagination).length) {
          result.pagination = response.pagination;
        }

        return result;
      }),
    );
  }
}
