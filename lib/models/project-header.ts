export interface externalLinkWithIcon {
    name: string;
    url: string;
    icon: string;
}

export interface ProjectHeader {
    title: string;
    path: string;
    description?: string;
    tags?: string[];
    image?: string;
    relatedLinks?: externalLinkWithIcon[];
}
