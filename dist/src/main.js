"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const path_1 = require("path");
const helmet_1 = __importDefault(require("helmet"));
const config_1 = require("@nestjs/config");
const https_middleware_1 = require("./common/middleware/https.middleware");
const response_interceptor_1 = require("./common/interceptors/response.interceptor");
const global_exception_filter_1 = require("./common/filters/global-exception.filter");
const request_id_middleware_1 = require("./common/middleware/request-id.middleware");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.set("trust proxy", 1);
    app.setGlobalPrefix("api");
    app.disable("x-powered-by");
    app.useStaticAssets((0, path_1.join)(process.cwd(), "uploads"), {
        prefix: "/uploads",
    });
    app.enableCors({
        origin: true,
        credentials: true,
    });
    app.use((0, helmet_1.default)({
        hsts: {
            maxAge: 31536000,
            includeSubDomains: true,
            preload: true,
        },
    }));
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        exceptionFactory: (errors) => {
            const formattedErrors = {};
            const formatErrors = (validationErrors) => {
                for (const error of validationErrors) {
                    if (error.constraints) {
                        formattedErrors[error.property] = Object.values(error.constraints);
                    }
                    if (error.children && error.children.length > 0) {
                        formatErrors(error.children);
                    }
                }
            };
            formatErrors(errors);
            return new common_1.BadRequestException({
                message: "Validation failed",
                errors: formattedErrors,
            });
        },
    }));
    const config = app.get(config_1.ConfigService);
    if (config.get("NODE_ENV") === "production") {
        app.use(https_middleware_1.httpsRedirect);
    }
    app.use(request_id_middleware_1.requestIdMiddleware);
    app.useGlobalInterceptors(new response_interceptor_1.ResponseInterceptor());
    app.useGlobalFilters(new global_exception_filter_1.GlobalExceptionFilter());
    await app.listen(config.get("PORT") ?? 3000);
}
void bootstrap();
//# sourceMappingURL=main.js.map