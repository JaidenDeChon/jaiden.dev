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

    <div class="relative flex min-h-screen flex-col">
        <app-header />
        <div class="flex-1 pt-16">
            <nuxt-page />
        </div>
        <app-footer />
        <contact-dialog />
    </div>
</template>
