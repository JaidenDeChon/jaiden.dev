<script setup lang="ts">
import { BUYOUT_MULTIPLIER } from '~/lib/data/pricing';

interface MatrixRow {
    label: string;
    diy: string;
    jaidenDotDev: string;
    subscription: string;
    freelancer: string;
    agency: string;
}

const rows: MatrixRow[] = [
    {
        label: 'Upfront',
        diy: '$0',
        jaidenDotDev: '$0',
        subscription: '$0',
        freelancer: '$1,500-$4,000',
        agency: '$6,000-$12,000',
    },
    {
        label: 'Ongoing',
        diy: '$23-$39/mo',
        jaidenDotDev: '$59-$299/mo',
        subscription: '$99-$175/mo',
        freelancer: '~$50-$150/mo upkeep',
        agency: '$200-$500/mo retainer',
    },
    {
        label: 'Who builds it',
        diy: 'You',
        jaidenDotDev: 'Not you',
        subscription: 'Not you',
        freelancer: 'Not you',
        agency: 'Not you',
    },
    {
        label: 'Design',
        diy: 'Template',
        jaidenDotDev: 'Custom',
        subscription: 'Varies',
        freelancer: 'Custom',
        agency: 'Custom',
    },
    {
        label: 'Who updates & edits',
        diy: 'You',
        jaidenDotDev: '2-5/mo included',
        subscription: 'Often capped or extra',
        freelancer: 'Billed ~$50-$100/hr',
        agency: '$75-$150/hr or retainer',
    },
    {
        label: 'Domain in your name, day one',
        diy: 'Yes (you register it)',
        jaidenDotDev: 'Yes — always',
        subscription: 'Sometimes',
        freelancer: 'Usually',
        agency: 'Usually',
    },
    {
        label: 'If you leave',
        diy: 'Site stays on their platform',
        jaidenDotDev: `Buy it outright after day 30`,
        subscription: 'Often lose the site',
        freelancer: 'You own it',
        agency: 'You own it',
    },
    {
        label: 'Price over time',
        diy: 'Platform sets it (costs are usually hiked periodically to increase profits)',
        jaidenDotDev: 'Forever Rate — locked at signup',
        subscription: 'Varies',
        freelancer: 'New work at then-current rates',
        agency: 'Retainers typically rise',
    },
    {
        label: 'When something breaks',
        diy: 'You fix it',
        jaidenDotDev: 'Broken is always free',
        subscription: 'Varies',
        freelancer: 'Hourly',
        agency: 'Covered if on retainer',
    },
];

const columns = [
    { key: 'diy', label: 'DIY builder', mine: false },
    { key: 'jaidenDotDev', label: 'jaiden.dev', mine: true },
    { key: 'subscription', label: 'Subscription shops', mine: false },
    { key: 'freelancer', label: 'Freelancer', mine: false },
    { key: 'agency', label: 'Agency', mine: false },
] as const;
</script>

<template>
    <div class="relative">
        <!-- Scroll hint on small screens -->
        <p class="mb-2 text-xs text-muted-foreground sm:hidden">
            Scroll right to see all columns →
        </p>

        <div class="overflow-x-auto rounded-xl border border-border">
            <table
                class="w-full border-collapse text-sm"
                aria-label="Feature comparison: DIY builder, jaiden.dev, Subscription shops, Freelancer, Agency"
            >
                <thead>
                    <tr>
                        <!-- Sticky row-label header -->
                        <th
                            scope="col"
                            class="sticky left-0 z-10 min-w-[140px] border-b border-r border-border bg-background/80 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground backdrop-blur-sm"
                        />

                        <th
                            v-for="col in columns"
                            :key="col.key"
                            scope="col"
                            class="border-b border-border px-4 py-3 text-left text-sm font-semibold"
                            :class="col.mine
                                ? 'bg-brand-blue/8 text-brand-blue border-x border-brand-blue/20 min-w-[170px]'
                                : 'min-w-[150px] text-foreground'"
                        >
                            {{ col.label }}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="(row, i) in rows"
                        :key="row.label"
                        :class="i % 2 === 0 ? 'bg-background' : 'bg-muted/30'"
                    >
                        <!-- Sticky row label -->
                        <th
                            scope="row"
                            class="sticky left-0 z-10 border-r border-border bg-background/80 px-4 py-3 text-left text-xs font-semibold text-muted-foreground backdrop-blur-sm"
                        >
                            {{ row.label }}
                        </th>

                        <td
                            v-for="col in columns"
                            :key="col.key"
                            class="px-4 py-3 align-top leading-snug"
                            :class="col.mine
                                ? 'bg-brand-blue/5 border-x border-brand-blue/15 font-medium text-foreground'
                                : 'text-muted-foreground'"
                        >
                            {{ row[col.key] }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
