import { PrismaService } from "../../../database/prisma/prisma.service";
export declare class UploadsService {
    private prisma;
    constructor(prisma: PrismaService);
    private ensureDir;
    processImage(file: Express.Multer.File, folder: string, width: number, height?: number): Promise<string>;
    deleteFile(path: string): void;
    deleteOldAvatar(userId: string): Promise<void>;
    updateUserAvatar(userId: string, avatarPath: string): Promise<{
        id: string;
        mobile: string | null;
        createdAt: Date;
        email: string | null;
        username: string | null;
        passwordHash: string | null;
        firstName: string | null;
        lastName: string | null;
        gender: string | null;
        birthDate: Date | null;
        avatar: string | null;
        githubLink: string | null;
        linkedInLink: string | null;
        country: string | null;
        city: string | null;
        jobStatus: string | null;
        description: string | null;
        whatIveBeenWorkingOn: string | null;
        isActive: boolean;
        isMobileVerified: boolean;
        phoneVerifiedAt: Date | null;
        updatedAt: Date;
    }>;
}
