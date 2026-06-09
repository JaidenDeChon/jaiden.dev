<script setup lang="ts">
import { TRUST_PILLARS } from '~/lib/data/pricing';
</script>

<template>
    <section class="relative overflow-hidden px-6 pt-12 pb-8">
        <!-- Hero background image: right side, fades at all edges (light) -->
        <div
            class="pointer-events-none absolute inset-y-0 right-0 w-2/3 opacity-35 dark:hidden"
            style="
                background-image: url('/img/pricing-hero-image-light.png');
                background-size: cover;
                background-position: center center;
                -webkit-mask-image: linear-gradient(to right, transparent 0%, black 30%, black 70%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%);
                -webkit-mask-composite: source-in;
                mask-image: linear-gradient(to right, transparent 0%, black 30%, black 70%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%);
                mask-composite: intersect;
            "
        />
        <!-- Hero background image: right side, fades at all edges (dark) -->
        <div
            class="pointer-events-none absolute inset-y-0 right-0 w-2/3 opacity-25 hidden dark:block"
            style="
                background-image: url('/img/pricing-hero-image-dark.png');
                background-size: cover;
                background-position: center center;
                -webkit-mask-image: linear-gradient(to right, transparent 0%, black 30%, black 70%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%);
                -webkit-mask-composite: source-in;
                mask-image: linear-gradient(to right, transparent 0%, black 30%, black 70%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%);
                mask-composite: intersect;
            "
        />
        <div class="size-for-all-screens">
            <p class="afacad mb-4 text-sm font-medium uppercase tracking-[0.3em] text-muted-foreground">
                Website plans
            </p>
            <h1 class="mb-4 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
                $0 down. Your rate is locked in for life. Transparent practices. It's a <i class="underline">much</i> better experience.
            </h1>
            <p class="mb-4 max-w-2xl text-lg text-muted-foreground">
                Fair prices for honest work. Plans that work for every size and type of businesss. If your website breaks and it's not your fault, the fix is free, always. If a cheaper plan fits your business, I'll tell you so.
            </p>
            <p class="mb-8 max-w-2xl text-lg text-muted-foreground">
                And you own your domain, so if you ever want to fire me, you can take it with you -- but I promise you'll like it here 😉
            </p>
            <div class="flex flex-wrap gap-2">
                <span
                    v-for="pillar in TRUST_PILLARS"
                    :key="pillar"
                    class="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-3 py-1.5 text-sm font-medium"
                >
                    <Icon
                        name="mdi:check-circle"
                        class="h-4 w-4 shrink-0 text-brand-blue"
                    />
                    {{ pillar }}
                </span>
            </div>
        </div>
    </section>
</template>
