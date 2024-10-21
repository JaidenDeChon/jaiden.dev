<script setup lang="ts">
import HeroPane from '~/components/homepage/hero-pane.vue';
import MyProjects from '~/components/homepage/my-projects.vue';
</script>

<template>
    <div>
        <app-header />

        <main class="pt-16">
            <hero-pane />
            <my-projects />
        </main>
    </div>
</template>
