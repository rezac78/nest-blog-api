import { ProjectService } from "./project.service";
import { CreateProjectDto } from "./dto/create-project.dto";
import { UpdateProjectDto } from "./dto/update-project.dto";
export declare class ProjectController {
    private readonly projectService;
    constructor(projectService: ProjectService);
    create(dto: CreateProjectDto): Promise<{
        tools: ({
            tool: {
                id: string;
                name: string;
                slug: string;
                image: string | null;
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
                slug: string;
                image: string | null;
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
                slug: string;
                image: string | null;
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
                slug: string;
                image: string | null;
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
