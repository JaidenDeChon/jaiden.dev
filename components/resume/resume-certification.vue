<script setup lang="ts">
import type { ResumeCertification } from '~/lib/data/resume';

defineProps<{ certification: ResumeCertification }>();
</script>

<template>
    <div class="resume-entry resume-certification">
        <p class="resume-entry__title">
            {{ certification.title }}
        </p>

        <p class="resume-entry__meta">
            <a
                :href="certification.href"
                rel="noreferrer"
            >{{ certification.provider }}</a>
        </p>

        <p class="resume-entry__body">
            {{ certification.description }}
        </p>

        <p class="resume-entry__body">
            Official certificate number: <strong>{{ certification.certificateNumber }}</strong>
        </p>

        <p class="resume-entry__body">
            Completion date: <strong>{{ certification.completionDate }}</strong>
        </p>
    </div>
</template>
