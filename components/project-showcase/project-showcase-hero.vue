<script setup lang="ts">
import type { ProjectHeader } from '~/lib/models/project-header';

const props = defineProps<{ projectHeaderInfo: ProjectHeader }>();

const backgroundImageStyle = computed(() => `url(${props.projectHeaderInfo.image})`);
</script>

<template>
    <div class="project-hero size-for-all-screens h-96 my-3 bg-cover bg-center" />
</template>

<style>
.project-hero {
    background-image: v-bind('backgroundImageStyle');
}
</style>
