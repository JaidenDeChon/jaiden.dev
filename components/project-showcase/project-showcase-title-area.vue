<script setup lang="ts">
import type { ProjectHeader } from '~/lib/models/project-header';

const route = useRoute();
const props = defineProps<{ projectHeaderInfo: ProjectHeader }>();

/**
 * Opens "share" dialog native to the user device.
 */
function shareURL() {
    const shareData: ShareData = {
        url: route.fullPath,
        title: props.projectHeaderInfo.title,
        text: props.projectHeaderInfo.title,
    };
    navigator.share(shareData);
}
</script>

<template>
    <div class="size-for-all-screens flex flex-col gap-3 p-6">
        <!-- Tags. -->
        <div class="flex gap-2 flex-wrap">
            <Badge
                v-for="tag in $props.projectHeaderInfo.tags"
                :key="tag"
                variant="secondary"
                class="bg-brand-yellow hover:bg-brand-yellow text-brand-yellow-foreground dark:bg-brand-yellow dark:hover:bg-brand-yellow dark:text-brand-yellow-foreground"
            >
                {{ tag }}
            </Badge>
        </div>

        <!-- Project title. -->
        <h1 class="text-4xl font-bold mt-6">
            Project Spotlight: {{ props.projectHeaderInfo.title }}
        </h1>

        <!-- Project subtitle. -->
        <p class="text-sm mb-6 text-muted-foreground">
            {{ props.projectHeaderInfo.description }}
        </p>

        <!-- Buttons. -->
        <div class="flex gap-3">
            <Button
                variant="outline"
                class="gap-3"
                @click="shareURL"
            >
                <Icon
                    name="gravity-ui:arrow-shape-turn-up-left"
                    class="h-[0.9rem] w-[0.9rem]"
                />
                Share
            </Button>

            <Button
                variant="outline"
                class="gap-3"
            >
                <Icon
                    name="gravity-ui:headphones"
                    class="h-[0.9rem] w-[0.9rem]"
                />
                Listen
            </Button>
        </div>

        <!-- Image. -->
        <nuxt-img
            :src="props.projectHeaderInfo.image"
            :alt="`${props.projectHeaderInfo.title} image`"
            :title="`${props.projectHeaderInfo.title} image`"
            class="w-full rounded-md border"
        />
    </div>
</template>
