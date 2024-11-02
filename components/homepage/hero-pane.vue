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
const colorInterpolator = (t: number): string => `rgba(${globeAccentColor.value},${Math.sqrt(1 - t)})`;

function setUpGlobe() {
    // Check if the world container is null and return early if it is.
    if (worldContainer.value === null) return;

    const globe = world(worldContainer.value)
        // Set up world imagery with texture and bump map for better visual representation.
        .globeImageUrl('img/earth/earth-dark.jpg')
        .bumpImageUrl('img/earth/earth-topology.png')
        .backgroundColor('rgba(0, 0, 0, 0)')
        .atmosphereAltitude(0.24)

        // Set initial rotation to focus on the Americas.
        .pointOfView({
            lng: -80.1918,
        }, 0)

        // Set up ring data for visualization.
        .ringsData(ancientSitesWithRings)
        .ringColor(() => colorInterpolator)
        .ringMaxRadius(() => 4.2)
        .ringRepeatPeriod(1800)

        // Set up Bermuda Triangle polygon visualization.
        .polygonCapColor(() => 'rgba(255, 0, 0, 0.06)')
        .polygonSideColor(() => 'rgba(0, 0, 0, 0)')
        .polygonsData(bermudaTriangleGeoJSON.features)

        // Configure arcs for globe interactions.
        .arcColor(() => `rgb(${globeAccentColor.value})`)
        .arcAltitudeAutoScale(0.3)
        .arcDashLength(0.06)
        .arcDashGap(2)
        .arcDashInitialGap(1)
        .arcDashAnimateTime(1000)
        .arcStroke(0.6)
        .arcsTransitionDuration(0);

    // Hold onto default lights for use in light/dark mode switching.
    defaultLights.push(...globe.lights());
    globe.lights(isLightMode.value ? [defaultLights[0]] : defaultLights);

    // Set up auto-rotate and control settings based on viewport size.
    if (currentViewportWidth.value < maxWorldContainerWidth) globe.controls().enabled = false;
    globe.controls().enableZoom = false;
    globe.controls().autoRotateSpeed = -0.6;
    globe.controls().autoRotate = true;
    setTimeout(() => {
        globe.controls().autoRotate = true;
    }, 1000);

    // Function to emit a random arc between two established points.
    function emitRandomArc() {
        // Select a random start point from the list of established points.
        const pointA = ancientSitesWithRings[Math.floor(Math.random() * ancientSitesWithRings.length)];
        let pointB = ancientSitesWithRings[Math.floor(Math.random() * ancientSitesWithRings.length)];

        // Ensure the start and end points are not the same.
        while (pointA === pointB) {
            pointB = ancientSitesWithRings[Math.floor(Math.random() * ancientSitesWithRings.length)];
        }

        // Create the arc data object with start and end coordinates.
        const arc = { startLat: pointA.lat, startLng: pointA.lng, endLat: pointB.lat, endLng: pointB.lng };

        // Add the new arc to the globe's arcs data.
        globe.arcsData([...globe.arcsData(), arc]);

        // Remove the arc after it has been displayed for a certain duration.
        setTimeout(() => {
            globe.arcsData(globe.arcsData().filter(d => d !== arc));
        }, 2000); // Duration for how long the arc remains visible (2 seconds).
    }

    // Emit arcs at regular intervals to create a dynamic effect.
    setInterval(() => {
        emitRandomArc(); // Emit a new random arc every 1.5 seconds.
    }, 300); // Adjust this value to control how frequently arcs are emitted.
}

function sizeWorldContainerToViewport() {
    const innerWidth = document.body.clientWidth;
    const innerHeight = document.body.clientHeight;

    world.height(innerHeight);
    world.width(innerWidth > maxWorldContainerWidth ? maxWorldContainerWidth : innerWidth);
}

watch(worldLoaded, () => setUpGlobe());

watch(
    isLightMode,
    (newValue: boolean) => {
        world
            .lights(newValue ? [defaultLights[0]] : defaultLights)
            .ringColor(() => colorInterpolator)
            .arcColor(() => `rgb(${globeAccentColor.value})`);
    },
);
</script>

<template>
    <div class="size-for-all-screens relative flex justify-center 2xl:justify-end">
        <div
            ref="worldContainer"
            class="hero-parent__world-container 2xl:-mr-24"
            :class="{ 'hero-parent__world-container--inverted': isLightMode }"
        />
        <div class="absolute h-full w-full max-w-72xl pointer-events-none lg:left-1/2 lg:transform lg:-translate-x-1/2">
            <hero-text class="h-full px-9 max-w-lg 22xl:p-0 mx-auto text-center 2xl:px-0 2xl:mx-0 2xl:text-left" />
        </div>
    </div>
</template>

<style>
    .hero-parent__world-container {
        & canvas {
            width: 100vw;
            transition: filter 0.420s ease;
        }

        &.hero-parent__world-container--inverted canvas {
            transition: filter 0.420s ease;
            filter: invert(100%) hue-rotate(180deg);
        }
    }
</style>
