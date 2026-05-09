<script setup lang="ts">
import type { ProjectHeader } from '~/lib/models/project-header';

const props = defineProps<{
    articleHeaderData: ProjectHeader;
    to?: string;
}>();

const hasDestination = computed(() => Boolean(props.to));
const nuxtRouterDestination = computed(() =>
    props.to
        ? { path: props.to }
        : undefined,
);
</script>

<template>
    <div
        class="p-4 flex h-full flex-col gap-3 rounded-md bg-background transition-all border-2 hover:shadow-xl hover:border-background group"
    >
        <!-- Image. -->
        <nuxt-link
            v-if="hasDestination"
            :to="nuxtRouterDestination"
        >
            <div class="w-full bg-accent h-56 flex items-center justify-center rounded-md overflow-hidden">
                <nuxt-img
                    :src="$props.articleHeaderData.image"
                    :alt="`Image for ${$props.articleHeaderData.title}`"
                    class="w-full h-full max-w-full max-h-full object-cover transition-all group-hover:scale-105"
                />
            </div>
        </nuxt-link>
        <div
            v-else
            class="w-full bg-accent h-56 flex items-center justify-center rounded-md overflow-hidden"
        >
            <nuxt-img
                :src="$props.articleHeaderData.image"
                :alt="`Image for ${$props.articleHeaderData.title}`"
                class="w-full h-full max-w-full max-h-full object-cover"
            />
        </div>

        <!-- Title. -->
        <nuxt-link
            v-if="hasDestination"
            :to="nuxtRouterDestination"
            class="text-2xl fancy-text-decoration"
        >
            {{ $props.articleHeaderData.title }}
        </nuxt-link>
        <div
            v-else
            class="text-2xl"
        >
            {{ $props.articleHeaderData.title }}
        </div>

        <!-- Tags. -->
        <div class="flex gap-2 flex-wrap mb-3">
            <Badge
                v-for="tag in $props.articleHeaderData.tags"
                :key="tag"
                variant="secondary"
                class="bg-brand-yellow hover:bg-brand-yellow text-brand-yellow-foreground dark:bg-brand-yellow dark:hover:bg-brand-yellow dark:text-brand-yellow-foreground"
            >
                {{ tag }}
            </Badge>
        </div>

        <!-- Description. -->
        <div class="mt-auto flex items-end gap-3 justify-between">
            <router-link
                v-if="hasDestination"
                :to="nuxtRouterDestination"
                class="fancy-text-decoration text-muted-foreground"
            >
                {{ $props.articleHeaderData.description }}
            </router-link>
            <div
                v-else
                class="text-muted-foreground"
            >
                {{ $props.articleHeaderData.description }}
            </div>
            <div class="flex gap-3 items-end">
                <tooltip-provider
                    v-for="relatedLink in articleHeaderData.relatedLinks"
                    :key="relatedLink.url"
                    :delay-duration="432"
                >
                    <tooltip>
                        <tooltip-trigger as-child>
                            <Button
                                variant="outline"
                                size="icon"
                                as-child
                            >
                                <a
                                    :href="relatedLink.url"
                                    target="_blank"
                                >
                                    <Icon
                                        :name="relatedLink.icon"
                                        class="h-[1.2rem] w-[1.2rem]"
                                    />
                                </a>
                            </Button>
                        </tooltip-trigger>
                        <tooltip-content>
                            <span>{{ relatedLink.name }}</span>
                        </tooltip-content>
                    </tooltip>
                </tooltip-provider>
            </div>
        </div>
    </div>
</template>
