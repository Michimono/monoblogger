import { execSync } from "child_process";

export default function buildCss(input, output) {
    execSync(`npx tailwindcss -i ${input} -o ${output} --minify`, {
        stdio: "inherit",
    });
}
