import fs from "node:fs";

/**
 * Replaces {{key.path}} placeholders in a file with values from a JSON data
 * file. Supports nested keys like {{organization.name}}. Edits in place.
 *
 * @param {{ file: string, data: string }} options
 */
export default function inlineVars({ file, data } = {}) {
    return async function inlineVars() {
        const values = JSON.parse(fs.readFileSync(data, "utf8"));
        let xml = fs.readFileSync(file, "utf8");

        xml = xml.replace(/\{\{(.+?)\}\}/g, (match, key) => {
            const value = key
                .trim()
                .split(".")
                .reduce((obj, k) => obj?.[k], values);
            if (value === undefined) {
                console.warn(`  [inline-vars] missing key: ${key.trim()}`);
                return match;
            }
            return value;
        });

        fs.writeFileSync(file, xml);
    };
}
