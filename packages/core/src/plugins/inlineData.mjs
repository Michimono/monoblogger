import fs from "node:fs";
import path from "node:path";

/**
 * Replaces {{key.path}} placeholders with values from `src/data.json`.
 *
 * @param {{ input: string }} options
 */
export default function inlineData({ input }) {
    return async () => {
        const dataPath = path.join(process.cwd(), "src", "data.json");
        const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));
        let content = fs.readFileSync(input, "utf8");

        content = content.replace(/\{\{(.+?)\}\}/g, (match, key) => {
            const value = key
                .trim()
                .split(".")
                .reduce((obj, k) => obj?.[k], data);
            if (value === undefined) {
                console.warn(`  [inlineData] missing key: ${key.trim()}`);
                return match;
            }
            return value;
        });

        fs.writeFileSync(input, content);
    };
}
