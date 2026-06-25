import {
    build,
    createXml,
    appendInput,
    inlineViews,
    compileTailwind,
    inlineStylesheet,
} from "@monoblogger/core";

await build([
    createXml({ output: "dist/index.xml" }),
    appendInput({ input: "src/index.html", output: "dist/index.xml" }),
    compileTailwind({ input: "src/input.css", output: "dist/output.css" }),
    inlineStylesheet({ stylesheet: "dist/output.css", output: "dist/index.xml" }),
    inlineViews({ input: "dist/index.xml" }),
]);
