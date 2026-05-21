import { UpsertAboutDto } from "./dto/about.dto";
import { AboutService } from "./about.service";
export declare class AboutAdminController {
    private readonly aboutService;
    constructor(aboutService: AboutService);
    getAbout(): Promise<({
        jobs: {
            id: string;
            link: string;
            position: string;
            image: string | null;
            company: string;
            companyURL: string | null;
            location: string;
            locationType: string;
            positionType: string;
            startDate: string;
            endDate: string | null;
            positionId: string;
            responsibilities: string[];
            aboutId: string;
        }[];
        educations: {
            id: string;
            link: string;
            image: string | null;
            location: string;
            university: string;
            major: string;
            degree: string;
            startYear: string;
            endYear: string;
            aboutId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        aboutHtml: string;
        resumeFileBase64: string | null;
        resumeLink: string | null;
    }) | null>;
    upsertAbout(dto: UpsertAboutDto): Promise<{
        jobs: {
            id: string;
            link: string;
            position: string;
            image: string | null;
            company: string;
            companyURL: string | null;
            location: string;
            locationType: string;
            positionType: string;
            startDate: string;
            endDate: string | null;
            positionId: string;
            responsibilities: string[];
            aboutId: string;
        }[];
        educations: {
            id: string;
            link: string;
            image: string | null;
            location: string;
            university: string;
            major: string;
            degree: string;
            startYear: string;
            endYear: string;
            aboutId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        aboutHtml: string;
        resumeFileBase64: string | null;
        resumeLink: string | null;
    }>;
}
