import fs from "fs";
import path from "path";

export default function buildXml(src, dist) {
    let xml = fs.readFileSync(src, "utf8");

    xml = xml.replace(/<mono:include\s+file="(.+?)"\s*\/>/g, (_, file) =>
        fs.readFileSync(path.join(path.dirname(src), file), "utf8")
    );

    fs.mkdirSync(path.dirname(dist), { recursive: true });
    fs.writeFileSync(dist, xml);
}
