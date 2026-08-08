<script setup lang="ts">
import type { ResumeJob } from '~/lib/data/resume';

defineProps<{ job: ResumeJob }>();
</script>

<template>
    <div class="resume-entry resume-job">
        <p class="resume-entry__date">
            {{ job.dateRange }}
        </p>

        <p class="resume-entry__title">
            {{ job.title }}
        </p>

        <p class="resume-entry__meta">
            {{ job.company }}
        </p>

        <p class="resume-entry__meta">
            {{ job.location }}
        </p>

        <resume-bullets :items="job.bullets" />
    </div>
</template>
