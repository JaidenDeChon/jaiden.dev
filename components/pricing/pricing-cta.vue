<script setup lang="ts">
import { PHONE } from '~/lib/data/pricing';

defineProps<{ subtitle?: string }>();
</script>

<template>
    <div class="flex flex-col items-center gap-3 text-center">
        <a href="tel:+16028846936">602-884-6936</a>
        <Button
            as-child
            size="lg"
            class="w-full max-w-xs bg-brand-blue text-brand-blue-foreground hover:bg-brand-blue-darker h-14 px-8 text-base font-semibold transition-colors"
        >
            <a :href="`tel:${PHONE}`">Call or text me</a>
        </Button>
        <p
            v-if="subtitle"
            class="text-sm text-muted-foreground"
        >
            {{ subtitle }}
        </p>
    </div>
</template>
