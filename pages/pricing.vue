<script setup lang="ts">
import { PLANS, UNIVERSAL_TERMS } from '~/lib/data/pricing';

useSeoMeta({
    title: 'Website Plans & Pricing — jaiden.dev',
    description: `$0 down, forever rate, no markups. Done-for-you websites for local businesses. Three simple plans starting at $${PLANS[0].monthlyPrice}/mo.`,
});
</script>

<template>
    <main class="min-h-[calc(100vh-4rem)] pb-16">
        <!-- Hero: tagline + trust pillars -->
        <pricing-hero />

        <!-- Universal terms strip -->
        <div class="border-y border-border bg-muted/50 px-6 py-3">
            <div class="size-for-all-screens flex flex-wrap items-center justify-center gap-y-1 text-center">
                <template
                    v-for="(term, i) in UNIVERSAL_TERMS"
                    :key="term"
                >
                    <span
                        v-if="i > 0"
                        class="mx-2.5 text-base font-bold text-muted-foreground/60"
                    >·</span>
                    <span class="text-sm text-muted-foreground">{{ term }}</span>
                </template>
            </div>
        </div>

        <!-- CTA #1 -->
        <section class="px-6 py-10">
            <div class="size-for-all-screens">
                <pricing-cta subtitle="No forms or waiting. Just call or text and I'll answer your questions myself." />
            </div>
        </section>

        <!-- Pricing cards -->
        <section class="px-6 pb-10">
            <div class="size-for-all-screens">
                <div class="grid gap-8 lg:grid-cols-3 lg:items-start">
                    <pricing-plan-card
                        v-for="plan in PLANS"
                        :key="plan.id"
                        :plan="plan"
                        :class="plan.recommended ? 'lg:scale-[1.03] lg:z-10' : ''"
                    />
                </div>
            </div>
        </section>

        <!-- Annual prepay -->
        <section class="px-6 pb-10">
            <div class="size-for-all-screens">
                <div class="rounded-xl border border-border bg-muted/50 p-6">
                    <h2 class="mb-1 text-lg font-bold">
                        Pay annually — receive 2 months free
                    </h2>
                    <p class="mb-5 text-sm text-muted-foreground">
                        Pay for 10 months, get 12.
                    </p>
                    <div class="flex flex-wrap gap-x-8 gap-y-3">
                        <div
                            v-for="plan in PLANS"
                            :key="plan.id"
                            class="flex items-baseline gap-1.5"
                        >
                            <span class="font-semibold">{{ plan.name }}</span>
                            <span class="text-muted-foreground">
                                <span v-if="plan.fromPrice">from </span>${{ plan.annualPrice }}/yr
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- À la carte -->
        <div class="border-t border-border">
            <pricing-alacarte />
        </div>

        <!-- CTA #2 (after cards + alacarte) -->
        <section class="border-t border-border px-6 py-12">
            <div class="size-for-all-screens mx-auto max-w-xl text-center">
                <h2 class="mb-2 text-2xl font-bold">
                    Ready to get started?
                </h2>
                <p class="mb-6 text-muted-foreground">
                    I'm a solo developer, so you're calling me, not a call center. There's no script and no pressure. If I can't help you, I'll say so.
                </p>
                <pricing-cta subtitle="Usually available same-day." />
            </div>
        </section>

        <!-- FAQ -->
        <div class="border-t border-border">
            <pricing-faq />
        </div>

        <!-- CTA #3 (page bottom) -->
        <section class="border-t border-border px-6 py-12">
            <div class="size-for-all-screens mx-auto max-w-xl text-center">
                <h2 class="mb-2 text-2xl font-bold">
                    Questions? Just ask.
                </h2>
                <p class="mb-6 text-muted-foreground">
                    No commitments. I'll give you a straight answer and let you decide.
                </p>
                <pricing-cta />
            </div>
        </section>
    </main>
</template>
