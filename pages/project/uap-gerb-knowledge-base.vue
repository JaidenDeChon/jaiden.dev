<script setup lang="ts">
import ProjectShowcaseHero from '~/components/project-showcase/project-showcase-title-area.vue';
import { PROJECTS_LIST } from '~/lib/constants/projects/projects-list';
import { ProjectArticleNames } from '~/lib/constants/projects/project-article-enums';

const projectInfo = computed(() =>
    PROJECTS_LIST.find(project => project.title === ProjectArticleNames.UAP_GERB_KNOWLEDGE_BASE),
);

const technologies = [
    {
        name: 'Nuxt 4',
        icon: 'devicon-plain:nuxtjs',
        description: 'Latest-generation Nuxt serving the wiki, its Nitro routes, and the baked-in vault index from one codebase.',
    },
    {
        name: 'Vue',
        icon: 'devicon-plain:vuejs',
        description: 'Reactive component model behind the sidebar tree, command palette, hover previews, and note pages.',
    },
    {
        name: 'Nuxt Content',
        icon: 'mdi:file-document-outline',
        description: 'Parses the Obsidian vault, rewriting [[wikilinks]] and callouts into markdown the renderer understands.',
    },
    {
        name: 'Obsidian',
        icon: 'simple-icons:obsidian',
        description: 'Initially built with Obsidian — over 1,000 interlinked notes on people, organizations, locations, concepts, events, and operations.',
    },
    {
        name: 'Tailwind CSS',
        icon: 'mdi:tailwind',
        description: 'Tailwind v4, wired through its Vite plugin, for the near-black UFO-hunter aesthetic in light and dark themes.',
    },
    {
        name: 'shadcn-nuxt',
        icon: 'mdi:puzzle-outline',
        description: 'shadcn/ui components built on reka-ui primitives, living in the codebase rather than behind a dependency.',
    },
    {
        name: 'force-graph + PixiJS',
        icon: 'mdi:graph-outline',
        description: 'WebGL-rendered knowledge graph — a full-vault site map plus a local map of each note\'s neighbors.',
    },
    {
        name: 'Python + Claude API',
        icon: 'simple-icons:claude',
        description: 'An ingestion pipeline that pulls channel videos and transcripts, then uses Claude to extract entities into vault notes.',
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
                    The tools and libraries behind the UAP Gerb Knowledge Base.
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
    </div>
</template>
