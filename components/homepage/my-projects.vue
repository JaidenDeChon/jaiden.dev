<script setup lang="ts">
import ArticleCard from '../global/article-card.vue';
import { PROJECTS_LIST } from '~/lib/constants/projects/projects-list';
</script>

<template>
    <div
        id="my-projects-parent"
        class="bg-muted p-9"
    >
        <div class="size-for-all-screens">
            <h2 class="text-3xl">
                My projects
            </h2>

            <div class="mt-6">
                <ul class="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
                    <li
                        v-for="project in PROJECTS_LIST"
                        :key="project.title"
                    >
                        <nuxt-link
                            :to="{ path: project.path }"
                        >
                            <article-card
                                :article-header-data="project"
                                :to="project.path"
                                class="h-full"
                            />
                        </nuxt-link>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<style scoped>
    * {
        font-family: "Afacad Flux", sans-serif;
    }
</style>
