export declare class CreateProjectLinkDto {
    name: string;
    url: string;
}
export declare class CreateProjectDto {
    title: string;
    shortDescription?: string;
    longDescription?: string;
    slug: string;
    image?: string;
    tools?: string[];
    links?: CreateProjectLinkDto[];
}
