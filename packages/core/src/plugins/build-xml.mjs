import fs from "fs";
import path from "path";

const XML_DECLARATION = '<?xml version="1.0" encoding="UTF-8"?>\n';

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

export default function buildXml(src, dist) {
    const viewsDir = path.join(path.dirname(src), "views");

    let xml = fs.readFileSync(src, "utf8");
    xml = expandViews(xml, viewsDir);

    xml = xml.trimStart();
    if (!xml.startsWith("<?xml")) {
        xml = XML_DECLARATION + xml;
    }

    fs.mkdirSync(path.dirname(dist), { recursive: true });
    fs.writeFileSync(dist, xml);
}
