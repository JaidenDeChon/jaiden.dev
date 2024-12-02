<script setup lang="ts">
const colorMode = useColorMode();

function toggleTheme() {
    const currentTheme = colorMode.value;
    switch (currentTheme) {
        case 'light':
            colorMode.preference = 'dark';
            break;
        case 'dark':
            colorMode.preference = 'light';
            break;
        // This should never be reached theoretically.
        default:
            colorMode.preference = 'system';
    }
}
</script>

<template>
    <tooltip-provider :delay-duration="432">
        <tooltip>
            <tooltip-trigger as-child>
                <Button
                    variant="outline"
                    size="icon"
                    @click="toggleTheme"
                >
                    <Icon
                        name="gravity-ui:moon"
                        class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
                    />
                    <Icon
                        name="gravity-ui:sun"
                        class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
                    />
                    <span class="sr-only">Toggle theme</span>
                </Button>
            </tooltip-trigger>
            <tooltip-content>
                <p>Toggle dark mode</p>
            </tooltip-content>
        </tooltip>
    </tooltip-provider>
</template>
