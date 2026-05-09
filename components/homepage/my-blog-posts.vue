<script setup lang="ts">
import ArticleCard from '../global/article-card.vue';
import { BLOG_POST_LIST } from '~/lib/constants/blog-posts/blog-post-list';
</script>

<template>
    <div class="p-9">
        <div class="size-for-all-screens">
            <h2 class="text-3xl">
                Blog
            </h2>

            <div class="mt-6">
                <ul class="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
                    <li
                        v-for="post in BLOG_POST_LIST"
                        :key="post.title"
                    >
                        <article-card
                            :article-header-data="post"
                            :to="post.path"
                            class="h-full"
                        />
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
