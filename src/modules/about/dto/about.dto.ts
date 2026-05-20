export class UpsertAboutDto {
  aboutHtml?: string;
  resumeFileBase64?: string;
  resumeLink?: string;
  jobs?: {
    position?: string;
    company?: string;
    companyURL?: string;
    image?: string;
    location?: string;
    locationType?: string;
    positionType?: string;
    startDate?: string;
    endDate?: string;
    positionId?: string;
    link?: string;
    responsibilities?: string[];
  }[];
  educations?: {
    university?: string;
    major?: string;
    image?: string;
    location?: string;
    degree?: string;
    startYear?: string;
    endYear?: string;
    link?: string;
  }[];
}
