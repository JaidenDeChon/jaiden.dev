import type { ProjectHeader } from '~/lib/models/project-header';
import {
    PROJECT_PATH_PREFIX,
    ProjectArticleNames,
    ProjectArticlePaths,
} from '~/lib/constants/projects/project-article-enums';

export const PROJECTS_LIST: ProjectHeader[] = [
    {
        title: ProjectArticleNames.LUCY_VPMS,
        path: `${PROJECT_PATH_PREFIX}/${ProjectArticlePaths.LUCY_VPMS}`,
        description:
            'Veterinary practice management system for scheduling, invoicing, and inventory',
        image: '/img/lucy-vpms.png',
        tags: ['Nuxt', 'Vue', 'Supabase'],
        relatedLinks: [
            {
                name: 'Live site',
                url: 'https://lucy.vet',
                icon: 'mdi:earth',
            },
        ],
    },
    {
        title: ProjectArticleNames.JAIDEN_DOT_DEV,
        path: `${PROJECT_PATH_PREFIX}/${ProjectArticlePaths.JAIDEN_DOT_DEV}`,
        description: 'The site you\'re browsing now. Built with Nuxt and NuxtUI',
        image: '/img/share-preview.png',
        tags: ['Nuxt 3', 'Vue 3', 'TypeScript', 'Tailwind CSS', 'Shadcn-vue'],
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
        path: `${PROJECT_PATH_PREFIX}/${ProjectArticlePaths.GE_SKILLER}`,
        description: 'A useful tool for poor Old School RuneScape characters',
        image: '/img/ge-skiller.png',
        tags: ['SvelteKit', 'MongoDB', 'Tailwind', 'Personal'],
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
        title: ProjectArticleNames.PSY_KICK,
        path: `${PROJECT_PATH_PREFIX}/${ProjectArticlePaths.PSY_KICK}`,
        description:
            'An app for strengthening and tracking one\'s skills in Remote Viewing, modeled after real CIA protocols',
        image: '/img/psy-kick.png',
        tags: ['Nuxt', 'Vue', 'Supabase'],
        relatedLinks: [
            {
                name: 'Source Code',
                url: 'https://github.com/JaidenDeChon/psy_kick',
                icon: 'mdi:github',
            },
            {
                name: 'Live site',
                url: 'https://psy-kick.me',
                icon: 'mdi:earth',
            },
        ],
    },
    {
        title: ProjectArticleNames.UAP_GERB_KNOWLEDGE_BASE,
        path: `${PROJECT_PATH_PREFIX}/${ProjectArticlePaths.UAP_GERB_KNOWLEDGE_BASE}`,
        description:
            'A wiki of the topics, people, places, and events covered on the UAP Gerb YouTube channel',
        image: '/img/uap-gerb-knowledge-base.png',
        tags: ['Nuxt 4', 'Vue', 'Obsidian', 'Python', 'Claude API'],
        relatedLinks: [
            {
                name: 'Source Code',
                url: 'https://github.com/JaidenDeChon/UAP-Gerb-Knowledge-Base',
                icon: 'mdi:github',
            },
            {
                name: 'Live site',
                url: 'https://uapgdb.netlify.app',
                icon: 'mdi:earth',
            },
        ],
    },
    {
        title: ProjectArticleNames.SELF_AWARE_GRID,
        path: `${PROJECT_PATH_PREFIX}/${ProjectArticlePaths.SELF_AWARE_GRID}`,
        description:
            'Open-source NPM package for enhancing functionality of CSS grids',
        image: '/img/self-aware-grid.png',
        tags: ['Open source', 'CSS', 'JavaScript', 'TypeScript'],
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
