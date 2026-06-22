/**
 * Runs build steps in order. Each step is a no-arg async function — typically
 * produced by a plugin factory (e.g. `buildXml({ input, output })`), but any
 * `async () => {}` works, which is all a custom plugin needs to be.
 *
 * @param {Array<() => Promise<void> | void>} steps
 */
export async function build(steps) {
    for (const step of steps) {
        await step();
    }
}
