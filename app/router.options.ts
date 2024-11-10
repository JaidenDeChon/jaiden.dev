import type { RouterConfig } from 'nuxt/schema';

export default {
    scrollBehavior(to, from, savedPostion) {
        if (savedPostion) return savedPostion;
        return { top: 0, behavior: 'smooth' };
    },
} satisfies RouterConfig;
