<script setup lang="ts">
import ArticleCard from '../global/article-card.vue';
import type { ArticleCardProps } from '~/lib/models/article-card-props';

const projects: ArticleCardProps[] = [
    {
        title: 'jaiden.dev',
        description: 'The site you\'re browing now.',
        image: '/img/jaiden-dev.png',
        tags: ['Nuxt', 'Vue', 'TypeScript', 'Tailwind'],
    },
    {
        title: 'NatureJab Dashboard',
        description: 'Dashboard app for controlling and monitoring Julian Brown\'s vacuum pyrolysis reactor.',
        image: '/img/naturejab-logo.png',
        tags: ['Nuxt', 'Vue', 'TypeScript', 'Tailwind'],
    },
    {
        title: 'osrs-ge-skiller',
        description: 'Helps OSRS players turn their skilling processes into more profitable ventures.',
        image: '/img/osrs-ge-skiller.png',
        tags: ['SvelteKit', 'MongoDB', 'TypeScript', 'Tailwind'],
    },
    {
        title: 'Clique',
        description: 'A social calendar app that transforms event planning with friends into an easy, intuitive experience.',
        image: '/img/clique.png',
        tags: ['React', 'NestJS', 'TypeScript', 'Firebase'],
    },
    {
        title: 'cake',
        description: 'Easy-to-use website builder powered by a rich text editor.',
        image: '/img/cake.png',
        tags: ['VueJS', 'NestJS', 'MongoDB', 'AWS', 'TypeScript', 'Tailwind'],
    },
    {
        title: 'self-aware-grid',
        description: 'Open-source NPM package for enhancing functionality of CSS grids.',
        image: '/img/self-aware-grid.png',
        tags: ['VueJS', 'NestJS', 'MongoDB', 'AWS', 'TypeScript', 'Tailwind'],
    },
];
</script>

<template>
    <div class="my-projects-parent bg-muted p-9">
        <div class="size-for-all-screens">
            <h2 class="text-3xl">
                My projects
            </h2>

            <div class="mt-6">
                <div class="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
                    <article-card
                        v-for="project in projects"
                        :key="project.title"
                        :article-data="project"
                        :to="project.title"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
    * {
        font-family: "Afacad Flux", sans-serif;
    }

    .my-projects-parent {
        z-index: 2;
        opacity: 1;
    }
</style>
