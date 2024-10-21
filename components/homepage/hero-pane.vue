<template>
    <div class="hero-parent">
        <div class="size-for-all-screens flex flex-col justify-between items-center gap-12 p-9 md:flex-row-reverse">
            <div class="flex justify-center w-full">
                <img
                    src="/img/headshot.jpg"
                    class="rounded-md shadow-xl max-h-96"
                >
            </div>

            <div class="flex flex-col gap-12 md:gap-9 md:max-w-xl">
                <h1 class="text-4xl font-medium hero-text">
                    👋 Hello! I'm
                    <span class="text-brand-blue">Jaiden</span>.
                </h1>

                <p class="w-full text-2xl font-medium hero-text">
                    I create
                    <span class="text-brand-blue">beautiful web-apps</span>
                    with an intense focus on
                    <span class="text-brand-blue">performance</span>
                    and
                    <span class="text-brand-blue">accessibility</span>.
                </p>

                <p class="w-full text-2xl font-medium hero-text">
                    When I'm not coding, I love learning about ancient history, sprituality, and consciousness.
                </p>

                <div class="flex gap-6">
                    <Button class="bg-brand-blue text-lg transition-colors hover:bg-brand-blue-darker hover:shadow-lg">
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
        font-family: "Afacad Flux", sans-serif;
    }

    .hero-parent {
        background: radial-gradient(at bottom right, rgba(0,123,255,0.3) 0%, rgba(0, 0, 0, 0) 100%);
        background-attachment: fixed;
        background-position: right;
        background-attachment: scroll;
    }
</style>
