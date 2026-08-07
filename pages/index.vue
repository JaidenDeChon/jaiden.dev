<script setup lang="ts">
import HeroPane from '~/components/homepage/hero-pane.vue';
import TechnologiesList from '~/components/homepage/technologies-list.vue';
import MyProjects from '~/components/homepage/my-projects.vue';
import MyBlogPosts from '~/components/homepage/my-blog-posts.vue';

// The homepage keeps the default share image; its title is the site name.
useSharePreview({
    title: 'jaiden.dev',
});
</script>

<template>
    <div>
        <main>
            <div class="h-dvh">
                <client-only>
                    <hero-pane class="-mt-16" />
                </client-only>
            </div>

            <technologies-list />

            <my-projects />

            <my-blog-posts />
        </main>
    </div>
</template>
