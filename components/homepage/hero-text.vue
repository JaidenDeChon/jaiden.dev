<script setup lang="ts">
import { smoothScrollIntoView } from '~/lib/helpers/smoth-scroll-into-view';

const animateHeading = ref('opacity-0 translate-y-4');
const animateParagraph1 = ref('opacity-0 translate-y-4');
const animateParagraph2 = ref('opacity-0 translate-y-4');
const animateButtonGroup = ref('opacity-0 translate-y-4');

onMounted(() => {
    // Trigger staggered fade-in and move-up animations for each element
    setTimeout(() => animateHeading.value = '', 300);
    setTimeout(() => animateParagraph1.value = '', 360);
    setTimeout(() => animateParagraph2.value = '', 420);
    setTimeout(() => animateButtonGroup.value = '', 480);
});

function scrollToProjects(): void {
    const myProjectsParent = document.getElementById('my-projects-parent');
    if (!myProjectsParent) return;

    smoothScrollIntoView(myProjectsParent);
}
</script>

<template>
    <div class="afacad flex flex-col justify-between items-center gap-12 pointer-events-auto">
        <div class="flex flex-col justify-center gap-12 h-full">
            <h1 :class="`text-4xl font-medium transition ease-in-out ${animateHeading}`">
                👋 Hello! I'm Jaiden.
            </h1>

            <p :class="`w-full text-2xl font-medium leading-10 transition ease-in-out ${animateParagraph1}`">
                I create
                <span class="bg-brand-yellow mx-1 px-2 text-brand-yellow-foreground rounded-sm inline-block">
                    beautiful web-apps
                </span>
                with an intense focus on
                <span class="bg-brand-yellow mx-1 px-2 text-brand-yellow-foreground rounded-sm inline-block my-1">
                    performance
                </span>
                and
                <span class="bg-brand-yellow mx-1 px-2 text-brand-yellow-foreground rounded-sm inline-block">
                    accessibility.
                </span>
            </p>

            <p :class="`w-full text-2xl font-medium leading-10 transition ease-in-out ${animateParagraph2}`">
                When I'm not coding, I love learning about ancient history, spirituality, and consciousness.
            </p>

            <div :class="`flex gap-6 justify-center transition ease-in-out ${animateButtonGroup} 2xl:justify-start`">
                <Button class="bg-brand-blue text-lg transition-colors hover:bg-brand-blue-darker hover:shadow-lg dark:bg-brand-blue-darker dark:text-brand-blue-foreground dark:hover:bg-brand-blue md:relative md:backlight">
                    Get in touch
                </Button>
                <Button
                    class="text-lg"
                    variant="secondary"
                    @click="scrollToProjects"
                >
                    My projects
                </Button>
            </div>
        </div>
    </div>
</template>
