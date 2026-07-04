<script setup lang="ts">
import ProjectShowcaseHero from '~/components/project-showcase/project-showcase-title-area.vue';
import { PROJECTS_LIST } from '~/lib/constants/projects/projects-list';
import { ProjectArticleNames } from '~/lib/constants/projects/project-article-enums';

const projectInfo = computed(() =>
    PROJECTS_LIST.find(project => project.title === ProjectArticleNames.GE_SKILLER),
);

const { data: article } = await useAsyncData('project-spotlight-ge-skiller', () =>
    queryCollection('projectSpotlights')
        .path('/project-spotlights/ge-skiller')
        .first(),
);

if (!article.value) {
    throw createError({
        statusCode: 404,
        statusMessage: 'Project article not found',
    });
}

const technologies = [
    {
        name: 'SvelteKit',
        icon: 'devicon-plain:svelte',
        description: 'Full-stack Svelte 5 meta-framework handling file-based routing, server endpoints, and SSR across the app.',
    },
    {
        name: 'TypeScript',
        icon: 'devicon-plain:typescript',
        description: 'End-to-end static typing spanning the UI, data-ingestion scripts, and the OSRS Wiki scraping spider.',
    },
    {
        name: 'MongoDB',
        icon: 'devicon-plain:mongodb',
        description: 'Document store holding ~13,000 in-game items with recursive, self-referencing ingredient trees.',
    },
    {
        name: 'Tailwind CSS',
        icon: 'mdi:tailwind',
        description: 'Utility-first styling for the clean, responsive interface across every route.',
    },
    {
        name: 'shadcn-svelte',
        icon: 'mdi:puzzle-outline',
        description: 'shadcn/ui ported to Svelte, built on bits-ui primitives — accessible components that live in the codebase.',
    },
    {
        name: 'Apache ECharts',
        icon: 'mdi:graph-outline',
        description: 'Renders the animated, interactive ingredient trees that morph as you navigate between items.',
    },
    {
        name: 'Superforms + Zod',
        icon: 'mdi:form-select',
        description: 'sveltekit-superforms paired with Zod schemas for type-safe, validated add/edit item forms.',
    },
];
</script>

<template>
    <div
        v-if="projectInfo && article"
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
                    The tools and libraries behind GE Skiller.
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
