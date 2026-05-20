import { PrismaService } from "../../../../database/prisma/prisma.service";
import { ConfigService } from "@nestjs/config";
import { JwtPayload } from "../../../common/interfaces/jwt-payload.interface";
declare const JwtStrategy_base: new (...args: any) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    private prisma;
    constructor(prisma: PrismaService, config: ConfigService);
    validate(payload: JwtPayload): Promise<{
        userId: string;
        mobile: string | null;
        roles: string[];
    }>;
}
export {};
