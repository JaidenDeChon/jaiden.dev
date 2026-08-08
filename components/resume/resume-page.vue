<script setup lang="ts">
// One physical sheet: a fixed 595pt x 841pt box with the full-bleed accent
// band on the left. Pages are assigned content explicitly by pages/resume.vue
// rather than flowed automatically, mirroring how the original was laid out.
const slots = useSlots();

const hasSidebarContent = computed(() => Boolean(slots.sidebar));
</script>

<template>
    <article class="resume-page">
        <div
            class="resume-page__sidebar"
            :class="{ 'resume-page__sidebar--empty': !hasSidebarContent }"
        >
            <slot name="sidebar" />
        </div>

        <div class="resume-page__main">
            <slot />
        </div>
    </article>
</template>
