<script setup lang="ts">
withDefaults(
    defineProps<{
        /** Omit for an untitled block (the summary) that still takes section spacing. */
        title?: string;
        /** Sidebar and main columns use different section-to-section spacing. */
        column?: 'sidebar' | 'main';
        /** Small italic note rendered directly beneath the heading. */
        caption?: string;
    }>(),
    { title: undefined, column: 'main', caption: undefined },
);
</script>

<template>
    <section
        class="resume-section"
        :class="`resume-section--${column}`"
    >
        <h2
            v-if="title"
            class="resume-section__heading"
        >
            {{ title }}
        </h2>

        <p
            v-if="caption"
            class="resume-section__caption"
        >
            {{ caption }}
        </p>

        <slot />
    </section>
</template>
