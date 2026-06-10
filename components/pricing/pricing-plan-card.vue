<script setup lang="ts">
import { cn } from '~/lib/utils';
import type { Plan } from '~/lib/data/pricing';
import { PHONE } from '~/lib/data/pricing';

defineProps<{ plan: Plan }>();
</script>

<template>
    <div
        :class="cn(
            'relative flex flex-col rounded-xl border border-border bg-card p-6 gap-5',
            plan.recommended && 'ring-2 ring-brand-blue shadow-lg',
        )"
    >
        <div
            v-if="plan.recommended"
            class="absolute -top-3.5 left-1/2 -translate-x-1/2"
        >
            <Badge class="bg-brand-yellow text-brand-yellow-foreground px-3 py-0.5 text-xs font-semibold">
                Most Popular
            </Badge>
        </div>

        <div>
            <h2 class="text-xl font-bold">
                {{ plan.name }}
            </h2>
            <div class="mt-2 flex items-baseline gap-1">
                <span
                    v-if="plan.fromPrice"
                    class="text-sm text-muted-foreground"
                >
                    from
                </span>
                <span class="text-4xl font-bold">${{ plan.monthlyPrice }}</span>
                <span class="text-muted-foreground">/mo</span>
            </div>
            <p class="mt-2 text-sm text-muted-foreground">
                {{ plan.tagline }}
            </p>
        </div>

        <ul class="flex flex-1 flex-col gap-2">
            <li
                v-for="feature in plan.features"
                :key="feature.text"
                class="flex items-start gap-2 text-sm"
            >
                <Icon
                    v-if="!feature.isHeader"
                    name="mdi:check"
                    class="mt-0.5 h-4 w-4 shrink-0 text-brand-blue"
                />
                <span :class="feature.isHeader ? 'font-semibold text-foreground' : 'text-muted-foreground'">
                    {{ feature.text }}
                </span>
            </li>
        </ul>

        <div class="flex">
            <Button
                as-child
                :class="cn(
                    'flex-1 rounded-l-md rounded-r-none transition-colors',
                    plan.recommended
                        ? 'bg-brand-blue text-brand-blue-foreground hover:bg-brand-blue-darker border-r border-brand-blue-darker/40'
                        : 'border-y border-l border-border bg-background text-foreground hover:bg-muted',
                )"
            >
                <a :href="`tel:${PHONE}`">Call me</a>
            </Button>
            <Button
                as-child
                :class="cn(
                    'flex-1 rounded-r-md rounded-l-none transition-colors',
                    plan.recommended
                        ? 'bg-brand-blue text-brand-blue-foreground hover:bg-brand-blue-darker'
                        : 'border border-border bg-background text-foreground hover:bg-muted',
                )"
            >
                <a :href="`sms:${PHONE}`">Text me</a>
            </Button>
        </div>
    </div>
</template>
