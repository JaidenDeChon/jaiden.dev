<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue';
import {
    DialogContent as DialogContentPrimitive,
    type DialogContentEmits,
    type DialogContentProps,
    useForwardPropsEmits,
} from 'radix-vue';
import DialogOverlay from './DialogOverlay.vue';
import DialogPortal from './DialogPortal.vue';
import { cn } from '@/lib/utils';

const props = withDefaults(
    defineProps<DialogContentProps & { class?: HTMLAttributes['class'] }>(),
    {
        sideOffset: 0,
    },
);
const emits = defineEmits<DialogContentEmits>();

const delegatedProps = computed(() => {
    const { class: _, ...delegated } = props;

    return delegated;
});

const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
    <DialogPortal>
        <DialogOverlay />
        <DialogContentPrimitive
            v-bind="forwarded"
            :class="cn('fixed left-[50%] top-[50%] z-50 grid w-[calc(100%-2rem)] max-w-2xl translate-x-[-50%] translate-y-[-50%] gap-6 border border-border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg', props.class)"
        >
            <slot />
        </DialogContentPrimitive>
    </DialogPortal>
</template>
