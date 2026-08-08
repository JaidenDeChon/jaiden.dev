<script setup lang="ts">
import type { ResumeTextRun } from '~/lib/data/resume';

defineProps<{ runs: ResumeTextRun[] }>();
</script>

<template>
    <span>
        <template
            v-for="(run, index) in runs"
            :key="index"
        >
            <strong v-if="run.bold">{{ run.text }}</strong>
            <em v-else-if="run.italic">{{ run.text }}</em>
            <template v-else>{{ run.text }}</template>
        </template>
    </span>
</template>
