<script setup lang="ts">
import { SHARE_IMAGE_HEIGHT, SHARE_IMAGE_WIDTH } from '~/lib/constants/share-preview';

useAppConfig();

const colorMode = useColorMode();
colorMode.preference = 'system';

// Site-wide social share (Open Graph / Twitter) defaults. Individual pages
// set their own title via `useSharePreview`, and article pages additionally
// override the share image; anything a page doesn't set falls back to these
// defaults. Declaring the image dimensions is safe because every share image
// is exported at the same standard size — a page that overrides the image
// restates them through `useSharePreview` rather than inheriting a stale hint.
const requestUrl = useRequestURL();
const shareImage = `${requestUrl.origin}/img/share-preview.png`;
const shareDescription = 'I create beautiful web-apps with an intense focus on performance and accessibility.';

useSeoMeta({
    ogType: 'website',
    ogTitle: 'jaiden.dev',
    ogDescription: shareDescription,
    ogImage: shareImage,
    ogImageType: 'image/png',
    ogImageWidth: SHARE_IMAGE_WIDTH,
    ogImageHeight: SHARE_IMAGE_HEIGHT,
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
        <!-- Favicons. The .ico carries 16/32/48px raster fallbacks; the SVG
             is preferred by modern browsers (crisp at any size), and the
             apple-touch-icon covers iOS home-screen bookmarks. -->
        <Link
            rel="icon"
            href="/favicon.ico"
            sizes="32x32"
        />
        <Link
            rel="icon"
            href="/favicon.svg"
            type="image/svg+xml"
        />
        <Link
            rel="apple-touch-icon"
            href="/apple-touch-icon.png"
        />

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

    <div class="relative flex min-h-dvh flex-col">
        <app-header />
        <div class="flex-1">
            <nuxt-page />
        </div>
        <app-footer />
        <contact-dialog />
    </div>
</template>
