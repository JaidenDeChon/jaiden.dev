import type { ProjectHeader } from '~/lib/models/project-header';
import {
    BLOG_POST_PATH_PREFIX,
    BlogPostArticleNames,
    BlogPostArticlePaths,
} from '~/lib/constants/blog-posts/blog-post-article-enums';

export const BLOG_POST_LIST: ProjectHeader[] = [
    {
        title: BlogPostArticleNames.HAYDEN_KVAALE,
        path: `${BLOG_POST_PATH_PREFIX}/${BlogPostArticlePaths.HAYDEN_KVAALE}`,
        description: 'In remembrance of my oldest friend, Hayden Kvaale',
        image: '/img/ge-skiller-article-images/img-11.jpg',
        tags: ['Personal'],
    },
] as const;
