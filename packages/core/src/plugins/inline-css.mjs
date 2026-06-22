import fs from "node:fs";

// The starter marks the spot where compiled CSS should land with a
// self-closed <link href="__TAILWIND__" />. We target that exact link so other
// stylesheet links (e.g. web fonts) are left untouched.
const PLACEHOLDER = "__TAILWIND__";

/**
 * Inlines a compiled CSS file into a <b:skin> block in the target file,
 * replacing the `__TAILWIND__` link placeholder, then deletes the CSS file.
 *
 * @param {{ file: string, css: string }} options
 */
export default function inlineCss({ file, css } = {}) {
    return async function inlineCss() {
        let xml = fs.readFileSync(file, "utf8");
        const styles = fs.readFileSync(css, "utf8");

        const linkPattern = new RegExp(
            `<link[^>]*href=["']${PLACEHOLDER}["'][^>]*\\/?>`,
            "i"
        );

        if (!linkPattern.test(xml)) {
            throw new Error(
                `inline-css: no <link href="${PLACEHOLDER}" /> placeholder found in ${file}`
            );
        }

        xml = xml.replace(linkPattern, `<b:skin><![CDATA[\n${styles}\n]]></b:skin>`);

        fs.writeFileSync(file, xml);
        fs.unlinkSync(css);
    };
}
