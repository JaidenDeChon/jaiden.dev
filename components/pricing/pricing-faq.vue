<script setup lang="ts">
import { FAQ_ITEMS } from '~/lib/data/pricing'
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
                    v-for="(item, index) in FAQ_ITEMS"
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
            </Accordion>
        </div>
    </section>
</template>
