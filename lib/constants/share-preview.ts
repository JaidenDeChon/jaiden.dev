/**
 * Every share image this site points at — its own and the ones served by my
 * other projects — is exported at the Open Graph standard of 1200 × 630
 * (1.91:1). X crops that to 2:1, which costs 15px off the top and bottom and
 * nothing that matters as long as the artwork keeps its edges clear.
 *
 * Declaring the size in the meta tags lets crawlers lay out the large card
 * before they've finished fetching the image. It is a promise about the files
 * themselves: an image that isn't this size will be mis-sized on first render
 * until the crawler fetches it, so re-export rather than special-casing here.
 */
export const SHARE_IMAGE_WIDTH = 1200;
export const SHARE_IMAGE_HEIGHT = 630;
