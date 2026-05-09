const isDevelopment = process.env.NODE_ENV !== 'production';
const turnstileSiteKey = isDevelopment
    ? '1x00000000000000000000AA'
    : process.env.NUXT_PUBLIC_TURNSTILE_SITE_KEY;
const turnstileSecretKey = isDevelopment
    ? '1x0000000000000000000000000000000AA'
    : process.env.TURNSTILE_SECRET_KEY;
const contactFromEmail = process.env.CONTACT_FROM_EMAIL || 'onboarding@resend.dev';
const contactEmail = isDevelopment
    ? process.env.CONTACT_DEV_EMAIL || process.env.CONTACT_EMAIL
    : process.env.CONTACT_EMAIL;

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2024-04-03',
    devtools: { enabled: true },
    components: {
        dirs: [
            {
                path: '~/components',
                extensions: ['vue'],
                pathPrefix: false,
            },
        ],
    },
    modules: [
        '@pinia/nuxt',
        '@nuxtjs/tailwindcss',
        'pinia-plugin-persistedstate',
        '@nuxt/test-utils',
        '@nuxt/eslint',
        '@nuxtjs/color-mode',
        '@nuxt/icon',
        '@nuxt/image',
        '@nuxt/content',
        '@nuxtjs/turnstile',
    ],
    runtimeConfig: {
        resendApiKey: process.env.RESEND_API_KEY,
        contactEmail,
        contactFromEmail,
        public: {
            isTurnstileEnabled: !isDevelopment,
        },
        turnstile: {
            secretKey: turnstileSecretKey,
        },
    },
    turnstile: {
        siteKey: turnstileSiteKey,
    },
    colorMode: {
        classSuffix: '',
        preference: 'system',
        fallback: 'light',
    },
});
