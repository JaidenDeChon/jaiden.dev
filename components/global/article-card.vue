<script setup lang="ts">
// import { Badge } from '../ui/badge';
import type { ArticleCardProps } from '~/lib/models/article-card-props';

defineProps<{ articleData: ArticleCardProps }>();
</script>

<template>
    <div class="article-card flex flex-col gap-3">
        <!-- Image. -->
        <div class="w-full bg-accent h-56 overflow-hidden rounded-md">
            <nuxt-img
                :src="$props.articleData.image"
                :alt="`Image for ${$props.articleData.title}`"
                class="w-full max-h-56 object-cover transition-shadow"
            />
        </div>

        <!-- Title. -->
        <p class="text-2xl">
            {{ $props.articleData.title }}
        </p>

        <!-- Tags. -->
        <div class="flex gap-2 flex-wrap">
            <Badge
                v-for="tag in $props.articleData.tags"
                :key="tag"
                variant="secondary"
            >
                {{ tag }}
            </Badge>
        </div>

        <!-- Description. -->
        <p>{{ $props.articleData.description }}</p>
    </div>
</template>
