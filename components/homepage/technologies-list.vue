<script setup lang="ts">
interface Technology {
    name: string;
    icon: string;
    subtitle: string;
    highlighted: boolean;
    iconColor: string;
}

const technologies: Technology[] = [
    {
        name: 'HTML',
        icon: 'devicon-plain:html5',
        subtitle: '8 years',
        highlighted: true,
        iconColor: '#E34F26',
    },
    {
        name: 'CSS',
        icon: 'devicon-plain:css3',
        subtitle: '8 years',
        highlighted: true,
        iconColor: '#663399', // rebeccapurple 💜 still waiting for an icon of the new logo @ icones.js.org
    },
    {
        name: 'JS, TS',
        icon: 'devicon-plain:typescript',
        subtitle: '8 years',
        highlighted: true,
        iconColor: '#F0DB4F',
    },
    {
        name: 'VueJS',
        icon: 'devicon-plain:vuejs',
        subtitle: '7 years',
        highlighted: true,
        iconColor: '#42B883',
    },
    {
        name: '.NET',
        icon: 'devicon-plain:dot-net',
        subtitle: '6 years',
        highlighted: false,
        iconColor: '#512BD4',
    },
    {
        name: 'SQL',
        icon: 'devicon-plain:azuresqldatabase',
        subtitle: '6 years',
        highlighted: true,
        iconColor: '#0078D4',
    },
    {
        name: 'React',
        icon: 'akar-icons:react-fill',
        subtitle: '',
        highlighted: false,
        iconColor: '#61DAFB',
    },
    {
        name: 'Angular',
        icon: 'devicon-plain:angular',
        subtitle: '',
        highlighted: false,
        iconColor: '#DD0031',
    },
    {
        name: 'Nuxt',
        icon: 'devicon-plain:nuxtjs',
        subtitle: '',
        highlighted: false,
        iconColor: '#00C58E',
    },
    {
        name: 'Svelte, SvelteKit',
        icon: 'devicon-plain:svelte',
        subtitle: '',
        highlighted: false,
        iconColor: '#FF3E00',
    },
    {
        name: 'NestJS',
        icon: 'devicon-plain:nestjs',
        subtitle: '',
        highlighted: false,
        iconColor: '#E0234E',
    },
    {
        name: 'MongoDB',
        icon: 'devicon-plain:mongodb',
        subtitle: '',
        highlighted: false,
        iconColor: '#47A248',
    },
];
</script>

<template>
    <div class="p-9">
        <div class="size-for-all-screens">
            <h2 class="text-3xl">
                Toolbelt
            </h2>
            <div class="mt-6 grid gap-3 grid-cols-2 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
                <div
                    v-for="technology in technologies"
                    :key="technology.name"
                    class="technology-card p-4 w-full h-32 flex items-center justify-center flex-col gap-2 border-2 rounded-md bg-muted transition-colors md:h-52 md:gap-4"
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
                        {{ technology.subtitle }}
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
