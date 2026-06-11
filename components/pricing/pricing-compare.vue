<script setup lang="ts">
import { SOURCES } from '~/lib/data/marketComparison';
</script>

<template>
    <section
        id="compare"
        class="border-t border-border px-6 py-14"
    >
        <div class="size-for-all-screens">
            <!-- Section header -->
            <div class="mb-10">
                <h2 class="mb-3 text-3xl font-bold">
                    How this compares
                </h2>
                <p class="text-muted-foreground">
                    If you have the time and enjoy tinkering, a $23 Squarespace plan is the cheapest way online — and I'll tell you that on the phone, too. My subscriptions are for owners who'd rather be more hands-off than a DIY service would allow for, or who want something more custom and personal than DIY services like Squarespace can offer. I definitely prefer to tell you that now and ensure you find the best case for you.
                </p>
            </div>

            <!-- Chart 1: What a website really costs -->
            <div class="mb-8 rounded-xl border border-border bg-muted/30 p-6 sm:p-8">
                <h3 class="mb-1 text-lg font-semibold">
                    What a website really costs per month
                </h3>
                <p class="mb-6 text-sm text-muted-foreground">
                    Monthly-equivalent cost over a 3-year horizon. Market rows show the honest range, not the best-case number.
                </p>
                <pricing-compare-bar />
            </div>

            <!-- Chart 2: Cumulative spend -->
            <div class="mb-8 rounded-xl border border-border bg-muted/30 p-6 sm:p-8">
                <h3 class="mb-1 text-lg font-semibold">
                    What you'll have spent by month X
                </h3>
                <p class="mb-6 text-sm text-muted-foreground">
                    Total money spent beginning from day one. Since my plans are $0 down, those lines (in blue) start at zero. Freelancers and agencies ask for money before the site exists; before you even know what you're getting.
                </p>
                <pricing-compare-line />
            </div>

            <!-- Feature matrix -->
            <div class="mb-8 rounded-xl border border-border bg-muted/30 p-6 sm:p-8">
                <h3 class="mb-1 text-lg font-semibold">
                    How jaiden.dev compares
                </h3>
                <p class="mb-6 text-sm text-muted-foreground">
                    Not every cell favors me. (That's the point.)
                </p>
                <pricing-compare-matrix />
            </div>

            <!-- Sources disclosure -->
            <details class="group rounded-lg border border-border bg-muted/30 px-5 py-4">
                <summary class="cursor-pointer select-none text-xs font-semibold text-muted-foreground group-open:mb-4">
                    Where these numbers come from
                </summary>
                <ul class="space-y-2">
                    <li
                        v-for="source in SOURCES"
                        :key="source.url"
                        class="text-xs text-muted-foreground"
                    >
                        <span class="font-medium text-foreground/80">{{ source.claim }}</span>
                        —
                        <a
                            :href="source.url"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="underline underline-offset-2 hover:text-brand-blue"
                        >source</a>
                        <span class="text-muted-foreground/60"> (retrieved {{ source.retrieved }})</span>
                    </li>
                </ul>
            </details>
        </div>
    </section>
</template>
