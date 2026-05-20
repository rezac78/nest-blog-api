"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const library_1 = require("@prisma/client/runtime/library");
const error_codes_1 = require("../constants/error-codes");
let GlobalExceptionFilter = class GlobalExceptionFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        let status = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        let message = "خطای داخلی سرور";
        let errorCode = error_codes_1.ERROR_CODES.SYSTEM.INTERNAL_ERROR;
        let errors = null;
        if (exception instanceof common_1.HttpException) {
            status = exception.getStatus();
            const res = exception.getResponse();
            if (typeof res === "string") {
                message = res;
            }
            else if (typeof res === "object") {
                message = res.message || message;
                if (res.errors) {
                    errors = res.errors;
                    errorCode = error_codes_1.ERROR_CODES.SYSTEM.VALIDATION_ERROR;
                }
                if (Array.isArray(res.message)) {
                    errors = { general: res.message };
                    errorCode = error_codes_1.ERROR_CODES.SYSTEM.VALIDATION_ERROR;
                }
            }
        }
        if (exception instanceof library_1.PrismaClientKnownRequestError) {
            status = common_1.HttpStatus.BAD_REQUEST;
            errorCode = error_codes_1.ERROR_CODES.SYSTEM.DATABASE_ERROR;
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
};
exports.GlobalExceptionFilter = GlobalExceptionFilter;
exports.GlobalExceptionFilter = GlobalExceptionFilter = __decorate([
    (0, common_1.Catch)()
], GlobalExceptionFilter);
//# sourceMappingURL=global-exception.filter.js.map