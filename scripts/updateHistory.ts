import axios from "axios";
import rateLimit, {
  RateLimitedAxiosInstance,
  rateLimitOptions as RateLimitOptions,
} from "axios-rate-limit";
import axiosRetry, {
  isNetworkOrIdempotentRequestError,
  IAxiosRetryConfig,
} from "axios-retry";
import chalk from "chalk";
import path from "path";
import pretty from "pretty";

import { promises as fs } from "fs";
import { JSDOM } from "jsdom";

import { packages } from "../src/PackageDescription";
import extractDownloadCounts from "./extractDownloadCounts";

/** Packages to record */
const packageNames = Object.keys(packages);

/** Timestamp of script start */
const scriptRunTimestamp = new Date();

/** Global HTTP Client **/
const axiosInstance = createAxiosInstance();

/**
 * Main function
 */
(async () => {
  for (const packageName of packageNames) {
    console.log(`Downloading npmjs page for ${packageName}...`);

    let pageHtml: string;
    try {
      pageHtml = await downloadPackagePage(packageName);
    } catch (ex) {
      console.error(chalk.red("Download failed"));
      console.error(ex);
      process.exit(1);
    }

    console.log("Parsing page...");
    const pageDom = new JSDOM(pageHtml, { runScripts: "dangerously" });

    console.log("Saving page...");
    await recordWebpage(pageDom, packageName);

    console.log("Extracting version counts...");
    try {
      await recordDownloadCounts(packageName, extractDownloadCounts(pageDom));
    } catch (ex) {
      console.error(chalk.red("Failed to extract version counts"));
      console.error(ex);
      process.exit(1);
    }
  }

  require("./generateAssets");
})();

/**
 * Creates rate-limited HTTP client to use for fetching pages from npmjs
 */
function createAxiosInstance(): RateLimitedAxiosInstance {
  const axiosRetryConfig: IAxiosRetryConfig = {
    retries: 10,
    // Expontential backoff if rate limited or network flakiness. Respect npmjs retry-after header.
    retryDelay: (retryCount, error) => {
      if (
        error.response?.status === 429 &&
        error.response.headers["retry-after"]
      ) {
        return parseInt(error.response.headers["retry-after"], 10) * 1000;
      }

      return axiosRetry.exponentialDelay(retryCount);
    },
    retryCondition: (error) =>
      isNetworkOrIdempotentRequestError(error) ||
      error.response?.status === 429,
  };

  const axiosRateLimitOptions: RateLimitOptions = {
    maxRequests: 2,
    perMilliseconds: 1000,
    maxRPS: 2,
  };

  const axiosClient = axios.create();
  axiosRetry(axiosClient, axiosRetryConfig);
  return rateLimit(axiosClient, axiosRateLimitOptions);
}

/**
 * Downloads the html for the versions page of the NPM package
 */
async function downloadPackagePage(packageName: string): Promise<string> {
  const page = await axiosInstance.get<string>(
    `https://www.npmjs.com/package/${packageName}?activeTab=versions`,
    {
      headers: {
        Accept: "text/html",
        "User-Agent": "React Native Version Tracker",
      },
    }
  );

  return page.data;
}

/**
 * Record the npmjs download page into recorded history
 */
async function recordWebpage(dom: JSDOM, packageName: string) {
  const filePath = historyTimestampPath(`${packageName}.html`);

  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, pretty(dom.serialize()));
}

/**
 * Record download counts into a file
 */
async function recordDownloadCounts(
  packageName: string,
  downloadCounts: Record<string, number>
) {
  const filename =
    scriptRunTimestamp.toISOString().replace(/:/g, "_") + ".json";

  const path = historyPath(packageName.replace("/", "_"), filename);
  await fs.writeFile(path, JSON.stringify(downloadCounts, null, 2));
}

/**
 * Returns a path to the root of recorded history
 */
function historyPath(...subpaths: string[]) {
  return path.join(__dirname, "..", "history", ...subpaths);
}

/**
 * Returns a path to the currently timestamped directory in recorded history
 */
function historyTimestampPath(...subpaths: string[]) {
  return historyPath(
    scriptRunTimestamp.toISOString().replace(/:/g, "_"),
    ...subpaths
  );
}
