<script setup lang="ts">
interface Technology {
    name: string;
    icon: string;
    startYear: number;
    highlighted: boolean;
    iconColor: string;
}

const currentYear = new Date().getFullYear();
const yearsSince = (startYear: number) => {
    const years = currentYear - startYear;
    return years === 1 ? '1 year' : `${years} years`;
};

const technologies: Technology[] = [
    {
        name: 'HTML',
        icon: 'devicon-plain:html5',
        startYear: 2015,
        highlighted: true,
        iconColor: '#E34F26',
    },
    {
        name: 'CSS',
        icon: 'devicon-plain:css3',
        startYear: 2015,
        highlighted: true,
        iconColor: '#663399', // rebeccapurple 💜 still waiting for an icon of the new logo @ icones.js.org
    },
    {
        name: 'JS, TS',
        icon: 'devicon-plain:typescript',
        startYear: 2016,
        highlighted: true,
        iconColor: '#F0DB4F',
    },
    {
        name: 'VueJS',
        icon: 'devicon-plain:vuejs',
        startYear: 2018,
        highlighted: true,
        iconColor: '#42B883',
    },
    {
        name: '.NET',
        icon: 'devicon-plain:dot-net',
        startYear: 2019,
        highlighted: false,
        iconColor: '#512BD4',
    },
    {
        name: 'SQL',
        icon: 'devicon-plain:azuresqldatabase',
        startYear: 2019,
        highlighted: true,
        iconColor: '#0078D4',
    },
    {
        name: 'Pinia',
        icon: 'simple-icons:pinia',
        startYear: 2020, // Vue 3 release year
        highlighted: false,
        iconColor: '#FFD859', // pineapple yellow from the Pinia logo
    },
    {
        name: 'React',
        icon: 'akar-icons:react-fill',
        startYear: 2021,
        highlighted: false,
        iconColor: '#61DAFB',
    },
    {
        name: 'Angular',
        icon: 'devicon-plain:angular',
        startYear: 2021,
        highlighted: false,
        iconColor: '#DD0031',
    },
    {
        name: 'Nuxt',
        icon: 'devicon-plain:nuxtjs',
        startYear: 2021,
        highlighted: false,
        iconColor: '#00C58E',
    },
    {
        name: 'Svelte, SvelteKit',
        icon: 'devicon-plain:svelte',
        startYear: 2021,
        highlighted: false,
        iconColor: '#FF3E00',
    },
    {
        name: 'NestJS',
        icon: 'devicon-plain:nestjs',
        startYear: 2021,
        highlighted: false,
        iconColor: '#E0234E',
    },
    {
        name: 'MongoDB',
        icon: 'devicon-plain:mongodb',
        startYear: 2021,
        highlighted: false,
        iconColor: '#47A248',
    },
    {
        name: 'Tailwind',
        icon: 'mdi:tailwind',
        startYear: 2023,
        highlighted: true,
        iconColor: '#06B6D4',
    },
    {
        name: 'Supabase',
        icon: 'devicon-plain:supabase',
        startYear: 2025,
        highlighted: false,
        iconColor: '#3ECF8E',
    },
];
</script>

<template>
    <div class="p-9">
        <div class="size-for-all-screens">
            <h2 class="text-3xl">
                Toolbelt
            </h2>
            <div class="mt-6 flex flex-wrap justify-center gap-3 sm:gap-6">
                <div
                    v-for="technology in technologies"
                    :key="technology.name"
                    class="technology-card p-4 grow-0 basis-[calc((100%_-_0.75rem)/2)] h-32 flex items-center justify-center flex-col gap-2 border-2 rounded-md bg-muted transition-colors sm:basis-[calc((100%_-_1.5rem)/2)] md:basis-[calc((100%_-_3rem)/3)] md:h-52 md:gap-4 lg:basis-[calc((100%_-_4.5rem)/4)]"
                    :style="{ '--glow-color': technology.iconColor }"
                >
                    <Icon
                        :name="technology.icon"
                        size="3em"
                        :style="{ color: technology.iconColor }"
                        class="relative backlight"
                        :data-glow="technology.iconColor"
                    />
                    <p class="afacad w-full text-center text-lg font-medium">
                        {{ technology.name }}
                    </p>
                    <p class="afacad w-full text-center text-sm text-muted-foreground -mt-3 md:-mt-4">
                        {{ yearsSince(technology.startYear) }}
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
.technology-card:hover {
    border-color: var(--glow-color);
}
</style>
