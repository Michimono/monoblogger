import fs from "fs";

// The starter marks the spot where compiled CSS should land with a
// self-closed <link href="__TAILWIND__" />. We target that exact link so other
// stylesheet links (e.g. web fonts) are left untouched.
const PLACEHOLDER = "__TAILWIND__";

export default function inlineCss(dist, cssPath) {
    let xml = fs.readFileSync(dist, "utf8");
    const css = fs.readFileSync(cssPath, "utf8");

    const linkPattern = new RegExp(
        `<link[^>]*href=["']${PLACEHOLDER}["'][^>]*\\/?>`,
        "i"
    );

    if (!linkPattern.test(xml)) {
        throw new Error(
            `inline-css: no <link href="${PLACEHOLDER}" /> placeholder found in ${dist}`
        );
    }

    xml = xml.replace(linkPattern, `<b:skin><![CDATA[\n${css}\n]]></b:skin>`);

    fs.writeFileSync(dist, xml);
    fs.unlinkSync(cssPath);
}
