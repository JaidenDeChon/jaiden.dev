<script setup lang="ts">
import * as THREE from 'three';
import Globe from 'globe.gl';
import HeroText from './hero-text.vue';
import { COORDINATES } from '~/lib/constants/coordinates';
import { BERMUDA_TRIANGLE_GEO_JSON } from '~/lib/constants/bermuda-triangle-geo-json';
import { getOrbitPoints } from '~/lib/constants/orbit-points';

/**
 * ====================================================================================================================
 * Lifecycle hooks.
 * ====================================================================================================================
 */

onMounted(() => {
    setViewportWidthVariable();
    worldLoaded.value = true;
    window.addEventListener('resize', setViewportWidthVariable);
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', setViewportWidthVariable);
});

/**
 * ====================================================================================================================
 * Miscl helpful variables.
 * ====================================================================================================================
 */

const defaultLights: THREE.Light[] = [];
const tailwindXlBreakpoint = 1500;
const arcTiming = 1000;

/**
 * ====================================================================================================================
 * Viewport and container width management.
 * ====================================================================================================================
 */

const currentViewportWidth = ref(0);
watch(currentViewportWidth, sizeWorldContainerToViewport);

function setViewportWidthVariable() {
    currentViewportWidth.value = document.body.clientWidth;
}

function sizeWorldContainerToViewport() {
    if (!worldLoaded.value) return;

    const width = currentViewportWidth.value > tailwindXlBreakpoint
        ? currentViewportWidth.value * 1.5
        : currentViewportWidth.value;

    world.width(width);
    world.height(document.body.clientHeight);
}

/**
 * ====================================================================================================================
 * Light/dark mode and color management.
 * ====================================================================================================================
 */

const colorMode = useColorMode();

const isLightMode = computed(() => colorMode.value === 'light');

watch(isLightMode, () => {
    if (!worldLoaded.value) return;
    configureRingColor();
    configureArcColor();
    configureLights();
});

const primaryAccentColorInterpolator = (t: number): string => `rgba(${primaryAccentColor.value},${Math.sqrt(1 - t)})`;
const primaryAccentColor = computed(() => {
    return colorMode.value === 'dark' ? '0, 99, 204' : '0, 123, 255';
});

const secondaryAccentColorInterpolator = (t: number): string => `rgba(${secondaryAccentColor.value},${Math.sqrt(1 - t)})`;
const secondaryAccentColor = computed(() => {
    return colorMode.value === 'dark' ? '255, 217, 0' : '204, 173, 0';
});

/**
 * ====================================================================================================================
 * Globe rendering.
 * ====================================================================================================================
 */

const world = Globe(
    {
        // Customize the WebGLRenderer config for better performance.
        rendererConfig: {
            precision: 'mediump',
            stencil: false,
            preserveDrawingBuffer: false,
            powerPreference: 'high-performance',
        },
    },
);
const worldContainer: Ref<HTMLElement | null> = ref(null);

const worldLoaded = ref(false);
watch(worldLoaded, renderGlobe);

