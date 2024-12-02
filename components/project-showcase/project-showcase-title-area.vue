<script setup lang="ts">
import type { ProjectHeader } from '~/lib/models/project-header';

const route = useRoute();
const props = defineProps<{ projectHeaderInfo: ProjectHeader }>();

const utterance = ref<null | SpeechSynthesisUtterance>(null);

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

function buildSpeechContents() {
    const utteranceContents: { title?: string; tags?: string } = {};
    utteranceContents.title = `Project Spotlight: ${props.projectHeaderInfo.title}. ${props.projectHeaderInfo.description}`;
    utteranceContents.tags = `Related tags: ${props.projectHeaderInfo.tags?.join(', ')}`;

    return `${utteranceContents.title} ${utteranceContents.tags}`;
}

function toggleSpeech() {
    if (!('speechSynthesis' in window)) {
        alert('Sorry, your browser does not support text-to-speech.');
        return;
    }

    const speechSynthesis = window.speechSynthesis;
    const text = buildSpeechContents();

    if (utterance.value === null) {
        // If the speech is not ongoing, start it and ensure it resets the utterance when finished.
        utterance.value = new SpeechSynthesisUtterance(text);
        utterance.value.lang = 'en-US';
        utterance.value.onend = () => utterance.value = null;
        speechSynthesis.speak(utterance.value);
    }

    else {
        // If the speech is ongoing, cancel it.
        speechSynthesis.cancel();
        utterance.value = null;
    }
}
</script>

<template>
    <div class="size-for-all-screens flex flex-col gap-3 p-6 lg:px-0">
        <!-- Related links. -->
        <div class="flex gap-2 justify-end">
            <a
                v-for="relatedLink in props.projectHeaderInfo.relatedLinks"
                :key="relatedLink.url"
                :href="relatedLink.url"
                target="_blank"
                rel="noreferrer"
            >
                <Button
                    variant="outline"
                    class="gap-3"
                >
                    <Icon
                        :name="relatedLink.icon"
                        class="h-[0.9rem] w-[0.9rem]"
                    />
                    {{ relatedLink.name }}
                </Button>
            </a>
        </div>

        <header class="mb-4">
            <!-- Project title. -->
            <h1 class="text-4xl font-bold mt-6 mb-3">
                Project Spotlight: {{ props.projectHeaderInfo.title }}
            </h1>

            <!-- Project subtitle. -->
            <p class="text-sm text-muted-foreground">
                {{ props.projectHeaderInfo.description }}
            </p>
        </header>

        <!-- Tags. -->
        <div class="flex gap-2 flex-wrap mb-6">
            <Badge
                v-for="tag in $props.projectHeaderInfo.tags"
                :key="tag"
                variant="secondary"
                class="bg-brand-yellow hover:bg-brand-yellow text-brand-yellow-foreground dark:bg-brand-yellow dark:hover:bg-brand-yellow dark:text-brand-yellow-foreground"
            >
                {{ tag }}
            </Badge>
        </div>

        <!-- Buttons. -->
        <div class="flex gap-3">
            <Button
                class="gap-3"
                variant="secondary"
                @click="shareURL"
            >
                <Icon
                    name="gravity-ui:arrow-shape-turn-up-left"
                    class="h-[0.9rem] w-[0.9rem]"
                />
                Share
            </Button>

            <Button
                class="gap-3"
                :variant="utterance ? 'destructive' : 'secondary'"
                @click="toggleSpeech"
            >
                <Icon
                    name="gravity-ui:headphones"
                    class="h-[0.9rem] w-[0.9rem]"
                />
                {{ utterance ? 'Stop reading' : 'Listen' }}
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
