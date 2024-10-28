<script setup lang="ts">
import Globe from 'globe.gl';
import HeroText from './hero-text.vue';

const colorMode = useColorMode();
const isLightMode = computed(() => colorMode.value === 'light');

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

const maxWorldContainerWidth = 1024;
const currentViewportWidth = ref(0);
watch(currentViewportWidth, () => {
    sizeWorldContainerToViewport();
});

onMounted(() => {
    // Initial value setting for viewportWidth tracking variable.
    currentViewportWidth.value = window.innerWidth;

    // Load globe.
    worldLoaded.value = true;

    // Set up globe resize on window size change.
    window.addEventListener('resize', () => currentViewportWidth.value = window.innerWidth);
});

onBeforeUnmount(() => {
    window.removeEventListener('rezie', () => currentViewportWidth.value = window.innerWidth);
});

// Interpolates color using the brand blue.
const colorInterpolator = (t: number) => `rgba(${globeAccentColor.value},${Math.sqrt(1 - t)})`;

function setUpGlobe() {
    if (worldContainer.value === null) return;

    world(worldContainer.value)
        // Set up world imagery.
        .globeImageUrl('img/earth/earth-dark.jpg')
        .bumpImageUrl('img/earth/earth-topology.png')
        .backgroundColor('rgba(0, 0, 0, 0)')

        // Make initial rotation land on North America.
        .pointOfView({ lng: -80.1918 }, 0)

        // Set up rings.
        .ringsData(ancientSitesWithRings)
        .ringColor(() => colorInterpolator)
        .ringMaxRadius(() => 3.9)

        // Set up bermuda triangle polygon.
        .polygonCapColor(() => globeBermudaTriangleBackgroundColor.value) // Semi-transparent red for the polygon
        .polygonSideColor(() => globeBermudaTriangleSideColor.value) // Slightly transparent green for sides
        .polygonsData(bermudaTriangleGeoJSON.features); // Apply the GeoJSON data;

    // Set up auto-rotate and disable manual control if mobile resolution.
    if (currentViewportWidth.value < maxWorldContainerWidth) world.controls().enabled = false;
    world.controls().enableZoom = false;
    world.controls().autoRotateSpeed = -0.6;
    setTimeout(() => {
        world.controls().autoRotate = true;
    }, 1000);
}

function sizeWorldContainerToViewport() {
    const innerWidth = window.innerWidth;
    const innerHeight = window.innerHeight;

    world.height(innerHeight);
    world.width(innerWidth > maxWorldContainerWidth ? maxWorldContainerWidth : innerWidth);
}

watch(worldLoaded, () => setUpGlobe());

watch(isLightMode, () => {
    world
        .ringColor(() => colorInterpolator)
        .polygonCapColor(() => globeBermudaTriangleBackgroundColor.value)
        .polygonSideColor(() => globeBermudaTriangleSideColor.value);
});
</script>

<template>
    <div class="overflow-x-hidden relative flex">
        <div
            ref="worldContainer"
            class="hero-parent__world-container lg:ml-auto"
            :class="{ inverted: isLightMode }"
        />
        <div class="absolute h-full w-full max-w-7xl pointer-events-none lg:left-1/2 lg:transform lg:-translate-x-1/2">
            <hero-text class="h-full mr-auto p-9 max-w-lg 2xl:p-0" />
        </div>
    </div>
</template>

<style>
    * {
        @apply afacad;
    }

    .hero-parent__world-container canvas {
        transition: filter 0.5s ease;
    }

    .hero-parent__world-container.inverted canvas {
        transition: filter 0.5s ease;
        filter: invert(100%) hue-rotate(180deg);
    }
</style>
