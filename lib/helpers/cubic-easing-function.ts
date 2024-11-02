/**
 * Applies a cubic easing function to a given value `t`. Provides a smooth transition by easing in and out.
 * For `t` values between 0 and 0.5, it follows an "ease-in" cubic curve;
 * For `t` values between 0.5 and 1, it follows an "ease-out" cubic curve.
 *
 * @param   {number} t - A value between 0 and 1 representing the progress of the animation.
 * @returns {number} The eased value, also between 0 and 1.
 */
export function cubicEasingFunction(t: number): number {
    return t < 0.5
        ? 4 * t * t * t
        : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
}
