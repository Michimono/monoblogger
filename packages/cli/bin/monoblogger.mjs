#!/usr/bin/env node
import { init } from "../index.mjs";

const [command, ...args] = process.argv.slice(2);

const USAGE = `Usage:
  monoblogger init <project-name>   Scaffold a new monoblogger project
`;

try {
    switch (command) {
        case "init":
            await init(args[0]);
            break;
        case undefined:
        case "help":
        case "--help":
        case "-h":
            console.log(USAGE);
            break;
        default:
            console.error(`Unknown command: ${command}\n`);
            console.error(USAGE);
            process.exitCode = 1;
    }
} catch (error) {
    console.error(`Error: ${error.message}`);
    process.exitCode = 1;
}
