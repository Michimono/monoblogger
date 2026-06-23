const green = (text) => `\x1b[32m${text}\x1b[0m`;
const red = (text) => `\x1b[31m${text}\x1b[0m`;

const LINE_PREFIX = "              ";

/**
 * Runs build steps in order. Logs each step when it finishes — green on
 * success, red on failure. A failed step does not stop later steps.
 *
 * @param {Array<() => Promise<void> | void>} steps
 */
export async function build(steps) {

    for (const step of steps) {
        const start = performance.now();

        try {
            await step();
            const time = `${Math.round(performance.now() - start)}ms`.padStart(7);
            console.log(green(`  ✓  ${time}  ${step.name}`));
        } catch (error) {
            const time = `${Math.round(performance.now() - start)}ms`.padStart(7);
            const message = error instanceof Error ? error.message : String(error);

            console.log(red(`  ✗  ${time}  ${step.name}`));
            console.log(red(`${LINE_PREFIX}${message}`));
        }
    }
}
