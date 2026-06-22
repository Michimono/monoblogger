import { build, buildXml, buildCss, inlineVars, inlineCss } from "@monoblogger/core";

await build([
    buildXml({ input: "src/index.html", output: "dist/index.xml" }),
    buildCss({ input: "src/input.css", output: "dist/output.css" }),
    inlineVars({ file: "dist/index.xml", data: "src/data.json" }),
    inlineCss({ file: "dist/index.xml", css: "dist/output.css" }),
]);
