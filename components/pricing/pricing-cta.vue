<script setup lang="ts">
import { PHONE } from '~/lib/data/pricing';

defineProps<{ subtitle?: string }>();
</script>

<template>
    <div class="flex flex-col items-center gap-3 text-center">
        <a href="tel:+16028846936">602-884-6936</a>
        <div class="flex">
            <Button
                as-child
                size="lg"
                class="rounded-l-md rounded-r-none bg-brand-blue text-brand-blue-foreground hover:bg-brand-blue-darker h-14 px-8 text-base font-semibold transition-colors border-r border-brand-blue-darker/40"
            >
                <a :href="`tel:${PHONE}`">Call me</a>
            </Button>
            <Button
                as-child
                size="lg"
                class="rounded-r-md rounded-l-none bg-brand-blue text-brand-blue-foreground hover:bg-brand-blue-darker h-14 px-8 text-base font-semibold transition-colors"
            >
                <a :href="`sms:${PHONE}`">Text me</a>
            </Button>
        </div>
        <p
            v-if="subtitle"
            class="text-sm text-muted-foreground"
        >
            {{ subtitle }}
        </p>
    </div>
</template>
