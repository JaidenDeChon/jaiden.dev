<script setup lang="ts">
import { ALACARTE_ITEMS, PLANS, BUYOUT_MULTIPLIER } from '~/lib/data/pricing'

const buyoutDisplayPrice = PLANS.map(p => `$${p.monthlyPrice * BUYOUT_MULTIPLIER}`).join(' / ')

function displayPrice(item: typeof ALACARTE_ITEMS[number]): string {
    if (item.buyoutDerived) {
        return buyoutDisplayPrice
    }
    return item.price
}
</script>

<template>
    <section class="px-6 py-12">
        <div class="size-for-all-screens">
            <h2 class="mb-1 text-2xl font-bold">
                À la carte
            </h2>
            <p class="mb-6 text-muted-foreground">
                Need something one-off? Everything below is available on its own.
            </p>

            <div class="overflow-hidden rounded-xl border border-border">
                <div class="divide-y divide-border">
                    <div
                        v-for="item in ALACARTE_ITEMS"
                        :key="item.item"
                        class="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-start sm:gap-6"
                    >
                        <div class="min-w-0 flex-1">
                            <span class="text-sm font-medium">{{ item.item }}</span>
                            <span
                                v-if="item.notes"
                                class="mt-0.5 block text-xs text-muted-foreground"
                            >
                                {{ item.notes }}
                            </span>
                        </div>
                        <span class="shrink-0 text-sm font-semibold tabular-nums sm:text-right">
                            {{ displayPrice(item) }}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
