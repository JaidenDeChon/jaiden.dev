export interface externalLinkWithIcon {
    name: string;
    url: string;
    icon: string;
}

export interface ProjectHeader {
    title: string;
    path?: string;
    description?: string;
    tags?: string[];
    /**
     * Card and share-preview image: a site-relative path, or an absolute URL
     * when the project publishes its own share image and should stay the
     * source of truth for it.
     */
    image?: string;
    relatedLinks?: externalLinkWithIcon[];
}
