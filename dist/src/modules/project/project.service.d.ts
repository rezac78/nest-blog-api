import { CreateProjectDto } from "./dto/create-project.dto";
import { UpdateProjectDto } from "./dto/update-project.dto";
import { PrismaService } from "../../../database/prisma/prisma.service";
import { UploadsService } from "../uploads/uploads.service";
export declare class ProjectService {
    private prisma;
    private uploadsService;
    constructor(prisma: PrismaService, uploadsService: UploadsService);
    create(dto: CreateProjectDto): Promise<{
        tools: ({
            tool: {
                id: string;
                name: string;
            };
        } & {
            toolId: string;
            projectId: string;
        })[];
        links: {
            id: string;
            name: string;
            url: string;
            projectId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        shortDescription: string | null;
        longDescription: string | null;
        slug: string;
        image: string | null;
    }>;
    findAll(): Promise<({
        tools: ({
            tool: {
                id: string;
                name: string;
            };
        } & {
            toolId: string;
            projectId: string;
        })[];
        links: {
            id: string;
            name: string;
            url: string;
            projectId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        shortDescription: string | null;
        longDescription: string | null;
        slug: string;
        image: string | null;
    })[]>;
    findOne(id: string): Promise<({
        tools: ({
            tool: {
                id: string;
                name: string;
            };
        } & {
            toolId: string;
            projectId: string;
        })[];
        links: {
            id: string;
            name: string;
            url: string;
            projectId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        shortDescription: string | null;
        longDescription: string | null;
        slug: string;
        image: string | null;
    }) | null>;
    update(id: string, dto: UpdateProjectDto): Promise<{
        tools: ({
            tool: {
                id: string;
                name: string;
            };
        } & {
            toolId: string;
            projectId: string;
        })[];
        links: {
            id: string;
            name: string;
            url: string;
            projectId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        shortDescription: string | null;
        longDescription: string | null;
        slug: string;
        image: string | null;
    }>;
    uploadImage(id: string, file: Express.Multer.File): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        shortDescription: string | null;
        longDescription: string | null;
        slug: string;
        image: string | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        shortDescription: string | null;
        longDescription: string | null;
        slug: string;
        image: string | null;
    }>;
}
