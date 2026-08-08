<script setup lang="ts">
// Rendered above and below the document, so it stays reachable without
// scrolling back to the top. Suppressed in print alongside the rest of the
// page chrome.
const RESUME_PDF_PATH = '/jaiden_dechon_resume.pdf';
</script>

<template>
    <Button
        as-child
        class="bg-brand-blue transition-colors hover:bg-brand-blue-darker dark:bg-brand-blue dark:text-brand-blue-foreground dark:hover:bg-brand-blue-darker"
    >
        <a
            class="text-brand-blue-foreground hover:text-brand-blue-foreground"
            :href="RESUME_PDF_PATH"
            download="jaiden_dechon_resume.pdf"
            type="application/pdf"
        >
            Download PDF
        </a>
    </Button>
</template>
