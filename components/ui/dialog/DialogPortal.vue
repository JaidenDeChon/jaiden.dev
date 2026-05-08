<script setup lang="ts">
import { DialogPortal, type DialogPortalProps } from 'radix-vue';

defineProps<DialogPortalProps>();
</script>

<template>
    <DialogPortal v-bind="$props">
        <slot />
    </DialogPortal>
</template>
