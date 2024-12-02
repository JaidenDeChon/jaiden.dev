<template>
    <header class="border-b-2 border-border px-6 h-16 content-center fixed w-screen bg-background/60 backdrop-blur-lg z-50">
        <div class="size-for-all-screens flex items-center gap-3">
            <nuxt-link
                to="/"
                class="mr-auto bg-brand-blue text-brand-blue-foreground py-1 px-3 -rotate-6 rounded-sm transition-colors hover:shadow-lg hover:bg-brand-blue-darker"
            >
                <h1>
                    <code>jaiden.dev</code>
                </h1>
            </nuxt-link>

            <tooltip-provider :delay-duration="432">
                <tooltip>
                    <tooltip-trigger as-child>
                        <Button
                            variant="outline"
                            size="icon"
                            as-child
                        >
                            <a href="mailto:me@jaiden.foo">
                                <Icon
                                    name="gravity-ui:envelope"
                                    class="h-[1.2rem] w-[1.2rem]"
                                />
                            </a>
                        </Button>
                    </tooltip-trigger>
                    <tooltip-content>
                        <p>Email me</p>
                    </tooltip-content>
                </tooltip>
            </tooltip-provider>

            <tooltip-provider :delay-duration="432">
                <tooltip>
                    <tooltip-trigger as-child>
                        <Button
                            variant="outline"
                            size="icon"
                            as-child
                        >
                            <a
                                href="https://github.com/JaidenDeChon"
                                rel="noreferrer"
                                target="_blank"
                            >
                                <Icon
                                    name="mdi:github"
                                    class="h-[1.2rem] w-[1.2rem]"
                                />
                            </a>
                        </Button>
                    </tooltip-trigger>
                    <tooltip-content>
                        <p>Github</p>
                    </tooltip-content>
                </tooltip>
            </tooltip-provider>

            <theme-switch />
        </div>
    </header>
</template>
