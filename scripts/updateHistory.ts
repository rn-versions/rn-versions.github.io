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
import semver from "semver";

import { promises as fs } from "fs";
import { JSDOM } from "jsdom";

import { packages } from "../src/PackageDescription";

/** Representation of History File JSON */
type HistoryFile = {
  [packageName: string]: Array<{
    date: string;
    versions: Record<string, number>;
  }>;
};

/** Minimum number of downloads for a version to be recored */
const minDownloadThreshold = 10;

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
  const packageCounts: Record<string, Record<string, number>> = {};

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
      packageCounts[packageName] = extractDownloadCounts(pageDom);
    } catch (ex) {
      console.error(chalk.red("Failed to extract version counts"));
      console.error(ex);
      process.exit(1);
    }
  }

  await recordVersionCounts(packageCounts);
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
 * Attempt to extract package version download counts from the page, throwing
 * if it cannot
 */
function extractDownloadCounts(dom: JSDOM): Record<string, number> {
  const { document } = dom.window;

  const versionPanelLinks = [
    ...(document
      .getElementById("tabpanel-versions")
      ?.getElementsByTagName("a") || []),
  ];

  if (versionPanelLinks.length === 0) {
    throw new Error("Page structure has changed (cannot find versions tab)");
  }

  const downloadsCounts: Record<string, number> = {};

  for (const link of versionPanelLinks) {
    const version = semver.valid(link.text);
    if (version) {
      const countElement = link.parentNode!.querySelector(".downloads");
      if (!countElement) {
        throw new Error("Page structure has changed (no count found)");
      }

      const cleanedText = countElement.textContent!.replace(/[^\d]/g, "");
      const count = parseInt(cleanedText, 10);
      if (count > minDownloadThreshold) {
        downloadsCounts[version] = count;
      }
    }
  }

  if (Object.keys(downloadsCounts).length === 0) {
    throw new Error("Page structure has changed (no versions found)");
  }

  return downloadsCounts;
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
 * Record download counts into history
 */
async function recordVersionCounts(
  packageToDownloadCounts: Record<string, Record<string, number>>
) {
  const fullHistory: HistoryFile = require(fullHistoryPath());

  for (const [pkg, counts] of Object.entries(packageToDownloadCounts)) {
    fullHistory[pkg] ||= [];
    fullHistory[pkg].unshift({
      date: scriptRunTimestamp.toISOString(),
      versions: counts,
    });

    const timedHistoryPath = historyTimestampPath(`${pkg},json`);
    await fs.mkdir(path.dirname(timedHistoryPath), { recursive: true });
    await fs.writeFile(timedHistoryPath, JSON.stringify(counts, null, 2));
  }

  await fs.writeFile(fullHistoryPath(), JSON.stringify(fullHistory, null, 2));
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
  return historyPath(scriptRunTimestamp.toDateString(), ...subpaths);
}

/**
 * Returns a path to the fully recorded history
 */
function fullHistoryPath() {
  return historyPath("full_download_history.json");
}
