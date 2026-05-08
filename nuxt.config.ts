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
    turnstile: {
        siteKey: process.env.NUXT_PUBLIC_TURNSTILE_SITE_KEY || '1x00000000000000000000AA',
    },
    colorMode: {
        classSuffix: '',
        preference: 'system',
        fallback: 'light',
    },
});