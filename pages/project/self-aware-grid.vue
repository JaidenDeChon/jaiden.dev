<script setup lang="ts">
import 'highlight.js/styles/base16/dracula.min.css';
import hljs from 'highlight.js';
import ProjectShowcaseHero from '~/components/project-showcase/project-showcase-title-area.vue';
import { PROJECTS_LIST } from '~/lib/constants/projects/projects-list';
import { ProjectArticleNames } from '~/lib/constants/projects/project-article-enums';

const projectInfo = computed(() =>
    PROJECTS_LIST.find(project => project.title === ProjectArticleNames.SELF_AWARE_GRID),
);

function highlightCodeBlocks(): void {
    document.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightElement(block);
    });
}

onMounted(async () => {
    await nextTick();
    highlightCodeBlocks();
});
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
            path="/project-spotlights/self-aware-grid"
        />
    </div>
</template>
