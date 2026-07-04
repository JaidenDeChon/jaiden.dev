<script setup lang="ts">
defineProps<{
    src: string;
    alt: string;
    caption: string;
}>();
</script>

<template>
    <figure class="my-6">
        <img
            :src="src"
            :alt="alt"
            class="w-full rounded-md shadow-md"
        >
        <figcaption class="mt-2 text-center text-sm italic text-muted-foreground">
            {{ caption }}
        </figcaption>
    </figure>
</template>
