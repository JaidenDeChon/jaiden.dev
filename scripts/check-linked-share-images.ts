/**
 * Verifies that every share image this site links to another of my sites is
 * still being served from the URL we point at.
 *
 * Projects that publish their own share image are linked rather than copied
 * (see `lib/constants/projects/projects-list.ts`), so restyling one updates
 * this site with nothing to re-sync. The cost is that a *rename* on the far
 * side breaks the link silently: lucy.vet did exactly that, replacing
 * social-thumbnail.png with social-thumbnail-v2.png, and nothing here would
 * have noticed until someone saw a broken card.
 *
 *     bun run check:share-images
 *
 * It runs as part of the Netlify build, so a rename fails the deploy instead
 * of shipping a hole in the projects grid and a dead og:image.
 *
 * A 200 is not enough on its own. Netlify and friends answer an unknown path
 * with the SPA fallback — 200, and a page of HTML — so a renamed image would
 * sail through a plain status check. The response has to actually be an image.
 *
 * Only a definite answer fails the build. A host that is down, refusing us, or
 * unreachable is reported and shrugged off: that is someone else's outage, and
 * failing this deploy would not fix it. The distinction is the whole point —
 * "renamed" is permanent and actionable, "unreachable" is neither.
 */
import process from 'node:process';
import { PROJECTS_LIST } from '~/lib/constants/projects/projects-list';
import { BLOG_POST_LIST } from '~/lib/constants/blog-posts/blog-post-list';

const REQUEST_TIMEOUT_MS = 15_000;

type Outcome =
    | { status: 'ok'; contentType: string }
    | { status: 'broken'; detail: string }
    | { status: 'unknown'; detail: string };

interface Result {
    url: string;
    outcome: Outcome;
}

/** Every absolute image URL the site links, deduped, in the order declared. */
export function linkedImageUrls(): string[] {
    const images = [...PROJECTS_LIST, ...BLOG_POST_LIST]
        .map(entry => entry.image)
        .filter((image): image is string => Boolean(image))
        .filter(image => /^https?:\/\//.test(image));

    return [...new Set(images)];
}

async function request(url: string, method: 'HEAD' | 'GET'): Promise<Response> {
    return fetch(url, {
        method,
        redirect: 'follow',
        headers: method === 'GET' ? { range: 'bytes=0-0' } : undefined,
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
}

/**
 * Asks whether `url` still serves an image.
 *
 * Exported so the behaviour can be exercised against a local server; the
 * classification, not the network, is the part worth testing.
 */
export async function checkUrl(url: string): Promise<Outcome> {
    let response: Response;

    try {
        response = await request(url, 'HEAD');

        // Not every host implements HEAD. Ask for a single byte instead.
        if (response.status === 405 || response.status === 501) {
            response = await request(url, 'GET');
        }
    }
    catch (error) {
        // DNS failure, refused connection, TLS problem, timeout: all of them
        // mean we never got an answer, not that the image is gone.
        return { status: 'unknown', detail: error instanceof Error ? error.message : String(error) };
    }

    if (response.status === 404 || response.status === 410) {
        return { status: 'broken', detail: `HTTP ${response.status} — nothing is served here any more` };
    }

    if (!response.ok) {
        return { status: 'unknown', detail: `HTTP ${response.status}` };
    }

    const contentType = response.headers.get('content-type') ?? '';

    if (!contentType.startsWith('image/')) {
        return {
            status: 'broken',
            detail: `HTTP ${response.status} but served ${contentType || 'no content-type'} — `
                + 'likely a not-found page answering in the image\'s place',
        };
    }

    return { status: 'ok', contentType };
}

async function main(): Promise<void> {
    const urls = linkedImageUrls();

    if (urls.length === 0) {
        console.log('No linked share images to check.');
        return;
    }

    console.log(`Checking ${urls.length} linked share image${urls.length === 1 ? '' : 's'}...\n`);

    const results: Result[] = await Promise.all(
        urls.map(async url => ({ url, outcome: await checkUrl(url) })),
    );

    for (const { url, outcome } of results) {
        const mark = outcome.status === 'ok' ? 'ok  ' : outcome.status === 'broken' ? 'GONE' : '??  ';
        const note = outcome.status === 'ok' ? outcome.contentType : outcome.detail;
        console.log(`  ${mark}  ${url}\n        ${note}`);
    }

    const broken = results.filter(result => result.outcome.status === 'broken');
    const unknown = results.filter(result => result.outcome.status === 'unknown');

    if (unknown.length > 0) {
        console.log(`\n${unknown.length} could not be reached. Not failing on that — an unreachable `
            + 'host says nothing about whether the image moved, only that nobody could ask.');
    }

    if (broken.length > 0) {
        console.error(`\n${broken.length} linked share image${broken.length === 1 ? ' is' : 's are'} `
            + 'no longer served at the URL we point at.');
        console.error('Find where it moved to in that project\'s repo and update `image` in '
            + 'lib/constants/projects/projects-list.ts (and re-export the resume thumbnail from '
            + 'the new art, if the project has one).');
        process.exitCode = 1;
        return;
    }

    const verified = results.length - unknown.length;

    // Don't claim more than was actually established: every check coming back
    // inconclusive is not the same as every image being fine.
    console.log(verified === results.length
        ? '\nEvery linked share image is still there.'
        : `\n${verified} of ${results.length} confirmed present; the rest went unanswered.`);
}

if (import.meta.main) {
    await main();
}
