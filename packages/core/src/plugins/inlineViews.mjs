import fs from "node:fs";
import path from "node:path";

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
                `inlineViews: could not resolve <m-${name} /> (looked for ${path.relative(process.cwd(), filePath)})`
            );
        }

        if (stack.includes(filePath)) {
            const cycle = [...stack, filePath]
                .map((f) => path.basename(f))
                .join(" -> ");
            throw new Error(`inlineViews: circular view include detected: ${cycle}`);
        }

        const content = fs.readFileSync(filePath, "utf8");
        return expandViews(content, viewsDir, [...stack, filePath]);
    });
}

/**
 * Replaces `<m-*>` view tags with HTML partials from `src/views/`.
 *
 * @param {{ input: string }} options
 */
export default function inlineViews({ input }) {
    return async () => {
        const views = path.join(process.cwd(), "src", "views");

        let content = fs.readFileSync(input, "utf8");
        content = expandViews(content, views);

        fs.writeFileSync(input, content);
    };
}
