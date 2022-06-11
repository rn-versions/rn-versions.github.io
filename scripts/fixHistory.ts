import async from "async";
import chalk from "chalk";
import path from "path";
import globby from "globby";
import ora from "ora";

import { promises as fs } from "fs";
import { JSDOM } from "jsdom";

import extractDownloadCounts from "./extractDownloadCounts";

/**
 * Main function
 */
(async () => {
  process.chdir(path.join(__dirname, "..", "history"));
  const htmlFiles = await globby("**/*.html");

  let numFixed = 0;
  const baseString = "Extracting versions";
  const spinner = ora(baseString).start();

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  await async.eachLimit(htmlFiles, 4, async (file) => {
    const content = await fs.readFile(file);
    const jsdom = new JSDOM(content);
    const downloadCounts = extractDownloadCounts(jsdom);

    const jsonFilePath = file.replace(".html", ".json");
    await fs.writeFile(jsonFilePath, JSON.stringify(downloadCounts, null, 2));

    numFixed++;
    spinner.text = `${baseString} (${numFixed}/${htmlFiles.length})`;
  });

  spinner.succeed();
})();
