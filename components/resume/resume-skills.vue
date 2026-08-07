<script setup lang="ts">
import { RESUME_SKILLS } from '~/lib/data/resume';
</script>

<template>
    <ul class="resume-skills">
        <li
            v-for="skill in RESUME_SKILLS"
            :key="skill"
            class="resume-skills__tag"
        >
            {{ skill }}
        </li>
    </ul>
</template>
