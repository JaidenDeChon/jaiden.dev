<script setup lang="ts">
/**
 * ====================================================================================================================
 * ASCII canvas hero background.
 *
 * A Vue port of SRCL's `ASCIICanvas` component (https://sacred.computer —
 * https://github.com/internet-development/www-sacred/blob/main/components/ASCIICanvas.tsx).
 *
 * It paints an animated field of `0`/`1` glyphs whose brightness ripples through layered sine/cosine waves. The
 * original renders a short, fixed-height strip; this port fills its parent as a full-bleed hero backdrop and flips its
 * grayscale ramp for light vs. dark mode so it reads well against either page background.
 *
 * Like the original, it writes to individual <span> cells only when a glyph or color actually changes, and it pauses
 * animation while scrolled out of view. It additionally honors `prefers-reduced-motion` by painting a single static
 * frame.
 * ====================================================================================================================
 */

const props = withDefaults(defineProps<{
    /** Glyph size, in px. Smaller values pack a denser field. */
    fontSize?: number;
    /** Vertical cell size (line height), in px. */
    lineHeight?: number;
}>(), {
    fontSize: 14,
    lineHeight: 17,
});

/**
 * ====================================================================================================================
 * Light/dark mode.
 * ====================================================================================================================
 */

const colorMode = useColorMode();
const isLightMode = computed(() => colorMode.value === 'light');

// The whole layer is dimmed so the field stays a backdrop rather than competing with the globe and hero copy. Dark mode
// can carry a touch more presence than light before it starts to overwhelm the foreground.
const layerOpacity = computed(() => (isLightMode.value ? 0.5 : 0.6));

/**
 * ====================================================================================================================
 * Cell computation.
 * ====================================================================================================================
 */

/** Character ramp. `'10'` yields a binary `0`/`1` field, matching the SRCL default. */
const DENSITY = '10';

/**
 * Resolve the glyph and grayscale color for a grid cell at a given time. In light mode the brightness ramp is inverted
 * so dark glyphs sit on the light page background instead of light glyphs on a dark one.
 */
function animate(x: number, y: number, t: number, light: boolean): { char: string; color: string } {
    const speed = t * 8;
    const wave1 = Math.sin(x * 0.15 + speed) * Math.cos(y * 0.1 + speed * 0.7);
    const wave2 = Math.sin((x + y) * 0.08 + speed * 1.3);
    const v = wave1 + wave2;
    const digit = DENSITY[Math.floor(x * 0.5 + y * 0.3 + speed * 2) % DENSITY.length];
    let brightness = Math.floor(((Math.sin(v * 2) + 1) / 2) * 180 + 50);
    if (light) brightness = 255 - brightness;
    const hex = brightness.toString(16).padStart(2, '0');
    return { char: digit, color: `#${hex}${hex}${hex}` };
}

/**
 * ====================================================================================================================
 * Rendering.
 * ====================================================================================================================
 */

const preRef = ref<HTMLPreElement | null>(null);

