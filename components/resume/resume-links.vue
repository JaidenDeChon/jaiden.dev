<script setup lang="ts">
import { RESUME_LINKS } from '~/lib/data/resume';
</script>

<template>
    <div class="resume-links">
        <p
            v-for="link in RESUME_LINKS"
            :key="link.label"
            class="resume-links__item"
        >
            <a
                class="resume-links__anchor"
                :href="link.href"
                rel="noreferrer"
            >
                <!-- The icon carries the label, so it needs the accessible name. -->
                <Icon
                    class="resume-links__icon"
                    :name="link.icon"
                    mode="svg"
                    role="img"
                    :aria-label="link.label"
                />

                <span>{{ link.url }}</span>
            </a>
        </p>
    </div>
</template>
