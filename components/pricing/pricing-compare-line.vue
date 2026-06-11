<script setup lang="ts">
import { VisXYContainer, VisLine, VisAxis } from '@unovis/vue';
import {
    CUMULATIVE_SERIES,
    HORIZON_MONTHS,
    generateCumulativeData,
    type CumulativePoint,
} from '~/lib/data/marketComparison';

const chartData = generateCumulativeData(HORIZON_MONTHS);

const SERIES_COLORS: Record<string, string> = {
    diy: 'var(--chart-3)',
    starter: 'var(--chart-1)',
    business: 'var(--chart-2)',
    freelancer: 'var(--chart-4)',
    agency: 'var(--chart-5)',
};

const xAccessor = (d: CumulativePoint) => d.month;
const yAccessors: Record<string, (d: CumulativePoint) => number> = {};
for (const s of CUMULATIVE_SERIES) {
    yAccessors[s.key] = (d: CumulativePoint) => d[s.key as keyof CumulativePoint] as number;
}

function xFormat(m: number): string {
    return m === 0 ? 'Day 1' : `Mo. ${m}`;
}

function yFormat(v: number): string {
    if (v === 0) return '$0';
    if (v >= 1000) return `$${(v / 1000).toFixed(0)}k`;
    return `$${v}`;
}

const xTickValues = [0, 6, 12, 18, 24, 30, 36];
</script>

<template>
    <div>
        <!-- Legend -->
        <div
            class="mb-4 flex flex-wrap gap-x-5 gap-y-2"
            aria-label="Chart legend"
        >
            <div
                v-for="s in CUMULATIVE_SERIES"
                :key="s.key"
                class="flex items-center gap-1.5 text-xs"
            >
                <span
                    class="inline-block h-2 w-5 rounded-full"
                    :style="`background: ${SERIES_COLORS[s.key]}`"
                />
                <span class="font-medium">{{ s.label }}</span>
                <span
                    v-if="s.labelSuffix"
                    class="text-muted-foreground"
                >{{ s.labelSuffix }}</span>
            </div>
        </div>

        <ClientOnly>
            <VisXYContainer
                :data="chartData"
                class="h-[320px] w-full sm:h-[380px]"
                aria-label="Cumulative cost chart over 36 months. Freelancer starts at $2,750 on day one; agency starts at $9,000. All jaiden.dev plans start at $0."
            >
                <VisLine
                    v-for="s in CUMULATIVE_SERIES"
                    :key="s.key"
                    :x="xAccessor"
                    :y="yAccessors[s.key]"
                    :color="SERIES_COLORS[s.key]"
                    :line-width="s.type === 'mine' ? 2.5 : 1.75"
                />
                <VisAxis
                    type="x"
                    :tick-format="xFormat"
                    :tick-values="xTickValues"
                />
                <VisAxis
                    type="y"
                    :tick-format="yFormat"
                />
            </VisXYContainer>

            <template #fallback>
                <div class="h-[320px] w-full animate-pulse rounded-lg bg-muted/30 sm:h-[380px]" />
            </template>
        </ClientOnly>

        <!-- Fine print -->
        <div class="mt-4 space-y-2">
            <details class="group rounded-lg border border-border bg-muted/30 px-5 py-4">
                <summary class="cursor-pointer select-none text-xs font-semibold text-muted-foreground group-open:mb-4">
                    What this means for you
                </summary>
                <div class="space-y-2 text-xs text-muted-foreground">
                    <p>
                        As you may have noticed, the average freelancer price will eventually dip below the price of my
                        plans. Once you pass roughly month 56 (about 4½ years), it is possible to have spent less with
                        the more typical "up front" freelancer costs than with my plans offered here.
                    </p>
                    <p>
                        However, that figure is for <strong>upkeep only</strong> -- content changes still bill by the
                        hour, while my plan keeps including 3 edits every month, and anything broken is fixed for free.
                        Still, if the numbers ever stop working for you, you don't have to leave to fix it. Buy your
                        site outright, switch to the $25/month hosting-only plan, and from that point forward, you're
                        far below the average freelancer price point.
                    </p>
                    <p>
                        This is part of the reason I offer the hosting-only plan. By 4.5 years in, most websites have
                        stabilized and don't require the higher costs of updating it often. Ad-hoc content updates still
                        apply at the going rate of $35 per update (assuming the update takes about 30-60 minutes to
                        implement) as shown on the à la carte table.
                    </p>
                </div>
            </details>

            <details class="group rounded-lg border border-border bg-muted/30 px-5 py-4">
                <summary class="cursor-pointer select-none text-xs font-semibold text-muted-foreground group-open:mb-4">
                    How this was calculated
                </summary>
                <p class="text-xs text-muted-foreground">
                    The "freelancer" and "agency" lines use midpoints based on ranges found in market research: $2,750
                    upfront + $100/mo and $9,000 upfront + $350/mo. Actual ranges are $1,500-$4,000 build with
                    $50-$150/mo upkeep for freelancers; and $6,000-$12,000 build with $200-$500/mo retainer for agencies.
                </p>
            </details>
        </div>
    </div>
</template>
