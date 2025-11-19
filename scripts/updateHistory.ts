import chalk from "chalk";
import path from "path";
import semver from "semver";

import { promises as fs } from "fs";

import createAxiosInstance from "./helper/createAxiosInstance.ts";
import { packages, type PackageIdentifier } from "../src/PackageDescription.ts";

type NpmApiStats = {
  package: string;
  downloads: Record<string, number>;
};

/** Packages to record */
const packageNames = Object.keys(packages) as PackageIdentifier[];

/** Timestamp of script start */
const scriptRunTimestamp = new Date();

/** Global HTTP Client **/
const axiosInstance = createAxiosInstance();

/**
 * Main function
 */
(async () => {
  for (const packageName of packageNames) {
    console.log(`Downloading npmjs stats for ${packageName}...`);

    const escapedPackageName = packageName.replace("/", "%2f");

    let statsJson: NpmApiStats;
    try {
      statsJson = await downloadVersionStats(escapedPackageName);
    } catch (ex) {
      console.error(chalk.red("Download failed"));
      console.error(ex);
      process.exit(1);
    }

    const filteredVersions = Object.fromEntries(
      Object.entries(statsJson.downloads).filter((version) =>
        semver.valid(version[0])
      )
    );

    console.log("Store version counts...");
    try {
      await recordDownloadCountsFromApi(packageName, filteredVersions);
    } catch (ex) {
      console.error(chalk.red("Failed to store version counts"));
      console.error(ex);
      process.exit(1);
    }
  }

  await import("./generateAssets.ts");
})();

/**
 * Downloads the version stats for the NPM package
 */
async function downloadVersionStats(packageName: string): Promise<NpmApiStats> {
  const page = await axiosInstance.get<NpmApiStats>(
    `https://api.npmjs.org/versions/${packageName}/last-week`,
    {
      headers: {
        Accept: "text/html",
      },
    }
  );

  return page.data;
}

/**
 * Record download counts into a file
 */
async function recordDownloadCountsFromApi(
  packageName: PackageIdentifier,
  downloadCountsFromApi: Record<string, number>
) {
  const filePath = timePointPath(packageName, ".json");
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(downloadCountsFromApi, null, 2));
}

/**
 * Returns a path to the root of recorded history
 */
function historyPath(...subpaths: string[]) {
  return path.join("history", ...subpaths);
}

/**
 * Returns a path to save a timestamped resource
 */
function timePointPath(packageName: PackageIdentifier, extension?: string) {
  const filename =
    scriptRunTimestamp.toISOString().replace(/:/g, "_") + (extension ?? "");

  return historyPath(packageName.replace("/", "_"), filename);
}
