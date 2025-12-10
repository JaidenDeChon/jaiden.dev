<script setup lang="ts">
import ProjectShowcaseHero from '~/components/project-showcase/project-showcase-title-area.vue';
import { PROJECTS_LIST } from '~/lib/constants/projects/projects-list';
import { ProjectArticleNames } from '~/lib/constants/projects/project-article-enums';

const projectInfo = computed(() =>
    PROJECTS_LIST.find(project => project.title === ProjectArticleNames.GE_SKILLER),
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

        <content-doc
            class="prose prose-slate dark:prose-invert mx-auto mb-6 p-6 lg:px-0"
            path="/project-spotlights/ge-skiller/ge-skiller-1"
        />

        <video
            src="/img/ge-skiller-article-images/img-2.mp4"
            class="my-4 mx-auto max-w-sm rounded-md shadow-md"
            controls
            muted
            loop
            playsinline
        />

        <content-doc
            class="prose prose-slate dark:prose-invert mx-auto mb-6 p-6 lg:px-0"
            path="/project-spotlights/ge-skiller/ge-skiller-2"
        />

        <video
            src="/img/ge-skiller-article-images/img-3.mp4"
            class="my-4 mx-auto max-w-sm rounded-md shadow-md"
            controls
            muted
            loop
            playsinline
        />

        <content-doc
            class="prose prose-slate dark:prose-invert mx-auto mb-6 p-6 lg:px-0"
            path="/project-spotlights/ge-skiller/ge-skiller-3"
        />
    </div>
</template>

<style>
    .prose img {
        margin: 0 auto !important
    }
</style>
