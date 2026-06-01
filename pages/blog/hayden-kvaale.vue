<script setup lang="ts">
import ProjectShowcaseHero from '~/components/project-showcase/project-showcase-title-area.vue';
import { BLOG_POST_LIST } from '~/lib/constants/blog-posts/blog-post-list';
import { BlogPostArticleNames } from '~/lib/constants/blog-posts/blog-post-article-enums';

const blogPostInfo = computed(() =>
    BLOG_POST_LIST.find(post => post.title === BlogPostArticleNames.HAYDEN_KVAALE),
);

const { data: article } = await useAsyncData('blog-post-hayden-kvaale', () =>
    queryCollection('blogPosts')
        .path('/blog-posts/hayden-kvaale')
        .first(),
);

if (!article.value) {
    throw createError({
        statusCode: 404,
        statusMessage: 'Blog post not found',
    });
}
</script>

<template>
    <div
        v-if="blogPostInfo && article"
        class="project-article"
    >
        <project-showcase-hero
            :project-header-info="blogPostInfo"
            title-prefix=""
        />

        <ContentRenderer
            class="prose prose-slate dark:prose-invert mx-auto mb-6 p-6 lg:px-0"
            :value="article"
            prose
        />
    </div>
</template>

<style>
    .prose img {
        margin: 0 auto !important
    }
</style>
