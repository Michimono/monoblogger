import { execSync } from "node:child_process";

/** @param {{ input: string, output: string }} options */
export default function compileTailwind({ input, output }) {
    return async function compileTailwind() {
        execSync(`npx tailwindcss -i "${input}" -o "${output}" --minify`, {
            stdio: "pipe",
        });
    };
}
