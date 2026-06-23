import fs from "node:fs";
import path from "node:path";

const XML_PROLOG = '<?xml version="1.0" encoding="UTF-8"?>\n';

/** @param {{ output: string }} options */
export default function createXml({ output }) {
    return async function createXml() {
        fs.mkdirSync(path.dirname(output), { recursive: true });
        fs.writeFileSync(output, XML_PROLOG);
    };
}
