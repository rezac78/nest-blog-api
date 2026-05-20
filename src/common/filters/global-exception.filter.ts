import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from "@nestjs/common";

import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { ERROR_CODES } from "../constants/error-codes";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = "خطای داخلی سرور";
    let errorCode = ERROR_CODES.SYSTEM.INTERNAL_ERROR;
    let errors: any = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res: any = exception.getResponse();

      if (typeof res === "string") {
        message = res;
      } else if (typeof res === "object") {
        message = res.message || message;

        if (res.errors) {
          errors = res.errors;
          errorCode = ERROR_CODES.SYSTEM.VALIDATION_ERROR;
        }

        if (Array.isArray(res.message)) {
          errors = { general: res.message };
          errorCode = ERROR_CODES.SYSTEM.VALIDATION_ERROR;
        }
      }
    }

    if (exception instanceof PrismaClientKnownRequestError) {
      status = HttpStatus.BAD_REQUEST;
      errorCode = ERROR_CODES.SYSTEM.DATABASE_ERROR;

      switch (exception.code) {
        case "P2002":
          message = "اطلاعات تکراری است";
          break;
        case "P2025":
          message = "رکورد موردنظر یافت نشد";
          break;
        default:
          message = "خطای پایگاه داده";
      }
    }

    response.status(status).json({
      success: false,
      statusCode: status,
      message,
      errorCode,
      path: request.url,
      timestamp: new Date().toISOString(),
      requestId: request.requestId,
      errors,
    });
  }
}
