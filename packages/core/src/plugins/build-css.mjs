import { execSync } from "node:child_process";

/**
 * Compiles a Tailwind entry stylesheet to a CSS file.
 *
 * @param {{ input: string, output: string }} options
 */
export default function buildCss({ input, output } = {}) {
    return async function buildCss() {
        execSync(`npx tailwindcss -i "${input}" -o "${output}" --minify`, {
            stdio: "inherit",
        });
    };
}
