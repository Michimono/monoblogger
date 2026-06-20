import fs from "fs";
import path from "path";

const XML_DECLARATION = '<?xml version="1.0" encoding="UTF-8"?>\n';

export default function buildXml(src, dist) {
    let xml = fs.readFileSync(src, "utf8");

    xml = xml.replace(/<mono:include\s+file="(.+?)"\s*\/>/g, (_, file) =>
        fs.readFileSync(path.join(path.dirname(src), file), "utf8")
    );

    xml = xml.trimStart();
    if (!xml.startsWith("<?xml")) {
        xml = XML_DECLARATION + xml;
    }

    fs.mkdirSync(path.dirname(dist), { recursive: true });
    fs.writeFileSync(dist, xml);
}