#!/usr/bin/env node

import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";
import changelog from "../src/changelog.js";
// 引入測試函數
import runTests from '../test/changelog.test.js';
// 引入伺服器模組
import { start } from "../server.js";


const argv = yargs(hideBin(process.argv))
  .command("init", "Create a new, empty changelog", () => {
    changelog.initChangelog();
  })
  .command('start', 'Start the JSON server', (yargs) => {
    return yargs.option("port", {
      alias: "p",
      describe: "Port to run the server on",
      default: 8787, 
      type: "number",
    });
  }, (argv) => {
    const port = argv.port;
    start(port); 
  })
  .command("add", "Adds a new line to the changelog", (yargs) => {
    return yargs.option("m", {
      alias: "message",
      describe: "The message to add",
      demandOption: "The message is required",
      type: "string",
    });
  }, (argv) => {
    const message = argv.message;
    addEntry(message);
  })
  .command("release", "Marks the current changelog as released", () => {
    releaseChangelog();
  })
  .command("show", "Show the last or a specific version changelog", (yargs) => {
    return yargs.option("v", {
      alias: "ver",
      describe: "Specific version",
      type: "string",
    });
  }, (argv) => {
    const version = argv.version;
    changelog.showChangelog(version);
  })
  .command("list", "List all versions in the changelog", () => {
    listVersions();
  })
  .command("add-version", "Adds a new version to the changelog", (yargs) => {
    return yargs.option("v", {
      alias: "ver",
      describe: "The version number to add",
      demandOption: "The version number is required",
      type: "string",
    })
      .option("d", {
        alias: "description",
        describe: "Description for the version",
        demandOption: "The description is required",
        type: "string",
      });
  }, (argv) => {
    const version = argv.v; // 這裡使用 argv.v
    const description = argv.description;
    changelog.addVersion(version, description);
  })
  .command("test", "Run the tests for changelog", () => {
    // 執行測試
    runTests();
  })
  .demandCommand(1, "You need at least one command before moving on")
  .help()
  .argv;
