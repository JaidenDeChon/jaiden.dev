<script setup lang="ts">
const currentYear = new Date().getFullYear();
</script>

<template>
    <footer class="border-t-2 border-border px-6 py-4">
        <div class="size-for-all-screens flex flex-col gap-1 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <p>&copy; Jaiden DeChon, 2024 - {{ currentYear }}</p>
            <nuxt-link
                to="/pricing"
                class="transition-colors hover:text-foreground"
            >
                Pricing
            </nuxt-link>
        </div>
    </footer>
</template>
