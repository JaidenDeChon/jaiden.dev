<script setup lang="ts">
import { COST_ROWS, BAR_SCALE_MAX, type CostRow } from '~/lib/data/marketComparison';

function leftPct(row: CostRow): string {
    if (row.type === 'mine') return '0%';
    return `${(row.low / BAR_SCALE_MAX) * 100}%`;
}

function widthPct(row: CostRow): string {
    const span = row.type === 'mine' ? row.low : row.high - row.low;
    return `${(span / BAR_SCALE_MAX) * 100}%`;
}

function valueLabel(row: CostRow): string {
    if (row.type === 'mine') return `$${row.low}/mo`;
    return `$${row.low}-$${row.high}/mo`;
}
</script>

<template>
    <div
        class="w-full"
        role="img"
        aria-label="Horizontal bar chart comparing monthly website costs. DIY builders cost $23-$39/mo (plus your own hours); jaiden.dev Starter $59/mo; subscription shops $99-$175/mo; jaiden.dev Business $149/mo; freelancers $92-$261/mo equivalent; jaiden.dev Commerce $299/mo; agencies $367-$833/mo equivalent."
    >
        <!-- Legend -->
        <div class="mb-5 flex flex-wrap gap-4 text-xs text-muted-foreground">
            <span class="flex items-center gap-1.5">
                <span class="inline-block h-2.5 w-4 rounded-full bg-brand-blue" />
                My plans (exact)
            </span>
            <span class="flex items-center gap-1.5">
                <span class="inline-block h-2.5 w-4 rounded-full bg-muted-foreground/40" />
                Market (range)
            </span>
        </div>

        <div class="flex flex-col gap-3">
            <div
                v-for="row in COST_ROWS"
                :key="row.label"
                class="group"
            >
                <!-- Label row -->
                <div class="mb-1 flex items-baseline justify-between gap-2">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger as-child>
                                <span class="cursor-help text-sm font-medium leading-tight underline decoration-dotted decoration-muted-foreground/40 underline-offset-2">
                                    {{ row.label }}
                                </span>
                            </TooltipTrigger>
                            <TooltipContent
                                class="max-w-[260px] text-xs leading-relaxed"
                                side="top"
                            >
                                {{ row.tooltip }}
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <span
                        class="shrink-0 text-xs tabular-nums"
                        :class="row.type === 'mine' ? 'font-semibold text-brand-blue' : 'text-muted-foreground'"
                    >
                        {{ valueLabel(row) }}
                        <span
                            v-if="row.diyTag"
                            class="ml-1 text-muted-foreground"
                        >+ your hours</span>
                    </span>
                </div>

                <!-- Bar track -->
                <div class="relative h-6 overflow-hidden rounded bg-muted/40">
                    <div
                        class="absolute inset-y-0 rounded transition-all"
                        :class="row.type === 'mine'
                            ? 'bg-brand-blue'
                            : 'bg-muted-foreground/35'"
                        :style="{ left: leftPct(row), width: widthPct(row) }"
                    />
                </div>
            </div>
        </div>

        <!-- Scale footnote -->
        <div class="mt-2 flex justify-between text-xs text-muted-foreground/60">
            <span>$0</span>
            <span>$833/mo (scale max)</span>
        </div>
    </div>
</template>
