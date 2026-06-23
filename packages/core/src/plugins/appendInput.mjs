import fs from "node:fs";

/** @param {{ input: string, output: string }} options */
export default function appendInput({ input, output }) {
    return async function appendInput() {
        const xml = fs.readFileSync(output, "utf8");
        const content = fs.readFileSync(input, "utf8").trimStart();

        fs.writeFileSync(output, xml + content);
    };
}
