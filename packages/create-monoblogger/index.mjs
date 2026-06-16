#!/usr/bin/env node
import { init } from "@monoblogger/cli";

try {
    await init(process.argv[2]);
} catch (error) {
    console.error(`Error: ${error.message}`);
    process.exitCode = 1;
}
