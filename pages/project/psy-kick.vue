<script setup lang="ts">
import ProjectShowcaseHero from '~/components/project-showcase/project-showcase-title-area.vue';
import { PROJECTS_LIST } from '~/lib/constants/projects/projects-list';
import { ProjectArticleNames } from '~/lib/constants/projects/project-article-enums';

const projectInfo = computed(() =>
    PROJECTS_LIST.find(project => project.title === ProjectArticleNames.PSY_KICK),
);

const { data: article } = await useAsyncData('project-spotlight-psy-kick', () =>
    queryCollection('projectSpotlights')
        .path('/project-spotlights/psy-kick')
        .first(),
);

const technologies = [
    {
        name: 'Nuxt 4',
        icon: 'devicon-plain:nuxtjs',
        description: 'Latest-generation Nuxt providing the frontend, server routes, and API from a single codebase.',
    },
    {
        name: 'Vue',
        icon: 'devicon-plain:vuejs',
        description: 'Reactive component model powering the remote-viewing session and scoring interfaces.',
    },
    {
        name: 'Nuxt UI',
        icon: 'mdi:puzzle-outline',
        description: 'Nuxt UI 4 component library (with Tailwind CSS v4 under the hood) for the entire interface.',
    },
    {
        name: 'Supabase',
        icon: 'devicon-plain:supabase',
        description: 'Postgres database, authentication, and storage backing user accounts and session history.',
    },
    {
        name: 'jpeg-js',
        icon: 'mdi:image-outline',
        description: 'Pure-JavaScript JPEG decoding and encoding for generating and handling target imagery.',
    },
    {
        name: 'Nuxt Fonts',
        icon: 'mdi:format-font',
        description: 'Automatic, privacy-friendly web font optimization via @nuxt/fonts.',
    },
    {
        name: 'TypeScript',
        icon: 'devicon-plain:typescript',
        description: 'End-to-end static typing across the app and the Supabase data layer.',
    },
];
</script>

<template>
    <div
        v-if="projectInfo"
        class="project-article"
    >
        <project-showcase-hero
            :project-header-info="projectInfo"
        />

        <div class="bg-muted py-12">
            <div class="article-column-width px-6 lg:px-0">
                <h2 class="text-2xl font-semibold mb-2">
                    Built With
                </h2>
                <p class="text-muted-foreground mb-8">
                    The tools and libraries behind Psy-Kick.
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

        <ContentRenderer
            v-if="article"
            class="prose prose-slate dark:prose-invert mx-auto mb-6 p-6 lg:px-0"
            :value="article"
            prose
        />
    </div>
</template>

<style>
    .prose img {
        margin: 0 auto !important
    }
</style>
