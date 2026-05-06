<script setup lang="ts">
type PdfJsModule = typeof import('pdfjs-dist');
type PdfLoadingTask = ReturnType<PdfJsModule['getDocument']>;
type PdfDocument = Awaited<PdfLoadingTask['promise']>;

const resumePagesElement = ref<HTMLElement | null>(null);
const resumePageImages = ref<string[]>([]);
const isLoadingResume = ref(true);
const resumeLoadError = ref('');

let pdfJsModulePromise: Promise<PdfJsModule> | null = null;
let pdfDocument: PdfDocument | null = null;
let lastRenderedWidth = 0;
let renderRequestId = 0;
let resizeObserver: ResizeObserver | null = null;
let resizeAnimationFrame = 0;

async function getPdfJsModule(): Promise<PdfJsModule> {
    if (!pdfJsModulePromise) {
        pdfJsModulePromise = import('pdfjs-dist');
    }

    const pdfJsModule = await pdfJsModulePromise;
    pdfJsModule.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();

    return pdfJsModule;
}

async function getPdfDocument(): Promise<PdfDocument> {
    if (pdfDocument) {
        return pdfDocument;
    }

    const pdfJsModule = await getPdfJsModule();
    const loadingTask = pdfJsModule.getDocument('/jaiden_dechon_resume.pdf');

    pdfDocument = await loadingTask.promise;

    return pdfDocument;
}

async function renderResumePages(): Promise<void> {
    if (!import.meta.client || !resumePagesElement.value) {
        return;
    }

    const containerWidth = Math.floor(resumePagesElement.value.clientWidth);

    if (!containerWidth) {
        return;
    }

    if (Math.abs(containerWidth - lastRenderedWidth) < 4 && resumePageImages.value.length > 0) {
        return;
    }

    lastRenderedWidth = containerWidth;

    const currentRenderRequestId = ++renderRequestId;

    isLoadingResume.value = true;
    resumeLoadError.value = '';

    try {
        const pdf = await getPdfDocument();
        const nextPageImages: string[] = [];
        const pixelRatio = window.devicePixelRatio || 1;

        for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
            const page = await pdf.getPage(pageNumber);
            const baseViewport = page.getViewport({ scale: 1 });
            const renderViewport = page.getViewport({ scale: (containerWidth / baseViewport.width) * pixelRatio });
            const canvas = document.createElement('canvas');
            const canvasContext = canvas.getContext('2d');

            if (!canvasContext) {
                throw new Error('Canvas 2D context is unavailable.');
            }

            canvas.width = Math.ceil(renderViewport.width);
            canvas.height = Math.ceil(renderViewport.height);

            await page.render({
                canvas: null,
                canvasContext,
                viewport: renderViewport,
            }).promise;

            if (currentRenderRequestId !== renderRequestId) {
                return;
            }

            nextPageImages.push(canvas.toDataURL('image/png'));
            page.cleanup();
        }

        if (currentRenderRequestId !== renderRequestId) {
            return;
        }

        resumePageImages.value = nextPageImages;
    }
    catch {
        if (currentRenderRequestId !== renderRequestId) {
            return;
        }

        resumeLoadError.value = 'Unable to render the inline resume preview.';
    }
    finally {
        if (currentRenderRequestId === renderRequestId) {
            isLoadingResume.value = false;
        }
    }
}

function scheduleResumeRender(): void {
    if (!import.meta.client) {
        return;
    }

    if (resizeAnimationFrame) {
        cancelAnimationFrame(resizeAnimationFrame);
    }

    resizeAnimationFrame = requestAnimationFrame(() => {
        resizeAnimationFrame = 0;
        void renderResumePages();
    });
}

onMounted(() => {
    void renderResumePages();

    if (!resumePagesElement.value) {
        return;
    }

    resizeObserver = new ResizeObserver(() => {
        scheduleResumeRender();
    });

    resizeObserver.observe(resumePagesElement.value);
});

onBeforeUnmount(() => {
    resizeObserver?.disconnect();

    if (resizeAnimationFrame) {
        cancelAnimationFrame(resizeAnimationFrame);
    }

    void pdfDocument?.destroy();
    pdfDocument = null;
});
</script>

<template>
    <main class="min-h-[calc(100vh-4rem)] pt-24 pb-12">
        <section class="prose prose-slate dark:prose-invert mx-auto p-6 lg:px-0">
            <header class="not-prose mb-6 flex items-center justify-between gap-4">
                <p class="afacad text-sm font-medium uppercase tracking-[0.3em] text-muted-foreground">
                    Résumé
                </p>

                <div class="flex items-center gap-2">
                    <Button
                        as-child
                        variant="link"
                    >
                        <a href="/jaiden_dechon_resume.pdf">
                            View PDF
                        </a>
                    </Button>

                    <Button
                        as-child
                        class="bg-brand-blue transition-colors hover:bg-brand-blue-darker dark:bg-brand-blue dark:text-brand-blue-foreground dark:hover:bg-brand-blue-darker"
                    >
                        <a
                            class="text-brand-blue-foreground hover:text-brand-blue-foreground"
                            href="/jaiden_dechon_resume.pdf"
                            download="jaiden_dechon_resume.pdf"
                            type="application/pdf"
                        >
                            Download PDF
                        </a>
                    </Button>
                </div>
            </header>

            <div
                ref="resumePagesElement"
                class="not-prose"
            >
                <div
                    v-if="isLoadingResume"
                    class="rounded-xl border border-border bg-background p-6 text-sm text-muted-foreground shadow"
                >
                    Loading resume preview...
                </div>

                <div
                    v-else-if="resumeLoadError"
                    class="rounded-xl border border-border bg-background p-6 text-sm text-muted-foreground shadow"
                >
                    {{ resumeLoadError }}
                    <a
                        href="/jaiden_dechon_resume.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Open the resume directly
                    </a>.
                </div>

                <div
                    v-else
                    class="flex flex-col gap-4"
                >
                    <img
                        v-for="(pageImage, index) in resumePageImages"
                        :key="index"
                        :src="pageImage"
                        :alt="`Resume page ${index + 1}`"
                        class="block w-full rounded-xl border border-border bg-background shadow"
                    >
                </div>
            </div>
        </section>
    </main>
</template>
