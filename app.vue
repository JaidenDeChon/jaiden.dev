<script setup lang="ts">
useAppConfig();

const colorMode = useColorMode();
colorMode.preference = 'system';

// Site-wide social share (Open Graph / Twitter) defaults. Individual pages
// can override the title/description; the share image applies everywhere.
// Build an absolute image URL from the serving host so it resolves on
// production and on Netlify deploy previews alike (crawlers require an
// absolute URL and do not run client-side JS).
const requestUrl = useRequestURL();
const shareImage = `${requestUrl.origin}/img/share-preview.png`;
const shareDescription = 'I create beautiful web-apps with an intense focus on performance and accessibility.';

useSeoMeta({
    ogType: 'website',
    ogTitle: 'jaiden.dev',
    ogDescription: shareDescription,
    ogImage: shareImage,
    ogImageWidth: 2400,
    ogImageHeight: 1260,
    ogImageType: 'image/png',
    ogImageAlt: 'jaiden.dev',
    twitterCard: 'summary_large_image',
    twitterTitle: 'jaiden.dev',
    twitterDescription: shareDescription,
    twitterImage: shareImage,
});
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
