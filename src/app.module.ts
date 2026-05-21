import { Module } from "@nestjs/common";
import { ThrottlerModule, ThrottlerGuard } from "@nestjs/throttler";
import { APP_GUARD } from "@nestjs/core";
import { ConfigModule } from "@nestjs/config";
import { envValidation } from "./config/env.validation";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { PrismaModule } from "database/prisma/prisma.module";
import { AuthModule } from "./modules/auth/auth.module";
import { UsersModule } from "./modules/users/users.module";
import { UploadsModule } from "./modules/uploads/uploads.module";
import { ProjectModule } from "./modules/project/project.module";

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), "uploads"),
      serveRoot: "/uploads",
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envValidation,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    UploadsModule,
    ProjectModule,
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60,
          limit: 100,
        },
      ],
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
