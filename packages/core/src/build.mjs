/**
 * Runs build steps in order. Each step is a no-arg async function.
 *
 * @param {Array<() => Promise<void> | void>} steps
 */
export async function build(steps) {
    for (const step of steps) {
        await step();
    }
}
