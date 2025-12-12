<script setup lang="ts">
import ProjectShowcaseTitleArea from '~/components/project-showcase/project-showcase-title-area.vue';
import { PROJECTS_LIST } from '~/lib/constants/projects/projects-list';
import { ProjectArticleNames } from '~/lib/constants/projects/project-article-enums';

const projectInfo = computed(() =>
    PROJECTS_LIST.find(project => project.title === ProjectArticleNames.JAIDEN_DOT_DEV),
);

const seoTitle = computed(() => projectInfo.value
    ? `Project Spotlight: ${projectInfo.value.title}`
    : 'Project Spotlight',
);
const seoDescription = computed(() => projectInfo.value?.description);

useSeoMeta(() => ({
    title: seoTitle.value,
    ogTitle: seoTitle.value,
    twitterTitle: seoTitle.value,
    description: seoDescription.value,
    ogDescription: seoDescription.value,
    twitterDescription: seoDescription.value,
}));
</script>

<template>
    <div
        v-if="projectInfo"
        class="project-article"
    >
        <project-showcase-title-area
            :project-header-info="projectInfo"
        />

        <content-doc
            class="size-for-all-screens"
            :head="false"
            path="/project-spotlights/jaiden-dot-dev"
        />
    </div>
</template>
