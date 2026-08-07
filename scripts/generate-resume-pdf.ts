/**
 * Prints /resume to public/jaiden_dechon_resume.pdf.
 *
 * Which server does it print from? The dev server. `nuxt preview` is
 * deliberately not used: this project's `.output` bundle cannot resolve `vue`
 * on its own (that is what `scripts/prepare-netlify-function-deps.mjs` fixes up
 * at deploy time), so a standalone preview returns a 500. The dev server
 * renders the same components with the same CSS, and `page.pdf()` forces print
 * media, so the output is identical.
 *
 * `bun run resume:pdf` boots one on its own. To print from a server you already
 * have running instead, point the script at it:
 *
 *     RESUME_PDF_URL=http://localhost:3000/resume bun scripts/generate-resume-pdf.ts
 *
 * Requires a Chromium build: `bunx playwright install chromium`.
 */
import type { ChildProcess } from 'node:child_process';
import { spawn } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import process from 'node:process';
import type { Page } from 'playwright';
import { chromium } from 'playwright';

const PROJECT_ROOT = resolve(import.meta.dirname, '..');
const OUTPUT_PATH = resolve(PROJECT_ROOT, 'public/jaiden_dechon_resume.pdf');
const SERVER_PORT = Number(process.env.RESUME_PDF_PORT ?? 4173);
const SERVER_URL = `http://localhost:${SERVER_PORT}`;
const SERVER_READY_TIMEOUT_MS = 180_000;

const PT_TO_PX = 96 / 72;

function delay(ms: number): Promise<void> {
    return new Promise(resolveDelay => setTimeout(resolveDelay, ms));
}

async function waitForServer(url: string, onTimeout: () => string): Promise<void> {
    const deadline = Date.now() + SERVER_READY_TIMEOUT_MS;

    while (Date.now() < deadline) {
        try {
            // The dev server answers 426 while it is still warming up, so only
            // a genuine 2xx counts as ready.
            if ((await fetch(url)).ok) {
                return;
            }
        }
        catch {
            // Not listening yet; keep polling.
        }

        await delay(500);
    }

    throw new Error(`Timed out waiting for ${url}.\n${onTimeout()}`);
}

async function startDevServer(): Promise<ChildProcess> {
    console.log(`Booting a dev server on ${SERVER_URL} ...`);

    const server = spawn(
        'bunx',
        ['nuxt', 'dev', '--port', String(SERVER_PORT)],
        {
            cwd: PROJECT_ROOT,
            // NUXT_IGNORE_LOCK lets this coexist with a dev server you already
            // have running on another port.
            env: { ...process.env, PORT: String(SERVER_PORT), NUXT_IGNORE_LOCK: '1' },
            detached: true,
            stdio: ['ignore', 'pipe', 'pipe'],
        },
    );

    let log = '';
    const collect = (chunk: Buffer) => {
        log += chunk.toString();
    };

    server.stdout?.on('data', collect);
    server.stderr?.on('data', collect);

    await waitForServer(`${SERVER_URL}/resume`, () => `Server output:\n${log}`);

    return server;
}

function stopServer(server: ChildProcess | null): void {
    if (!server?.pid) {
        return;
    }

    // The dev server spawns children of its own, so take down the whole
    // process group rather than leaving one holding the port.
    try {
        process.kill(-server.pid, 'SIGTERM');
    }
    catch {
        server.kill('SIGTERM');
    }
}

/**
 * The document is hand-paginated onto fixed-height sheets, so content that
 * grows past a page is clipped rather than reflowed. Measure every column and
 * shout if anything overflows.
 */
async function reportOverflow(page: Page): Promise<boolean> {
    const columns = await page.evaluate(() => {
        const results: { page: number; column: string; remainingPx: number }[] = [];

        document.querySelectorAll('.resume-page').forEach((sheet, index) => {
            (['sidebar', 'main'] as const).forEach((column) => {
                const element = sheet.querySelector<HTMLElement>(`.resume-page__${column}`);

                if (!element) {
                    return;
                }

                const box = element.getBoundingClientRect();
                const contentBottom = Array.from(element.children).reduce(
                    (bottom, child) => Math.max(bottom, child.getBoundingClientRect().bottom),
                    box.top,
                );

                results.push({ page: index + 1, column, remainingPx: box.bottom - contentBottom });
            });
        });

        return results;
    });

    let hasOverflow = false;

    for (const { page: pageNumber, column, remainingPx } of columns) {
        const remainingPt = remainingPx / PT_TO_PX;

        if (remainingPt < 0) {
            hasOverflow = true;
            console.warn(`  ! page ${pageNumber} ${column}: overflows by ${Math.abs(remainingPt).toFixed(1)}pt — content is clipped`);
        }
        else {
            console.log(`    page ${pageNumber} ${column}: ${remainingPt.toFixed(1)}pt of slack`);
        }
    }

    return hasOverflow;
}

async function main(): Promise<void> {
    const targetUrl = process.env.RESUME_PDF_URL;
    let server: ChildProcess | null = null;

    try {
        if (!targetUrl) {
            server = await startDevServer();
        }

        const url = targetUrl ?? `${SERVER_URL}/resume`;
        const browser = await chromium.launch();

        try {
            const page = await browser.newPage();

            const response = await page.goto(url, { waitUntil: 'networkidle' });

            // page.goto() resolves for 4xx/5xx too, so a mistyped
            // RESUME_PDF_URL would otherwise render an error page straight over
            // the committed resume. Both guards below refuse to write instead.
            if (!response) {
                throw new Error(`No response from ${url}.`);
            }

            if (!response.ok()) {
                throw new Error(`${url} responded with HTTP ${response.status()}.`);
            }

            // Web fonts resolve asynchronously; printing before they land is
            // the usual cause of a subtly wrong PDF, so wait them out.
            await page.evaluate(() => document.fonts.ready);

            // Overflow has to be measured in print media — that is the layout
            // the PDF will actually use.
            await page.emulateMedia({ media: 'print' });

            const pageCount = await page.evaluate(() => document.querySelectorAll('.resume-page').length);

            if (pageCount === 0) {
                throw new Error(`${url} rendered no .resume-page elements — this does not look like the resume.`);
            }

            const hasOverflow = await reportOverflow(page);

            await mkdir(dirname(OUTPUT_PATH), { recursive: true });

            await page.pdf({
                path: OUTPUT_PATH,
                format: 'A4',
                printBackground: true,
                preferCSSPageSize: true,
                margin: { top: 0, right: 0, bottom: 0, left: 0 },
            });

            console.log(`Wrote ${OUTPUT_PATH}`);
            console.log(`Pages: ${pageCount}`);

            if (hasOverflow) {
                console.error('Resume content is clipping. Adjust the page assignment in pages/resume.vue.');
                process.exitCode = 1;
            }
        }
        finally {
            await browser.close();
        }
    }
    finally {
        stopServer(server);
    }
}

try {
    await main();
}
catch (error) {
    console.error(error instanceof Error ? error.message : error);
    console.error(`Refusing to write ${OUTPUT_PATH}; it is unchanged.`);
    process.exitCode = 1;
}
