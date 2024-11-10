<script setup lang="ts">
import ProjectShowcaseTitleArea from '~/components/project-showcase/project-showcase-title-area.vue';
import { PROJECTS_LIST } from '~/lib/constants/projects/projects-list';
import { ProjectArticleNames } from '~/lib/constants/projects/project-article-enums';

const projectInfo = computed(() =>
    PROJECTS_LIST.find(project => project.title === ProjectArticleNames.JAIDEN_DOT_DEV),
);
</script>

<template>
    <div
        v-if="projectInfo"
        class="project-article"
    >
        <project-showcase-title-area
            :project-header-info="projectInfo"
        />
    </div>
</template>
