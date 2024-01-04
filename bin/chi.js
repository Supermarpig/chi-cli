#!/usr/bin/env node

const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const changelog = require("../src/changelog");
// 引入測試函數
const runTests = require('../test/changelog.test');

const argv = yargs(hideBin(process.argv))
  .command("init", "Create a new, empty changelog", () => {
    changelog.initChangelog();
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
    changelog.addEntry(message);
  })
  .command("release", "Marks the current changelog as released", () => {
    changelog.releaseChangelog();
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
    changelog.listVersions();
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
