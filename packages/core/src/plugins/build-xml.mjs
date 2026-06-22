import fs from "node:fs";
import path from "node:path";

const XML_DECLARATION = '<?xml version="1.0" encoding="UTF-8"?>\n';

// View tags look like `<m-NAME>` where NAME is a dot-separated path resolved
// against the views directory:
//   <m-footer />            -> views/footer.html
//   <m-layouts.footer />    -> views/layouts/footer.html
//   <m-footer></m-footer>   -> same as self-closing; inner content is discarded
//
// A fresh RegExp is returned on every call because the resolver recurses, and
// reusing a single global regex across nested String.replace() calls corrupts
// its lastIndex.
function viewTagPattern() {
    return /<m-([\w.-]+)(?:\s[^>]*?)?\s*(?:\/>|>[\s\S]*?<\/m-\1\s*>)/g;
}

function resolveViewPath(viewsDir, name) {
    const relative = name.split(".").join(path.sep) + ".html";
    return path.join(viewsDir, relative);
}

function expandViews(html, viewsDir, stack = []) {
    return html.replace(viewTagPattern(), (_match, name) => {
        const filePath = resolveViewPath(viewsDir, name);

        if (!fs.existsSync(filePath)) {
            throw new Error(
                `build-xml: could not resolve <m-${name} /> (looked for ${path.relative(process.cwd(), filePath)})`
            );
        }

        if (stack.includes(filePath)) {
            const cycle = [...stack, filePath]
                .map((f) => path.basename(f))
                .join(" -> ");
            throw new Error(`build-xml: circular view include detected: ${cycle}`);
        }

        const content = fs.readFileSync(filePath, "utf8");
        return expandViews(content, viewsDir, [...stack, filePath]);
    });
}

/**
 * Assembles the entry HTML (resolving `<m-*>` view tags) into a single XML
 * file. Views resolve against `views` (defaults to a `views/` folder next to
 * the entry file).
 *
 * @param {{ input: string, output: string, views?: string }} options
 */
export default function buildXml({ input, output, views } = {}) {
    return async function buildXml() {
        const viewsDir = views ?? path.join(path.dirname(input), "views");

        let xml = fs.readFileSync(input, "utf8");
        xml = expandViews(xml, viewsDir);

        xml = xml.trimStart();
        if (!xml.startsWith("<?xml")) {
            xml = XML_DECLARATION + xml;
        }

        fs.mkdirSync(path.dirname(output), { recursive: true });
        fs.writeFileSync(output, xml);
    };
}
