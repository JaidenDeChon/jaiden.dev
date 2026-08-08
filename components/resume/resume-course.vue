<script setup lang="ts">
import type { ResumeCourse } from '~/lib/data/resume';

defineProps<{ course: ResumeCourse }>();
</script>

<template>
    <div class="resume-entry resume-course">
        <p class="resume-entry__date">
            {{ course.date }}
        </p>

        <p class="resume-entry__title">
            {{ course.title }}
        </p>

        <p class="resume-entry__meta">
            {{ course.provider }}
        </p>
    </div>
</template>
