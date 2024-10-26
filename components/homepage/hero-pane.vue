<script setup lang="ts">
import Globe from 'globe.gl';

const colorMode = useColorMode();
const currentColorMode = computed(() => colorMode.value);

const globeBermudaTriangleSideColor = computed(() => {
    switch (colorMode.value) {
        case 'dark':
            return 'rgba(0, 0, 0, 0.12)';
        case 'light':
        default:
            return 'rgba(255, 255, 255, 0.12)';
    }
});

const globeBermudaTriangleBackgroundColor = computed(() => {
    switch (colorMode.value) {
        case 'dark':
            return 'rgba(200, 0, 0, 0.12)';
        case 'light':
        default:
            return 'rgba(200, 0, 0, 0.06)';
    }
});

const globeAccentColor = computed(() => {
    switch (colorMode.value) {
        case 'dark':
            return '0, 99, 204';
        case 'light':
        default:
            return '0, 123, 255';
    }
});

const globeImageUrl = computed(() => {
    switch (colorMode.value) {
        case 'dark':
            return 'img/earth/earth-dark.jpg';
        case 'light':
        default:
            return 'img/earth/earth-light.jpg';
    }
});

const globeBackgroundColor = computed(() => {
    switch (colorMode.value) {
        case 'dark':
            return 'rgb(9, 9, 11)';
        case 'light':
        default:
            return 'rgb(255, 255, 255)';
    }
});

const animateHeading = ref('opacity-0 translate-y-4');
const animateParagraph1 = ref('opacity-0 translate-y-4');
const animateParagraph2 = ref('opacity-0 translate-y-4');
const animateButtonGroup = ref('opacity-0 translate-y-4');

const world = Globe();
const worldContainer: Ref<HTMLElement | null> = ref(null);
const worldLoaded = ref(false);

interface GlobeLocation {
    lat: number;
    lng: number;
}

const ancientSitesWithRings: GlobeLocation[] = [
    { lat: 51.1789, lng: -1.8262 },
    { lat: 29.9792, lng: 31.1342 },
    { lat: 37.2233, lng: 38.9218 },
    { lat: -13.1632, lng: -72.5453 },
    { lat: -27.1127, lng: -109.3497 },
    { lat: 20.6843, lng: -88.5678 },
    { lat: 41.3099, lng: -122.3106 },
    { lat: -14.7390, lng: -75.1300 },
    { lat: -16.5542, lng: -68.6782 },
    { lat: 38.4801, lng: 22.4941 },
    { lat: 29.71778, lng: 110.68694 },
];

const bermudaTriangleGeoJSON = {
    type: 'FeatureCollection',
    features: [
        {
            type: 'Feature',
            properties: {
                name: 'Bermuda Triangle',
            },
            geometry: {
                type: 'Polygon',
                coordinates: [
                    [
                        [-80.1918, 25.7617], // Miami
                        [-64.7505, 32.3078], // Bermuda
                        [-66.0594, 18.4153], // Puerto Rico
                        [-80.1918, 25.7617], // Closing the polygon by repeating the first point
                    ],
                ],
            },
        },
    ],
};

onMounted(() => {
    // Trigger staggered fade-in and move-up animations for each element
    setTimeout(() => animateHeading.value = '', 100);
    setTimeout(() => animateParagraph1.value = '', 200);
    setTimeout(() => animateParagraph2.value = '', 400);
    setTimeout(() => animateButtonGroup.value = '', 600);

    worldLoaded.value = true;
});

// Interpolates color using the brand blue.
const colorInterpolator = (t: number) => `rgba(${globeAccentColor.value},${Math.sqrt(1 - t)})`;

function setUpGlobe() {
    if (worldContainer.value === null) return;

    world(worldContainer.value)
        // Set up world imagery.
        .globeImageUrl(globeImageUrl.value)
        .bumpImageUrl('img/earth/earth-topology.png')
        .backgroundColor(globeBackgroundColor.value)

        // Make initial rotation land on North America.
        .pointOfView({ lat: 25.7617, lng: -80.1918, altitude: 2 }, 0)

        // Set up rings.
        .ringsData(ancientSitesWithRings)
        .ringColor(() => colorInterpolator)
        .ringMaxRadius(() => 3.9)

        // Set up bermuda triangle polygon.
        .polygonCapColor(() => globeBermudaTriangleBackgroundColor.value) // Semi-transparent red for the polygon
        .polygonSideColor(() => globeBermudaTriangleSideColor.value) // Slightly transparent green for sides
        .polygonsData(bermudaTriangleGeoJSON.features); // Apply the GeoJSON data;

    // Set up auto-rotate and disable manual control.
    world.controls().enabled = false;
    world.controls().autoRotateSpeed = -0.6;
    setTimeout(() => {
        world.controls().autoRotate = true;
    }, 1000);
}

watch(worldLoaded, () => setUpGlobe());

watch(currentColorMode, () => {
    world
        .globeImageUrl(globeImageUrl.value)
        .backgroundColor(globeBackgroundColor.value)
        .ringColor(() => colorInterpolator)
        .polygonCapColor(() => globeBermudaTriangleBackgroundColor.value)
        .polygonSideColor(() => globeBermudaTriangleSideColor.value);
});
</script>

<template>
    <div class="hero-parent h-screen">
        <div class="size-for-all-screens overflow-x-hidden">
            <div ref="worldContainer" />
        </div>
        <div class="size-for-all-screens flex flex-col justify-between items-center gap-12 p-9 absolute h-full top-0 md:flex-row-reverse xl:px-0">
            <div class="flex flex-col justify-center gap-12 h-full md:gap-9">
                <h1 :class="`text-4xl font-medium transition-all duration-700 ease-in-out ${animateHeading}`">
                    👋 Hello! I'm Jaiden.
                </h1>

                <p :class="`w-full text-2xl font-medium leading-10 transition-all duration-700 ease-in-out ${animateParagraph1}`">
                    I create
                    <span class="bg-brand-yellow px-2 text-brand-yellow-foreground rounded-sm">
                        beautiful web-apps
                    </span>
                    with an intense focus on
                    <span class="bg-brand-yellow px-2 text-brand-yellow-foreground rounded-sm">
                        performance
                    </span>
                    and
                    <span class="bg-brand-yellow px-2 text-brand-yellow-foreground rounded-sm">
                        accessibility
                    </span>
                    .
                </p>

                <p :class="`w-full text-2xl font-medium leading-10 transition-all duration-700 ease-in-out ${animateParagraph2}`">
                    When I'm not coding, I love learning about ancient history, spirituality, and consciousness.
                </p>

                <div :class="`flex gap-6 transition-all duration-700 ease-in-out ${animateButtonGroup}`">
                    <Button class="bg-brand-blue text-lg transition-colors hover:bg-brand-blue-darker hover:shadow-lg dark:bg-brand-blue-darker dark:text-brand-blue-foreground dark:hover:bg-brand-blue">
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
</style>
