<script setup lang="ts">
const currentYear = new Date().getFullYear();
</script>

<template>
    <footer class="border-t-2 border-border px-6 py-4">
        <div class="size-for-all-screens text-sm text-muted-foreground">
            <p>&copy; Jaiden DeChon, 2024 - {{ currentYear }}</p>
        </div>
    </footer>
</template>
