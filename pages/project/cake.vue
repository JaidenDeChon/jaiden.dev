<script setup lang="ts">
import ProjectShowcaseHero from '~/components/project-showcase/project-showcase-title-area.vue';
import { PROJECTS_LIST } from '~/lib/constants/projects/projects-list';
import { ProjectArticleNames } from '~/lib/constants/projects/project-article-enums';

const projectInfo = computed(() =>
    PROJECTS_LIST.find(project => project.title === ProjectArticleNames.CAKE),
);
</script>

<template>
    <div
        v-if="projectInfo"
        class="project-article size-for-all-screens"
    >
        <project-showcase-hero
            :project-header-info="projectInfo"
        />

        <content-doc
            class="prose prose-slate dark:prose-invert"
            path="/project-spotlights/cake"
        />
    </div>
</template>
