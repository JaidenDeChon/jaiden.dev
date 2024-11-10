<script setup lang="ts">
useAppConfig();

const colorMode = useColorMode();
colorMode.preference = 'system';
</script>

<template>
    <!-- <head> stuff for index.html. -->
    <Head>
        <!-- Preload fonts. -->
        <Link
            rel="preconnect"
            href="https://fonts.googleapis.com"
        />
        <Link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossorigin
        />
        <Link
            href="https://fonts.googleapis.com/css2?family=Afacad+Flux:wght@100..1000&display=swap"
            rel="stylesheet"
        />
        <Link
            rel="preload"
            href="img/earth/earth-dark.webp"
            as="image"
            type="image/webp"
        />
        <Link
            rel="preload"
            href="img/earth/earth-topology.webp"
            as="image"
            type="image/webp"
        />
    </Head>

    <div class="h-screen relative">
        <app-header />
        <nuxt-page
            class="absolute mt-16 top-0 left-0 w-screen"
            :transition="{ name: 'page', mode: 'out-in' }"
        />
    </div>
</template>

<style>
.page-enter-active,
.page-leave-active {
    transition: all 0.4s;
}

.page-enter-from,
.page-leave-to {
    opacity: 0;
    filter: blur(1rem);
}
</style>
