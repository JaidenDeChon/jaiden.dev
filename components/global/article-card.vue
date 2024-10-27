<script setup lang="ts">
import type { ArticleCardProps } from '~/lib/models/article-card-props';

defineProps<{
    articleData: ArticleCardProps;
    to: string;
}>();
</script>

<template>
    <nuxt-link
        :to="$props.to"
        class="p-4 flex flex-col gap-3 rounded-md bg-background transition-all border-2 hover:shadow-xl hover:border-background group"
    >
        <!-- Image. -->
        <div class="w-full bg-accent h-56 flex items-center justify-center rounded-md overflow-hidden">
            <nuxt-img
                :src="$props.articleData.image"
                :alt="`Image for ${$props.articleData.title}`"
                class="w-full h-full max-w-full max-h-full object-cover transition-all duration-200 group-hover:scale-105"
            />
        </div>

        <!-- Title. -->
        <p class="text-2xl fancy-text-decoration">
            {{ $props.articleData.title }}
        </p>

        <!-- Tags. -->
        <div class="flex gap-2 flex-wrap mb-3">
            <Badge
                v-for="tag in $props.articleData.tags"
                :key="tag"
                variant="secondary"
                class="bg-brand-yellow hover:bg-brand-yellow text-brand-yellow-foreground dark:bg-brand-yellow dark:hover:bg-brand-yellow dark:text-brand-yellow-foreground"
            >
                {{ tag }}
            </Badge>
        </div>

        <!-- Description. -->
        <p class="fancy-text-decoration text-muted-foreground">
            {{ $props.articleData.description }}
        </p>
    </nuxt-link>
</template>
