/**
 * The art each resume thumbnail is cut from, and how to fetch and hash it.
 *
 * Project cards link a project's share image live, so restyling one updates
 * this site on its own. The resume can't do that — it prints to a PDF, so it
 * keeps its own copy under public/img/resume/. That copy is a derivative, not
 * the original, so it can't be compared against the source byte for byte.
 * Instead the manifest records the source's hash at the time the thumbnail was
 * cut, and a mismatch later means the art moved on without the thumbnail.
 *
 * Shared by the build-time check and by `bun run resume:thumbnails`, which
 * re-cuts every thumbnail and re-records the hashes.
 */
import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

/** Width every resume thumbnail is exported at; the height follows the art. */
export const THUMBNAIL_WIDTH = 440;

export const PROJECT_ROOT = resolve(import.meta.dirname, '..');
export const MANIFEST_PATH = resolve(PROJECT_ROOT, 'lib/data/resume-thumbnail-sources.json');
export const THUMBNAIL_DIR = resolve(PROJECT_ROOT, 'public/img/resume');

const REQUEST_TIMEOUT_MS = 20_000;

export interface ThumbnailSource {
    /** Absolute URL on the project's own site, or a path relative to the repo root. */
    source: string;
    /** sha256 of the source art the committed thumbnail was cut from. */
    sha256: string;
}

export type Manifest = Record<string, ThumbnailSource>;

export function isRemote(source: string): boolean {
    return /^https?:\/\//.test(source);
}

export async function readManifest(): Promise<Manifest> {
    return JSON.parse(await readFile(MANIFEST_PATH, 'utf8')) as Manifest;
}

export async function writeManifest(manifest: Manifest): Promise<void> {
    // Sorted so a re-record produces a diff of changed hashes, nothing else.
    const sorted = Object.fromEntries(
        Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)),
    );

    await writeFile(MANIFEST_PATH, `${JSON.stringify(sorted, null, 4)}\n`);
}

export function sha256(bytes: Uint8Array): string {
    return createHash('sha256').update(bytes).digest('hex');
}

export type Fetched =
    | { status: 'ok'; bytes: Uint8Array; contentType: string }
    | { status: 'broken'; detail: string }
    | { status: 'unknown'; detail: string };

/**
 * Reads a source's bytes, whether it lives on another of my sites or in this
 * repo.
 *
 * The three outcomes are deliberate and not interchangeable. `broken` means a
 * definite answer that the art is not there: something callers should act on.
 * `unknown` means nobody could ask — a host down, a refused connection — which
 * says nothing about the art and must never be treated as evidence.
 */
export async function loadSource(source: string): Promise<Fetched> {
    if (!isRemote(source)) {
        try {
            return {
                status: 'ok',
                bytes: new Uint8Array(await readFile(resolve(PROJECT_ROOT, source))),
                contentType: 'local file',
            };
        }
        catch (error) {
            return {
                status: 'broken',
                detail: error instanceof Error ? error.message : String(error),
            };
        }
    }

    let response: Response;

    try {
        response = await fetch(source, {
            redirect: 'follow',
            signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        });
    }
    catch (error) {
        return { status: 'unknown', detail: error instanceof Error ? error.message : String(error) };
    }

    if (response.status === 404 || response.status === 410) {
        return { status: 'broken', detail: `HTTP ${response.status} — nothing is served here any more` };
    }

    if (!response.ok) {
        return { status: 'unknown', detail: `HTTP ${response.status}` };
    }

    const contentType = response.headers.get('content-type') ?? '';

    // A static host answers an unknown path with its not-found page and a
    // cheerful 200, so the status alone would wave a renamed image through.
    if (!contentType.startsWith('image/')) {
        return {
            status: 'broken',
            detail: `HTTP ${response.status} but served ${contentType || 'no content-type'} — `
                + 'likely a not-found page answering in the image\'s place',
        };
    }

    try {
        return {
            status: 'ok',
            bytes: new Uint8Array(await response.arrayBuffer()),
            contentType,
        };
    }
    catch (error) {
        // Headers arrived, body didn't. Nothing was established either way.
        return { status: 'unknown', detail: error instanceof Error ? error.message : String(error) };
    }
}
