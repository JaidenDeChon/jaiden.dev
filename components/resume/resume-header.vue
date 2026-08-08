<script setup lang="ts">
import {
    RESUME_CONTACT_ROWS,
    RESUME_NAME_LINES,
    RESUME_TAGLINE,
} from '~/lib/data/resume';
</script>

<template>
    <header class="resume-header">
        <h1 class="resume-header__name">
            <span
                v-for="line in RESUME_NAME_LINES"
                :key="line"
                class="resume-header__name-line"
            >{{ line }}</span>
        </h1>

        <p class="resume-header__tagline">
            {{ RESUME_TAGLINE }}
        </p>

        <div class="resume-header__contact">
            <p
                v-for="row in RESUME_CONTACT_ROWS"
                :key="row.text"
                class="resume-header__contact-row"
                :class="{ 'resume-header__contact-row--bold': row.bold }"
            >
                <a
                    v-if="row.href"
                    :href="row.href"
                >{{ row.text }}</a>
                <template v-else>
                    {{ row.text }}
                </template>
            </p>
        </div>
    </header>
</template>
