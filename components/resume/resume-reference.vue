<script setup lang="ts">
import type { ResumeReference } from '~/lib/data/resume';

defineProps<{ reference: ResumeReference }>();
</script>

<template>
    <div class="resume-reference">
        <p class="resume-reference__name">
            {{ reference.name }}
        </p>

        <p
            v-if="reference.role"
            class="resume-reference__role"
        >
            {{ reference.role }}
        </p>
    </div>
</template>
