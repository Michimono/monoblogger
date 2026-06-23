import fs from "node:fs";

/**
 * Inlines one or more stylesheets into the template by appending a <b:skin>
 * block just before </head>. Source stylesheet files are removed after inlining.
 *
 * @param {{ stylesheet: string | string[], output: string }} options
 */
export default function inlineStylesheet({ stylesheet, output }) {
    return async function inlineStylesheet() {
        const sources = Array.isArray(stylesheet) ? stylesheet : [stylesheet];

        if (sources.length === 0) {
            throw new Error(
                'inlineStylesheet: "stylesheet" must be a path or a non-empty array of paths'
            );
        }

        if (!output) {
            throw new Error('inlineStylesheet: "output" is required');
        }

        let content = fs.readFileSync(output, "utf8");
        const styles = sources
            .map((path) => fs.readFileSync(path, "utf8"))
            .join("\n");

        const headClose = /<\/head>/i;
        if (!headClose.test(content)) {
            throw new Error(`inlineStylesheet: no </head> found in ${output}`);
        }

        const block = `<b:skin><![CDATA[\n${styles}\n]]></b:skin>`;
        content = content.replace(headClose, `${block}\n</head>`);

        fs.writeFileSync(output, content);

        for (const path of sources) {
            fs.unlinkSync(path);
        }
    };
}
