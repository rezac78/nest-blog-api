import { Module } from "@nestjs/common";
import { AboutAdminController } from "./about.controller";
import { AboutService } from "./about.service";

@Module({
  controllers: [AboutAdminController],
  providers: [AboutService],
})
export class AuthModule {}
