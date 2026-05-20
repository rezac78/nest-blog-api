import { UploadsService } from "./uploads.service";
export declare class UploadsController {
    private readonly uploadsService;
    constructor(uploadsService: UploadsService);
    updateAvatar(file: Express.Multer.File, user: {
        userId: string;
    }): Promise<{
        message: string;
        filePath: string;
    }>;
}
