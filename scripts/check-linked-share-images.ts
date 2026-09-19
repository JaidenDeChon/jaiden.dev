/**
 * Checks that the share images this site leans on are still what it thinks
 * they are.
 *
 *     bun run check:share-images
 *
 * Two different things can go wrong, because the site uses those images two
 * different ways.
 *
 * Project cards link a project's share image live, so restyling one updates
 * the card and the og:image with nothing to re-sync. What that can't survive
 * is a *rename*: lucy.vet replaced social-thumbnail.png with
 * social-thumbnail-v2.png and nothing here would have noticed until someone
 * saw a broken card. So every linked URL is asked whether it still serves an
 * image.
 *
 * The resume can't link anything — it prints to a PDF — so it keeps its own
 * copy of each project's art under public/img/resume/. Those copies go stale
 * silently the other way round: the far side restyles its card, the card here
 * follows, and the resume quietly keeps showing last year's picture. So each
 * source is hashed and compared against what it was when the thumbnail was
 * cut. `bun run resume:thumbnails` re-cuts them and re-records the hashes.
 *
 * Both run during the Netlify build, and both fail it, because both are
 * definite and both have a one-command fix. A host that is down or unreachable
 * is neither, so it is reported and shrugged off: that is someone else's
 * outage, and failing this deploy would not fix it.
 */
import process from 'node:process';
import { type Fetched, loadSource, readManifest, sha256 } from './share-image-sources';
import { PROJECTS_LIST } from '~/lib/constants/projects/projects-list';
import { BLOG_POST_LIST } from '~/lib/constants/blog-posts/blog-post-list';

/** Every absolute image URL the site links, deduped, in the order declared. */
export function linkedImageUrls(): string[] {
    const images = [...PROJECTS_LIST, ...BLOG_POST_LIST]
        .map(entry => entry.image)
        .filter((image): image is string => Boolean(image))
        .filter(image => /^https?:\/\//.test(image));

    return [...new Set(images)];
}

interface Checked {
    label: string;
    source: string;
    fetched: Fetched;
    /** Set only for resume thumbnails, whose source art is pinned by hash. */
    drifted?: boolean;
}

function report(checked: Checked): void {
    const { fetched, label, source, drifted } = checked;

    const mark = fetched.status === 'broken'
        ? 'GONE'
        : fetched.status === 'unknown'
            ? '??  '
            : drifted
                ? 'OLD '
                : 'ok  ';

    const note = fetched.status === 'ok'
        ? drifted ? 'source art has changed since this was cut' : fetched.contentType
        : fetched.detail;

    console.log(`  ${mark}  ${label}\n        ${source}\n        ${note}`);
}

async function main(): Promise<void> {
    const urls = linkedImageUrls();
    const manifest = await readManifest();

    // One fetch per distinct source: most linked URLs are also the art a
    // resume thumbnail was cut from, and there is no reason to ask twice.
    const sources = [...new Set([...urls, ...Object.values(manifest).map(entry => entry.source)])];

    console.log(`Reading ${sources.length} share image source${sources.length === 1 ? '' : 's'}...\n`);

    const fetched = new Map<string, Fetched>(
        await Promise.all(
            sources.map(async source => [source, await loadSource(source)] as const),
        ),
    );

    const linked: Checked[] = urls.map(url => ({
        label: 'linked by a project card',
        source: url,
        fetched: fetched.get(url)!,
    }));

    const thumbnails: Checked[] = Object.entries(manifest).map(([name, entry]) => {
        const result = fetched.get(entry.source)!;

        return {
            label: `resume thumbnail ${name}`,
            source: entry.source,
            fetched: result,
            drifted: result.status === 'ok' && sha256(result.bytes) !== entry.sha256,
        };
    });

    console.log('Linked project card images\n');
    linked.forEach(report);
    console.log('\nResume thumbnail source art\n');
    thumbnails.forEach(report);

    const all = [...linked, ...thumbnails];
    const broken = all.filter(entry => entry.fetched.status === 'broken');
    const unknown = all.filter(entry => entry.fetched.status === 'unknown');
    const drifted = thumbnails.filter(entry => entry.drifted);

    if (unknown.length > 0) {
        console.log(`\n${unknown.length} could not be read. Not failing on that — an unreachable `
            + 'host says nothing about the art, only that nobody could ask.');
    }

    if (broken.length > 0) {
        console.error(`\n${broken.length} share image${broken.length === 1 ? ' is' : 's are'} `
            + 'no longer served where we look for it.');
        console.error('Find where it moved to in that project\'s repo, then update `image` in '
            + 'lib/constants/projects/projects-list.ts and `source` in '
            + 'lib/data/resume-thumbnail-sources.json.');
    }

    if (drifted.length > 0) {
        console.error(`\n${drifted.length} resume thumbnail${drifted.length === 1 ? ' was' : 's were'} `
            + 'cut from art that has since changed.');
        console.error('Run `bun run resume:thumbnails` to re-cut them, then `bun run resume:pdf`, '
            + 'and commit both.');
    }

    if (broken.length > 0 || drifted.length > 0) {
        process.exitCode = 1;
        return;
    }

    const verified = all.length - unknown.length;

    // Don't claim more than was actually established: every read coming back
    // inconclusive is not the same as every image being fine.
    console.log(verified === all.length
        ? '\nEvery share image is present and matches what the resume was cut from.'
        : `\n${verified} of ${all.length} confirmed; the rest went unanswered.`);
}

if (import.meta.main) {
    await main();
}
