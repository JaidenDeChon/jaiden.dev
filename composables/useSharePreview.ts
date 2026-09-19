import { toValue, type MaybeRefOrGetter } from 'vue';
import { SHARE_IMAGE_HEIGHT, SHARE_IMAGE_WIDTH } from '~/lib/constants/share-preview';

export interface SharePreviewOptions {
    /**
     * Title used for the document `<title>` and, more importantly, the social
     * share caption (Open Graph / Twitter). Every page should provide its own
     * so shared links don't all read as the generic site title.
     */
    title: MaybeRefOrGetter<string>;
    /**
     * Description shown beneath the title in the share caption. When omitted,
     * the site-wide default configured in `app.vue` is left in place.
     */
    description?: MaybeRefOrGetter<string | undefined>;
    /**
     * Page-specific share image, either as a site-relative path (e.g.
     * `/img/share-preview.png`) or as an absolute URL when the project
     * publishes its own share image (e.g. `https://lucy.vet/social-thumbnail.png`).
     * When provided it overrides the site-wide default share image for this
     * page; when omitted the default image from `app.vue` is kept untouched.
     */
    image?: MaybeRefOrGetter<string | undefined>;
    /**
     * Alt text for the share image. Defaults to the page title.
     */
    imageAlt?: MaybeRefOrGetter<string | undefined>;
}

const IMAGE_MIME_TYPES: Record<string, string> = {
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    gif: 'image/gif',
    webp: 'image/webp',
    svg: 'image/svg+xml',
};

function inferImageType(imagePath: string): string | undefined {
    // The path may be site-relative or an absolute URL pointing at another of
    // my sites, so drop any query string or fragment before reading the
    // extension off the end.
    const extension = imagePath.split(/[?#]/)[0].split('.').pop()?.toLowerCase();
    return extension ? IMAGE_MIME_TYPES[extension] : undefined;
}

/**
 * Wires up the Open Graph / Twitter share preview for a page.
 *
 * - Always sets the title fields, so each page has its own share-preview title.
 * - Only sets image fields when an `image` is given, which lets pages that
 *   don't need a bespoke image inherit the site-wide default from `app.vue`.
 *
 * Image URLs are resolved to absolute URLs against the serving origin because
 * social crawlers don't run client-side JS and require absolute image URLs
 * (this keeps things working on production and Netlify deploy previews alike).
 */
export function useSharePreview(options: SharePreviewOptions): void {
    const requestUrl = useRequestURL();

    const title = toValue(options.title);
    const description = toValue(options.description);
    const image = toValue(options.image);

    const meta: Parameters<typeof useSeoMeta>[0] = {
        title,
        ogTitle: title,
        twitterTitle: title,
    };

    if (description) {
        meta.description = description;
        meta.ogDescription = description;
        meta.twitterDescription = description;
    }

    if (image) {
        const absoluteImage = new URL(image, requestUrl.origin).toString();
        const imageAlt = toValue(options.imageAlt) ?? title;

        meta.ogImage = absoluteImage;
        meta.ogImageType = inferImageType(image);
        // Restated rather than inherited from the site-wide default, so the
        // hint always describes the image this page actually points at.
        meta.ogImageWidth = SHARE_IMAGE_WIDTH;
        meta.ogImageHeight = SHARE_IMAGE_HEIGHT;
        meta.ogImageAlt = imageAlt;
        meta.twitterImage = absoluteImage;
        meta.twitterImageAlt = imageAlt;
    }

    useSeoMeta(meta);
}
