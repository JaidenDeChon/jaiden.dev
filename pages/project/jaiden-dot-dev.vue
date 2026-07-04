<script setup lang="ts">
import ProjectShowcaseTitleArea from '~/components/project-showcase/project-showcase-title-area.vue';
import { PROJECTS_LIST } from '~/lib/constants/projects/projects-list';
import { ProjectArticleNames } from '~/lib/constants/projects/project-article-enums';

const projectInfo = computed(() =>
    PROJECTS_LIST.find(project => project.title === ProjectArticleNames.JAIDEN_DOT_DEV),
);

const technologies = [
    {
        name: 'Nuxt 3',
        icon: 'devicon-plain:nuxtjs',
        description: 'Meta-framework providing file-based routing, SSR, and a rich module ecosystem on top of Vue 3.',
    },
    {
        name: 'Vue 3',
        icon: 'devicon-plain:vuejs',
        description: 'Progressive JavaScript framework powering the reactive UI throughout the site.',
    },
    {
        name: 'TypeScript',
        icon: 'devicon-plain:typescript',
        description: 'End-to-end static typing for a safer, more maintainable codebase.',
    },
    {
        name: 'Tailwind CSS',
        icon: 'devicon-plain:tailwindcss',
        description: 'Utility-first CSS framework handling all layout, spacing, color, and responsive design.',
    },
    {
        name: 'shadcn-vue',
        icon: 'mdi:puzzle-outline',
        description: 'Component library based on Radix Vue — components live in your codebase, fully customizable.',
    },
    {
        name: 'Nuxt Content',
        icon: 'mdi:file-document-outline',
        description: 'File-based CMS for Markdown, powering the project articles rendered on this site.',
    },
    {
        name: 'globe.gl',
        icon: 'mdi:earth',
        description: 'WebGL-powered 3D globe with animated coordinate rings, arcs, and orbit particles.',
    },
    {
        name: 'Pinia',
        icon: 'mdi:database-outline',
        description: "Vue's official state management, with persistent state via pinia-plugin-persistedstate.",
    },
];
</script>

<template>
    <div
        v-if="projectInfo"
        class="project-article"
    >
        <project-showcase-title-area
            :project-header-info="projectInfo"
        />

        <div class="bg-muted py-12">
            <div class="article-column-width px-6 lg:px-0">
                <h2 class="text-2xl font-semibold mb-2">
                    Built With
                </h2>
                <p class="text-muted-foreground mb-8">
                    The tools and libraries that power jaiden.dev.
                </p>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div
                        v-for="tech in technologies"
                        :key="tech.name"
                        class="flex flex-col gap-3 p-5 rounded-lg border bg-background"
                    >
                        <div class="flex items-center gap-3">
                            <Icon
                                :name="tech.icon"
                                class="h-6 w-6 shrink-0"
                            />
                            <span class="font-medium text-sm">{{ tech.name }}</span>
                        </div>
                        <p class="text-sm text-muted-foreground leading-relaxed">
                            {{ tech.description }}
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <content-doc
            class="prose prose-slate dark:prose-invert mx-auto mb-6 p-6 lg:px-0"
            path="/project-spotlights/jaiden-dot-dev"
        />
    </div>
</template>
