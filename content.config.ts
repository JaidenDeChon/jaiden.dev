import { defineCollection, defineContentConfig } from '@nuxt/content';

export default defineContentConfig({
    collections: {
        projectSpotlights: defineCollection({
            type: 'page',
            source: 'project-spotlights/**/*.md',
        }),
    },
});