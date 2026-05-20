import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { BadRequestException, ValidationPipe } from "@nestjs/common";
import { join } from "path";
import helmet from "helmet";
import { ConfigService } from "@nestjs/config";
import { httpsRedirect } from "./common/middleware/https.middleware";
import { NestExpressApplication } from "@nestjs/platform-express";
import { ResponseInterceptor } from "./common/interceptors/response.interceptor";
import { GlobalExceptionFilter } from "./common/filters/global-exception.filter";
import { requestIdMiddleware } from "./common/middleware/request-id.middleware";
import { ValidationError } from "class-validator";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.set("trust proxy", 1);
  // baseUrl /api/test
  app.setGlobalPrefix("api");
  // app.enableCors({
  // origin: ["https://yourdomain.com"],
  // credentials: true,
  //   });
  app.disable("x-powered-by");
  app.useStaticAssets(join(process.cwd(), "uploads"), {
    prefix: "/uploads",
  });

  app.enableCors({
    origin: true, // در Production باید محدودش کنیم به دامنه‌های مشخص
    credentials: true,
  });
  app.use(
    helmet({
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      },
    }),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors: ValidationError[]) => {
        const formattedErrors = {};

        const formatErrors = (validationErrors: ValidationError[]) => {
          for (const error of validationErrors) {
            if (error.constraints) {
              formattedErrors[error.property] = Object.values(
                error.constraints,
              );
            }

            if (error.children && error.children.length > 0) {
              formatErrors(error.children);
            }
          }
        };

        formatErrors(errors);

        return new BadRequestException({
          message: "Validation failed",
          errors: formattedErrors,
        });
      },
    }),
  );
  const config = app.get(ConfigService);
  if (config.get("NODE_ENV") === "production") {
    app.use(httpsRedirect);
  }
  app.use(requestIdMiddleware);
  app.useGlobalInterceptors(new ResponseInterceptor());

  app.useGlobalFilters(new GlobalExceptionFilter());
  await app.listen(config.get<number>("PORT") ?? 3000);
}

void bootstrap();
