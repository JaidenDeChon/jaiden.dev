import type { ProjectHeader } from '~/lib/models/project-header';
import {
    PROEJCT_PATH_PREFIX,
    ProjectArticleNames,
    ProjectArticlePaths,
} from '~/lib/constants/projects/project-article-enums';

export const PROJECTS_LIST: ProjectHeader[] = [
    {
        title: ProjectArticleNames.JAIDEN_DOT_DEV,
        path: `${PROEJCT_PATH_PREFIX}/${ProjectArticlePaths.JAIDEN_DOT_DEV}`,
        description: 'The site you\'re browsing now.',
        image: '/img/jaiden-dev.jpeg',
        tags: ['Nuxt', 'Vue', 'TypeScript', 'Tailwind'],
        relatedLinks: [
            {
                name: 'Source Code',
                url: 'https://github.com/JaidenDeChon/jaiden.dev',
                icon: 'mdi:github',
            },
        ],
    },
    {
        title: ProjectArticleNames.GE_SKILLER,
        path: `${PROEJCT_PATH_PREFIX}/${ProjectArticlePaths.GE_SKILLER}`,
        description:
            'Unexpected lessons in perserverance, delegation, and loss',
        image: '/img/osrs-ge-skiller.png',
        tags: ['SvelteKit', 'MongoDB', 'TypeScript', 'Tailwind', 'Personal'],
        relatedLinks: [
            {
                name: 'Source Code',
                url: 'https://github.com/JaidenDeChon/ge-skiller',
                icon: 'mdi:github',
            },
            {
                name: 'Live site',
                url: 'https://ge-skiller.netlify.app/',
                icon: 'mdi:earth',
            },
        ],
    },
    {
        title: ProjectArticleNames.CAKE,
        path: `${PROEJCT_PATH_PREFIX}/${ProjectArticlePaths.CAKE}`,
        description:
            'Easy-to-use website builder powered by a rich text editor.',
        image: '/img/cake.png',
        tags: ['VueJS', 'NestJS', 'MongoDB', 'AWS', 'TypeScript', 'Tailwind'],
        relatedLinks: [
            {
                name: 'Source Code',
                url: 'https://github.com/JaidenDeChon/cake',
                icon: 'mdi:github',
            },
        ],
    },
    {
        title: ProjectArticleNames.SELF_AWARE_GRID,
        path: `${PROEJCT_PATH_PREFIX}/${ProjectArticlePaths.SELF_AWARE_GRID}`,
        description:
            'Open-source NPM package for enhancing functionality of CSS grids.',
        image: '/img/self-aware-grid.png',
        tags: ['VueJS', 'NestJS', 'MongoDB', 'AWS', 'TypeScript', 'Tailwind'],
        relatedLinks: [
            {
                name: 'Source Code',
                url: 'https://github.com/JaidenDeChon/SelfAwareGrid',
                icon: 'mdi:github',
            },
            {
                name: 'Live demo',
                url: 'https://jaidendechon.github.io/SelfAwareGrid-Demo/',
                icon: 'mdi:earth',
            },
        ],
    },
] as const;
