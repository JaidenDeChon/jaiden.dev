<script setup lang="ts">
import type { ResumeBullet } from '~/lib/data/resume';

const props = defineProps<{ items: (string | ResumeBullet)[] }>();

const bullets = computed<ResumeBullet[]>(() =>
    props.items.map(item => (typeof item === 'string' ? { text: item } : item)),
);
</script>

<template>
    <ul class="resume-bullets">
        <li
            v-for="(bullet, index) in bullets"
            :key="index"
            class="resume-bullets__item"
        >
            <strong
                v-if="bullet.label"
                class="resume-bullets__label"
            >{{ bullet.label }}</strong>
            {{ bullet.text }}
        </li>
    </ul>
</template>
