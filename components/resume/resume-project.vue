<script setup lang="ts">
import type { ResumeProject } from '~/lib/data/resume';

defineProps<{ project: ResumeProject }>();
</script>

<template>
    <div class="resume-entry resume-project">
        <p class="resume-entry__title">
            {{ project.name }}
        </p>

        <p class="resume-entry__meta">
            <a
                :href="project.href"
                rel="noreferrer"
            >{{ project.url }}</a>
        </p>

        <div class="resume-project__body">
            <!-- Floated rather than a flex column so the copy wraps beside the
                 thumbnail and then reclaims the full measure underneath it. -->
            <img
                class="resume-project__image"
                :src="project.image"
                :alt="`Screenshot of ${project.name}`"
            >

            <p class="resume-entry__body">
                <resume-rich-text :runs="project.description" />
            </p>
        </div>
    </div>
</template>
