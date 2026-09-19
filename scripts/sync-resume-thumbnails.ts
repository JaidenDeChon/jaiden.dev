/**
 * Re-cuts every resume thumbnail from its source art and re-records the
 * hashes.
 *
 *     bun run resume:thumbnails
 *
 * Run it after a project restyles its share card. The project cards pick that
 * up on their own, because they link the live image; the resume can't, because
 * it prints to a PDF and needs a local copy. This is what keeps the two in
 * step, and what `bun run check:share-images` tells you to run when they drift.
 *
 * Thumbnails are a plain resize to a fixed width — no crop. Each keeps the
 * proportions of the art it came from, which is what the resume's stylesheet
 * expects (see `assets/css/resume.css`).
 *
 * Changing a thumbnail means the PDF is stale too, so follow this with
 * `bun run resume:pdf`. It says so when it finishes.
 */
import { resolve } from 'node:path';
import process from 'node:process';
import sharp from 'sharp';
import {
    type Manifest,
    THUMBNAIL_DIR,
    THUMBNAIL_WIDTH,
    loadSource,
    readManifest,
    sha256,
    writeManifest,
} from './share-image-sources';

async function main(): Promise<void> {
    const manifest = await readManifest();
    const entries = Object.entries(manifest);

    console.log(`Re-cutting ${entries.length} resume thumbnail${entries.length === 1 ? '' : 's'}...\n`);

    const updated: Manifest = {};
    let changed = 0;
    let failed = 0;

    for (const [name, entry] of entries) {
        const fetched = await loadSource(entry.source);

        if (fetched.status !== 'ok') {
            console.error(`  !!  ${name}\n        ${entry.source}\n        ${fetched.detail}`);
            // Keep the recorded hash: we learned nothing that would justify
            // replacing it, and overwriting would quietly forget the drift.
            updated[name] = entry;
            failed++;
            continue;
        }

        const hash = sha256(fetched.bytes);

        await sharp(fetched.bytes)
            .resize({ width: THUMBNAIL_WIDTH })
            .png({ compressionLevel: 9 })
            .toFile(resolve(THUMBNAIL_DIR, name));

        const { width, height } = await sharp(resolve(THUMBNAIL_DIR, name)).metadata();
        const moved = hash !== entry.sha256;

        if (moved) changed++;

        console.log(`  ${moved ? 'new ' : 'same'}  ${name}  ${width}x${height}\n        ${entry.source}`);
        updated[name] = { source: entry.source, sha256: hash };
    }

    await writeManifest(updated);

    if (failed > 0) {
        console.error(`\n${failed} source${failed === 1 ? '' : 's'} could not be read; `
            + `${failed === 1 ? 'that thumbnail is' : 'those thumbnails are'} unchanged.`);
        process.exitCode = 1;
    }

    if (changed > 0) {
        console.log(`\n${changed} thumbnail${changed === 1 ? '' : 's'} came from new art. `
            + 'Run `bun run resume:pdf` so the PDF carries it too.');
    }
    else if (failed === 0) {
        console.log('\nEvery thumbnail was already cut from the current art.');
    }
}

if (import.meta.main) {
    await main();
}
