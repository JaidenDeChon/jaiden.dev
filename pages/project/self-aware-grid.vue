<script setup lang="ts">
import ProjectShowcaseHero from '~/components/project-showcase/project-showcase-title-area.vue';
import { PROJECTS_LIST } from '~/lib/constants/projects/projects-list';
import { ProjectArticleNames } from '~/lib/constants/projects/project-article-enums';

const projectInfo = computed(() =>
    PROJECTS_LIST.find(project => project.title === ProjectArticleNames.SELF_AWARE_GRID),
);

const { data: article } = await useAsyncData('project-spotlight-self-aware-grid', () =>
    queryCollection('projectSpotlights')
        .path('/project-spotlights/self-aware-grid')
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
        name: 'TypeScript',
        icon: 'devicon-plain:typescript',
        description: 'The entire package is authored in vanilla TypeScript with a fully typed public API.',
    },
    {
        name: 'Zero Dependencies',
        icon: 'mdi:package-variant-closed',
        description: 'Ships with no runtime dependencies, keeping the install footprint tiny and conflict-free.',
    },
    {
        name: 'Native DOM APIs',
        icon: 'mdi:language-javascript',
        description: 'Measures grids and reacts to resize events using plain DOM and event listeners — no framework required.',
    },
    {
        name: 'CSS Grid',
        icon: 'mdi:grid',
        description: 'Extends the native CSS Grid layout with the positional and adjacency awareness it lacks out of the box.',
    },
    {
        name: 'npm',
        icon: 'mdi:npm',
        description: 'Published as an open-source package on the npm registry, installable in any project.',
    },
    {
        name: 'Framework-agnostic',
        icon: 'mdi:widgets-outline',
        description: 'Operates directly on DOM elements, so it drops into plain HTML, Vue, React, or Svelte alike.',
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
                    A deliberately tiny, dependency-free toolset.
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
