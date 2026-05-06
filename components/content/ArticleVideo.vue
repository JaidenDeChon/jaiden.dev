<script setup lang="ts">
defineProps<{
    src: string;
}>();
</script>

<template>
    <video
        :src="src"
        class="my-4 mx-auto max-w-sm rounded-md shadow-md"
        controls
        muted
        loop
        playsinline
    />
</template>