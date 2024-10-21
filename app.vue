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
    </Head>

    <div class="h-screen">
        <NuxtPage />
    </div>
</template>
