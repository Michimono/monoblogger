import buildXml from "./plugins/build-xml.mjs";
import buildCss from "./plugins/build-css.mjs";
import inlineVars from "./plugins/inline-vars.mjs";
import inlineCss from "./plugins/inline-css.mjs";

export async function build() {
    const steps = [
        () => buildXml("src/index.html", "dist/index.xml"),
        () => buildCss("src/input.css", "dist/output.css"),
        () => inlineVars("dist/index.xml", "src/data.json"),
        () => inlineCss("dist/index.xml", "dist/output.css"),
    ];

    for (const run of steps) {
        await run();
    }
}
