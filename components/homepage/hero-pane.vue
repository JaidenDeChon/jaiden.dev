<template>
    <div class="hero-parent">
        <div class="size-for-all-screens flex flex-col justify-between items-center gap-12 p-9 md:flex-row-reverse xl:px-0">
            <div class="flex justify-center w-full">
                <img
                    src="/img/headshot.jpg"
                    class="rounded-md shadow-xl max-h-96"
                >
            </div>

            <div class="flex flex-col gap-12 md:gap-9">
                <h1 class="text-4xl font-medium">
                    👋 Hello! I'm Jaiden.
                </h1>

                <p class="w-full text-2xl font-medium leading-10">
                    I create
                    <span class="bg-brand-yellow px-2 text-brand-yellow-foreground rounded-sm">beautiful web-apps</span>
                    with an intense focus on
                    <span class="bg-brand-yellow px-2 text-brand-yellow-foreground rounded-sm">performance</span>
                    and
                    <span class="bg-brand-yellow px-2 text-brand-yellow-foreground rounded-sm">accessibility</span>.
                </p>

                <p class="w-full text-2xl font-medium leading-10">
                    When I'm not coding, I love learning about ancient history, sprituality, and consciousness.
                </p>

                <div class="flex gap-6">
                    <Button class="bg-brand-blue text-lg transition-colors hover:bg-brand-blue-darker hover:shadow-lg dark:bg-brand-blue-darker dark:text-brand-blue-foreground dark:hover:bg-brand-blue relative backlight">
                        Get in touch
                    </Button>
                    <Button
                        class="text-lg"
                        variant="secondary"
                    >
                        My projects
                    </Button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
    * {
        @apply afacad;
    }

    .hero-parent {
        background: radial-gradient(at bottom right, rgba(0,123,255,0.3) 0%, rgba(0, 0, 0, 0) 100%);
        background-attachment: fixed;
        background-position: right;
        background-attachment: scroll;
    }
</style>
