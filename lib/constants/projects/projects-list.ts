import type { ProjectHeader } from '~/lib/models/project-header';
import { PROEJCT_PATH_PREFIX, ProjectArticleNames, ProjectArticlePaths } from '~/lib/constants/projects/project-article-enums';

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
        title: ProjectArticleNames.NATUREJAB_DASHBOARD,
        path: `${PROEJCT_PATH_PREFIX}/${ProjectArticlePaths.NATUREJAB_DASHBOARD}`,
        description: 'Dashboard app for controlling and monitoring Julian Brown\'s vacuum pyrolysis reactor.',
        image: '/img/naturejab-logo.png',
        tags: ['Nuxt', 'Vue', 'TypeScript', 'Tailwind'],
        relatedLinks: [
            {
                name: 'Source Code',
                url: 'https://github.com/JaidenDeChon/naturejab-dashboard',
                icon: 'mdi:github',
            },
        ],
    },
    {
        title: ProjectArticleNames.OSRS_GE_SKILLER,
        path: `${PROEJCT_PATH_PREFIX}/${ProjectArticlePaths.OSRS_GE_SKILLER}`,
        description: 'Helps OSRS players turn their skilling processes into more profitable ventures.',
        image: '/img/osrs-ge-skiller.png',
        tags: ['SvelteKit', 'MongoDB', 'TypeScript', 'Tailwind'],
        relatedLinks: [
            {
                name: 'Source Code',
                url: 'https://github.com/JaidenDeChon/osrs-ge-skiller',
                icon: 'mdi:github',
            },
            {
                name: 'Open osrs-ge-skiller',
                url: 'https://osrs-ge-skiller.netlify.app/',
                icon: 'mdi:earth',
            },
        ],
    },
    {
        title: ProjectArticleNames.CLIQUE,
        path: `${PROEJCT_PATH_PREFIX}/${ProjectArticlePaths.CLIQUE}`,
        description: 'A social calendar app that transforms event planning with friends into an easy, intuitive experience.',
        image: '/img/clique.png',
        tags: ['React', 'TypeScript', 'Firebase'],
        relatedLinks: [
            {
                name: 'LinkedIn',
                url: 'https://linkedin.com/company/makeaclique',
                icon: 'mdi:linkedin',
            },
            {
                name: 'Open Clique website',
                url: 'https://www.makeaclique.com/',
                icon: 'mdi:earth',
            },
        ],
    },
    {
        title: ProjectArticleNames.CAKE,
        path: `${PROEJCT_PATH_PREFIX}/${ProjectArticlePaths.CAKE}`,
        description: 'Easy-to-use website builder powered by a rich text editor.',
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
        description: 'Open-source NPM package for enhancing functionality of CSS grids.',
        image: '/img/self-aware-grid.png',
        tags: ['VueJS', 'NestJS', 'MongoDB', 'AWS', 'TypeScript', 'Tailwind'],
        relatedLinks: [
            {
                name: 'Source Code',
                url: 'https://github.com/JaidenDeChon/SelfAwareGrid',
                icon: 'mdi:github',
            },
            {
                name: 'Open demo',
                url: 'https://jaidendechon.github.io/SelfAwareGrid-Demo/',
                icon: 'mdi:earth',
            },
        ],
    },
] as const;
