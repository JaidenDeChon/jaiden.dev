<script setup lang="ts">
import Globe from 'globe.gl';
import HeroText from './hero-text.vue';

const colorMode = useColorMode();
const isLightMode = computed(() => colorMode.value === 'light');

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
const defaultLights: unknown[] = [];

interface GlobeLocation {
    name: string;
    lat: number;

    lng: number;
}

const ancientSitesWithRings: GlobeLocation[] = [
    {
        name: 'Stonehenge',
        lat: 51.178889,
        lng: -1.826111,
    },
    {
        name: 'Great Pyramid of Giza',
        lat: 29.987,
        lng: 31.2118,
    },
    {
        name: 'Gobekli Tepe',
        lat: 37.223611,
        lng: 38.921667,
    },
    {
        name: 'Easter island',
        lat: -27.116667,
        lng: -109.366667,
    },
    {
        name: 'Chichen Itza',
        lat: 20.683056,
        lng: -88.568611,
    },
    {
        name: 'Mount Shasta',
        lat: 41.409196,
        lng: -122.194888,
    },
    {
        name: 'Nazca Lines',
        lat: -14.6975,
        lng: -75.135,
    },
    {
        name: 'Tiahuanaco / Tiwanaku',
        lat: -16.554722,
        lng: -68.673333,
    },
    {
        name: 'Delphi',
        lat: 38.4823,
        lng: 22.5013,
    },
    {
        name: 'Mount Hayes',
        lat: 63.620833,
        lng: -146.715278,
    },
    {
        name: 'Barabar Caves',
        lat: 25.005,
        lng: 85.063,
    },
    {
        name: 'Skinwalker Ranch',
        lat: 40.258158,
        lng: -109.888392,
    },
    {
        name: 'Monte Perdido',
        lat: 42.666667,
        lng: 0.033333,
    },
    {
        name: 'Mount Zeil',
        lat: -23.4018,
        lng: 132.3958,
    },
    {
        name: 'Mount Nyangani',
        lat: -18.3,
        lng: 32.841667,
    },
    {
        name: 'Mount Ararat',
        lat: 39.7019,
        lng: 44.2983,
    },
    {
        name: '???',
        lat: 29.7178,
        lng: -110.6869,
    },
    {
        name: 'Secret Mountain',
        lat: 34.9536,
        lng: -111.8845,
    },
    {
        name: 'Richat Structure',
        lat: 21.31081,
        lng: -11.42491,
    },
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
                        [-80.1918, 25.7617],
                        [-64.7505, 32.3078],
                        [-66.0594, 18.4153],
                        [-80.1918, 25.7617],
                    ],
                ],

            },

        },
    ],
};

const maxWorldContainerWidth = 768;
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
        .atmosphereAltitude(0.24)

        // Make initial rotation land on North and South America.
        .pointOfView({
            lng: -80.1918,
        }, 0)

        // Set up rings.
        .ringsData(ancientSitesWithRings)
        .ringColor(() => colorInterpolator)
        .ringMaxRadius(() => 3.9)

        // Set up bermuda triangle polygon.
        .polygonCapColor(() => 'rgba(255, 0, 0, 0.12)')
        .polygonSideColor(() => 'rgba(0, 0, 0, 0)')
        .polygonsData(bermudaTriangleGeoJSON.features);

    // Hold onto default lights since we remove one of them in light mode and restore it in dark.
    defaultLights.push(...world.lights());
    world.lights(isLightMode.value ? [defaultLights[0]] : defaultLights);

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

watch(
    isLightMode,
    (newValue: boolean) => {
        world
            .lights(newValue ? [defaultLights[0]] : defaultLights)
            .ringColor(() => colorInterpolator);
    },
);
</script>

<template>
    <div class="overflow-x-hidden relative flex">
        <div
            ref="worldContainer"
            class="hero-parent__world-container lg:ml-auto xl:mr-16 2xl:mr-24 3xl:mr-32 4xl:mr-"
            :class="{ inverted: isLightMode }"
        />
        <div class="absolute h-full w-full max-w-7xl pointer-events-none lg:left-1/2 lg:transform lg:-translate-x-1/2">
            <hero-text class="h-full p-9 max-w-lg 2xl:p-0 mx-auto text-center md:mx-0 md:text-left" />
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
