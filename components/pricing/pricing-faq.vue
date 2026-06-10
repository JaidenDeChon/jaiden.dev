<script setup lang="ts">
import { FAQ_ITEMS, BUYOUT_MULTIPLIER, PLANS, HOSTING_ONLY_PRICE, HOURLY_RATE } from '~/lib/data/pricing';

const fmt = (n: number) => `$${n.toLocaleString('en-US')}`;
const starterBuyout = fmt(PLANS.find(p => p.id === 'starter')!.buyoutPrice);
const businessBuyout = fmt(PLANS.find(p => p.id === 'business')!.buyoutPrice);
const commerceBuyout = fmt(PLANS.find(p => p.id === 'commerce')!.buyoutPrice);
</script>

<template>
    <section class="px-6 py-12">
        <div class="size-for-all-screens max-w-3xl">
            <h2 class="mb-1 text-2xl font-bold">
                Good questions
            </h2>
            <p class="mb-8 text-muted-foreground">
                The stuff worth knowing before you call.
            </p>

            <Accordion
                type="single"
                collapsible
                class="w-full"
            >
                <AccordionItem
                    v-for="(item, index) in FAQ_ITEMS.slice(0, -1)"
                    :key="item.question"
                    :value="`faq-${index}`"
                >
                    <AccordionTrigger class="text-left font-medium hover:no-underline">
                        {{ item.question }}
                    </AccordionTrigger>
                    <AccordionContent class="text-muted-foreground">
                        {{ item.answer }}
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem :value="`faq-${FAQ_ITEMS.length - 1}`">
                    <AccordionTrigger class="text-left font-medium hover:no-underline">
                        {{ FAQ_ITEMS[FAQ_ITEMS.length - 1].question }}
                    </AccordionTrigger>
                    <AccordionContent class="space-y-3 text-muted-foreground">
                        <p>
                            You can buy your site outright any time after your first 30 days. The price is flat: {{ BUYOUT_MULTIPLIER }} times your current monthly rate — {{ starterBuyout }} on Starter, {{ businessBuyout }} on Business, {{ commerceBuyout }} on Commerce. If you're on a custom Commerce rate, it's the same multiplier applied to your actual rate. Months remaining don't factor in, and buying out replaces paying out the rest of your term entirely. The moment you pay it, the agreement ends and nothing else is ever owed.
                        </p>
                        <p>
                            <strong>What you get:</strong> the complete site — files, design, code, content, all of it. Your domain, your photos and text, and your third-party accounts (ordering, booking, email) were registered in your name from day one, so those were never mine to give back. The buyout transfers the one thing that was: the build itself.
                        </p>
                        <p>
                            If you prepaid for a year, unused time converts to credit at your effective daily rate, calculated to the day. That credit applies to the buyout first, and anything left over comes back to you as a refund — or stays banked toward hosting if you'd rather. You keep the annual discount on the months you used. A regular monthly cycle already in progress simply counts as used, so there are no micro-refunds in either direction.
                        </p>
                        <p>
                            <strong>What ends with the buyout:</strong> included edits, support response times, monitoring, and the Forever Rate — if you come back later, you'd rejoin at then-current prices. From there you have two options: take your files to any host you like, or stay with me on the ${{ HOSTING_ONLY_PRICE }}/mo hosting-only plan, which keeps your site live, secure, backed up, and patched exactly as it was delivered. Hosting-only doesn't include edits, and if someone else modifies the code, fixes bill at the normal rate of ${{ HOURLY_RATE }}/hr — I can't promise free fixes on work that isn't mine.
                        </p>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    </section>
</template>
