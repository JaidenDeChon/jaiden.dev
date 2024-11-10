<script setup lang="ts">
import ProjectShowcaseHero from '~/components/project-showcase/project-showcase-hero.vue';
import { PROJECTS_LIST } from '~/lib/constants/projects/projects-list';
import { ProjectArticleNames } from '~/lib/constants/projects/project-article-enums';

const projectInfo = computed(() =>
    PROJECTS_LIST.find(project => project.title === ProjectArticleNames.CLIQUE),
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
    </div>
</template>
