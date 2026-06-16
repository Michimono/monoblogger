import fs from "fs";

/**
 * Replaces {{key.path}} placeholders with values from a JSON file.
 * Supports nested keys like {{organization.name}}.
 */
export default function inlineVars(dist, dataPath) {
    const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));
    let xml = fs.readFileSync(dist, "utf8");

    xml = xml.replace(/\{\{(.+?)\}\}/g, (match, key) => {
        const value = key.trim().split(".").reduce((obj, k) => obj?.[k], data);
        if (value === undefined) {
            console.warn(`  [inline-vars] missing key: ${key.trim()}`);
            return match;
        }
        return value;
    });

    fs.writeFileSync(dist, xml);
}
