import { cubicEasingFunction } from './cubic-easing-function';

/**
 * Smoothly scrolls the page to bring the specified element into view over a given duration.
 * An optional offset can be applied to adjust the final scroll position above or below the element. This is useful for
 * compensating for the sticky header at the top of the page.
 *
 * @param {Element} element - The target element to scroll into view.
 * @param {number} [duration=900] - The duration of the scroll animation in milliseconds.
 * @param {number} [offset=-64] - Offset distance (in px) to adjust the final scroll position. Positive scrolls past the element.
 * @returns {void}
 */
export function smoothScrollIntoView(element: Element, duration: number = 900, offset: number = -64): void {
    const documentScrollHeight = document.body.scrollHeight;
    const startingY = window.scrollY;
    const elementY = startingY + element.getBoundingClientRect().top;

    const targetY = documentScrollHeight - elementY < window.innerHeight
        ? documentScrollHeight - window.innerHeight
        : elementY + offset;

    const difference = targetY - startingY;
    if (!difference) return;

    let start = 0;

    window.requestAnimationFrame(function step(timestamp: number) {
        if (!start) start = timestamp;

        const elapsedTime = timestamp - start;
        let percent = Math.min(elapsedTime / duration, 1);

        percent = cubicEasingFunction(percent);

        window.scrollTo(0, startingY + difference * percent);

        if (elapsedTime < duration) {
            window.requestAnimationFrame(step);
        }
    });
}
