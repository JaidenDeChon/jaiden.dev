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
</script>

<template>
    <div
        v-if="projectInfo"
        class="project-article"
    >
        <project-showcase-hero
            :project-header-info="projectInfo"
        />

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