function renderGlobe() {
    if (!worldContainer.value) return;

    world(worldContainer.value)
        // Set up world texture and bump map.
        .globeImageUrl('img/earth/earth-dark.webp')
        .bumpImageUrl('img/earth/earth-topology.webp')
        .backgroundColor('rgba(0, 0, 0, 0)')
        .atmosphereAltitude(0.24)
        // Start rotation on the Americas.
        .pointOfView({ lng: -80.1918 }, 0)
        // Configure coordinate pings for when rendering begins.
        .ringMaxRadius(() => 6.6)
        .ringRepeatPeriod(1800)
        .ringColor(() => primaryAccentColorInterpolator)
        // Render bermuda triangle.
        .polygonCapColor(() => 'rgba(255, 0, 0, 0.06)')
        .polygonSideColor(() => 'rgba(0, 0, 0, 0)')
        .polygonsData(BERMUDA_TRIANGLE_GEO_JSON.features)
        // Configure arcs for when rendering begins.
        .arcAltitudeAutoScale(0.3)
        .arcDashLength(0.3)
        .arcDashGap(2)
        .arcDashInitialGap(1)
        .arcDashAnimateTime(arcTiming)
        .arcStroke(0.6)
        .arcsTransitionDuration(0)
        .arcColor(() => secondaryAccentColorInterpolator)
        // Render orbit effects (a few hundred random points around the globe).
        .customLayerData(getOrbitPoints(`rgb(${primaryAccentColor.value})`))
        .customThreeObject((data) => {
            const { size, color } = data as { size: number; color: THREE.ColorRepresentation };
            const circleGeometry = new THREE.CircleGeometry(size, 16);
            const material = new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide });
            return new THREE.Mesh(circleGeometry, material);
        })
        .customThreeObjectUpdate((obj, data) => {
            const { lat, lng, altitude } = data as { lat: number; lng: number; altitude: number };
            Object.assign(obj.position, world.getCoords(lat, lng, altitude));
            obj.lookAt(world.camera().position);
        });

    // Size the world to the viewport.
    sizeWorldContainerToViewport();

    // Set up and save world lights for an easier time recycling them. This effectively disables the spotlight in light
    // mode since the color modification inverts the world colors, turning the spotlight into a... spotdark?
    if (defaultLights.length === 0) defaultLights.push(...world.lights());
    configureLights();

    // Set up globe controls.
    if (currentViewportWidth.value < tailwindXlBreakpoint) world.controls().enabled = false;
    world.controls().enableZoom = false;
    world.controls().autoRotateSpeed = -0.6;
    world.controls().autoRotate = true;

    // Add the rings to the globe from the north to the south.
    addRingsIncrementally();
}

function configureLights() {
    world.lights(isLightMode.value ? [defaultLights[0]] : defaultLights);
}

function configureArcColor() {
    world.arcColor(() => secondaryAccentColorInterpolator);
}

function configureRingColor() {
    world.ringColor(() => primaryAccentColorInterpolator);
}

function addRingsIncrementally() {
    let index = 0;
    // Add a ring to the globe every few ms.
    const addPointToGlobe = setInterval(() => {
        if (index >= COORDINATES.length) {
            clearInterval(addPointToGlobe);
            // Begin emitting arcs randomly from coord to coord every so often now that all rings have been added.
            setInterval(emitRandomArc, 333);
            return;
        }
        const currentCoordinate = COORDINATES[index];
        world.ringsData([...world.ringsData(), currentCoordinate]);
        index += 1;
    }, 12);
}

function emitRandomArc() {
    const pointA = COORDINATES[Math.floor(Math.random() * COORDINATES.length)];
    let pointB = COORDINATES[Math.floor(Math.random() * COORDINATES.length)];

    // Avoid emitting an arc to and from the same point.
    while (pointA === pointB) {
        pointB = COORDINATES[Math.floor(Math.random() * COORDINATES.length)];
    }

    // Assemble the arc data and add it to the world's arc data.
    const arc = { startLat: pointA.lat, startLng: pointA.lng, endLat: pointB.lat, endLng: pointB.lng };
    world.arcsData([...world.arcsData(), arc]);

    // Remove the arc from the world data after a couple seconds.
    setTimeout(() => {
        world.arcsData(world.arcsData().filter(d => d !== arc));
    }, arcTiming * 2);
}
</script>

<template>
    <div class="size-for-all-screens relative flex justify-center 2xl:justify-end">
        <div
            ref="worldContainer"
            class="hero-parent__world-container 2xl:transform 2xl:translate-x-1/3 2xl:-mr-40 3xl:-mr-64 4xl:-mr-72 5xl:-mr-80 6xl:-mr-96"
            :class="{ 'hero-parent__world-container--inverted': isLightMode }"
        />
        <div class="absolute h-full w-full pointer-events-none lg:left-1/2 lg:transform lg:-translate-x-1/2">
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
        filter: invert(100%) hue-rotate(180deg);
    }
}
</style>
