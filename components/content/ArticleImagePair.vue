<script setup lang="ts">
defineProps<{
    leftSrc: string;
    rightSrc: string;
    leftAlt: string;
    rightAlt: string;
}>();
</script>

<template>
    <div class="my-6 grid gap-4 md:grid-cols-2">
        <div class="aspect-[4/3] overflow-hidden rounded-md shadow-md">
            <img
                :src="leftSrc"
                :alt="leftAlt"
                class="h-full w-full object-cover"
            >
        </div>

        <div class="aspect-[4/3] overflow-hidden rounded-md shadow-md">
            <img
                :src="rightSrc"
                :alt="rightAlt"
                class="h-full w-full object-cover"
            >
        </div>
    </div>
</template>
