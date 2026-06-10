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
        <div class="mt-4 space-y-1.5 text-xs text-muted-foreground">
            <p>
                Freelancer and Agency use typical midpoints: $2,750 upfront + $100/mo and $9,000 upfront + $350/mo.
                Actual ranges are $1,500–$4,000 build and $50–$150/mo upkeep for freelancers;
                $6,000–$12,000 build and $200–$500/mo retainer for agencies.
            </p>
            <p class="text-foreground/70">
                <strong>What this means for you:</strong> Once you pass roughly month 56 (about 4½ years), a typical freelance build's total cash cost can dip below my Business plan — I'd rather tell you that than have you find it out later.
            </p>
            <p class="text-muted-foreground">
                Two things sit on the other side of that math, however: their figure is <strong>upkeep only</strong> (content changes still bill by the hour, while my plan keeps including 3 edits every month, and anything broken is fixed free) — and if the numbers ever stop working for you, you don't have to leave to fix it. Buy your site outright, drop to $25/month hosting, and from that day you're paying less than the freelance path.
            </p>
            <p class="text-muted-foreground">
                You control which side of this chart you're on.
            </p>
        </div>
    </div>
</template>