onMounted(() => {
    const el = preRef.value;
    if (!el) return;

    let cancelled = false;
    let frame = 0;
    let cols = 0;
    let rows = 0;
    let visible = false;
    let grid: HTMLSpanElement[] = [];
    let previousCols = -1;
    let previousRows = -1;
    let previousChars: string[] = [];
    let previousColors: string[] = [];
    let light = isLightMode.value;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Hidden probe used solely to measure the rendered width of one monospace glyph.
    const measure = document.createElement('span');
    measure.style.visibility = 'hidden';
    measure.style.position = 'absolute';
    measure.style.whiteSpace = 'pre';
    measure.textContent = 'X';
    el.appendChild(measure);

    // (Re)build the grid of cell <span>s. Cheap no-op when the dimensions are unchanged.
    const buildGrid = (nextCols: number, nextRows: number) => {
        if (nextCols === previousCols && nextRows === previousRows) return;
        previousCols = nextCols;
        previousRows = nextRows;

        while (el.firstChild && el.firstChild !== measure) {
            el.removeChild(el.firstChild);
        }

        const fragment = document.createDocumentFragment();
        const spans: HTMLSpanElement[] = [];
        for (let y = 0; y < nextRows; y++) {
            for (let x = 0; x < nextCols; x++) {
                const span = document.createElement('span');
                span.textContent = ' ';
                spans.push(span);
                fragment.appendChild(span);
            }
            if (y < nextRows - 1) fragment.appendChild(document.createTextNode('\n'));
        }
        el.insertBefore(fragment, measure);

        grid = spans;
        cols = nextCols;
        rows = nextRows;
        previousChars = new Array(nextCols * nextRows).fill('');
        previousColors = new Array(nextCols * nextRows).fill('');
    };

    // Paint every cell for the current time. Only touches the DOM where a glyph or color has actually changed.
    const renderFrame = () => {
        const time = prefersReducedMotion ? 0 : performance.now() * 0.0001;
        const total = cols * rows;
        for (let index = 0; index < total && index < grid.length; index++) {
            const column = index % cols;
            const row = (index - column) / cols;
            const cell = animate(column, row, time, light);
            const span = grid[index];
            if (cell.char !== previousChars[index]) {
                span.textContent = cell.char;
                previousChars[index] = cell.char;
            }
            if (cell.color !== previousColors[index]) {
                span.style.color = cell.color;
                previousColors[index] = cell.color;
            }
        }
    };

    // Recompute the column/row counts that fill the element and rebuild the grid if they changed.
    const measureGrid = () => {
        const charWidth = measure.getBoundingClientRect().width;
        if (charWidth <= 0) return;
        const nextCols = Math.floor(el.clientWidth / charWidth);
        const nextRows = Math.max(1, Math.floor(el.clientHeight / props.lineHeight));
        if (nextCols > 0) buildGrid(nextCols, nextRows);
    };

    const loop = () => {
        if (!visible || cancelled) return;
        renderFrame();
        frame = requestAnimationFrame(loop);
    };

    measureGrid();
    // Paint one frame up front so there's no flash of an empty grid before the observer starts the animation (and so
    // reduced-motion users get a fully rendered field).
    renderFrame();

    const resizeObserver = new ResizeObserver(() => {
        measureGrid();
        if (!visible || prefersReducedMotion) renderFrame();
    });
    resizeObserver.observe(el);

    const intersectionObserver = new IntersectionObserver(
        ([entry]) => {
            const wasVisible = visible;
            visible = entry.isIntersecting;
            if (visible && !wasVisible && !prefersReducedMotion) {
                frame = requestAnimationFrame(loop);
            }
        },
        { threshold: 0 },
    );
    intersectionObserver.observe(el);

    // Repaint the whole field when the color mode flips: the brightness ramp inverts, so force every cell past the
    // change-detection guard by clearing the cached colors.
    const stopColorModeWatch = watch(isLightMode, (value) => {
        light = value;
        previousColors = new Array(cols * rows).fill('');
        if (!visible || prefersReducedMotion) renderFrame();
    });

    onBeforeUnmount(() => {
        cancelled = true;
        cancelAnimationFrame(frame);
        resizeObserver.disconnect();
        intersectionObserver.disconnect();
        stopColorModeWatch();
        if (measure.parentNode) measure.parentNode.removeChild(measure);
    });
});
</script>

<template>
    <div
        class="ascii-canvas-background"
        aria-hidden="true"
        :style="{ opacity: layerOpacity }"
    >
        <pre
            ref="preRef"
            class="ascii-canvas-background__field"
            :style="{ fontSize: `${fontSize}px`, lineHeight: `${lineHeight}px` }"
        />
    </div>
</template>

<style scoped>
.ascii-canvas-background {
    position: absolute;
    top: 0;
    left: 50%;
    width: 100vw;
    height: 100%;
    transform: translateX(-50%);
    overflow: hidden;
    pointer-events: none;
    user-select: none;
    z-index: 0;
    transition: opacity 420ms ease;

    /* Soft-fade the top and bottom edges so the field melts into the header above and the section below the hero
       instead of hard-cutting. */
    -webkit-mask-image: linear-gradient(to bottom, transparent 0%, #000 18%, #000 72%, transparent 100%);
    mask-image: linear-gradient(to bottom, transparent 0%, #000 18%, #000 72%, transparent 100%);
}

.ascii-canvas-background__field {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    white-space: pre;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, "Cascadia Mono", Consolas, "Liberation Mono", monospace;
    letter-spacing: 0;
    /* Individual cells set their own color each frame; this is only a pre-paint fallback. */
    color: transparent;
}
</style>
