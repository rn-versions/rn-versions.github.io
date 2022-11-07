import path from "path";
import semver from "semver";

import { promises as fs } from "fs";

import { PackageIdentifier, packages } from "../src/PackageDescription";
import createAxiosInstance from "./helper/createAxiosInstance";

type VersionIndex = string;

/** Representation of packed asset file */
type AssetHistoryFile = {
  epoch: number;
  versions: string[];
  points: AssetHistoryPoint[];
};
type AssetHistoryPoint = {
  date: number;
  versionCounts: Record<VersionIndex, number>;
};

/** Map of package version to an ISO timestamp of when it was published */
type PackagePublishTimes = Record<string, string>;

/** Maximum number of days to include */
const maxDaysOfHistory = 180;

/** Cutoff for how old a version can be before it is not included (needed to avoid bad data from npmjs)  */
const maxDaysPublishedAgo = 365;

/** Number of downloads needed before a version is included */
const minDownloadsRequired = 10;

/** Global HTTP Client **/
const axiosInstance = createAxiosInstance();

(async () => {
  try {
    await generateWebpageAssets();
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();

/**
 * Generate reduced JSON to power the webpage graph
 */
async function generateWebpageAssets() {
  await Promise.all(
    Object.keys(packages).map(async (packageName) => {
      const counts = await getDownloadCounts(packageName as PackageIdentifier);
      if (counts.length === 0) {
        return;
      }

      const publishTimes = await fetchPublishTimes(packageName);
      const latestDate = counts[0].date;
      const earliestAllowableDate =
        Date.parse(counts[0].date) - maxDaysOfHistory * 24 * 60 * 60 * 1000;

      const includedPoints = counts
        .filter((p) => Date.parse(p.date) >= earliestAllowableDate)
        .map((p) => ({
          versionCounts: p.downloadsCounts,
          date: Date.parse(p.date),
        }))
        .sort((a, b) => a.date - b.date)
        .map((p) =>
          filterToAllowedVersions(
            p,
            packages[packageName as PackageIdentifier].versionFilter,
            publishTimes
          )
        )
        .map((p) => {
          const filteredCounts: Record<string, number> = {};
          for (const [version, count] of Object.entries(p.versionCounts)) {
            if (count >= minDownloadsRequired) {
              filteredCounts[version] = count;
            }
          }

          return { date: p.date, versionCounts: filteredCounts };
        })
        .filter((p) => Object.keys(p.versionCounts).length > 0);

      const allVersions = new Set<string>();
      includedPoints.forEach((p) =>
        Object.keys(p.versionCounts).forEach((v) => allVersions.add(v))
      );

      const versions = [...allVersions].sort(compareVersion);
      const keyedPoints: AssetHistoryPoint[] = [];

      const epoch = includedPoints[0].date;

      for (const point of includedPoints) {
        const newPoint: AssetHistoryPoint = {
          date: Math.round(point.date - epoch) / 1000,
          versionCounts: {},
        };
        for (const [version, count] of Object.entries(point.versionCounts)) {
          const key = versions.indexOf(version.toString());
          newPoint.versionCounts[key] = count;
        }
        keyedPoints.push(newPoint);
      }

      const historyAssetPath = path.join(
        __dirname,
        "..",
        "src/generated_assets",
        `${packageName.replace(/\//g, "_")}.json`
      );

      console.log(historyAssetPath);

      const historyFile: AssetHistoryFile = {
        epoch,
        versions,
        points: keyedPoints,
      };
      await fs.writeFile(historyAssetPath, JSON.stringify(historyFile));
    })
  );
}

type PackageHistory = {
  date: string;
  downloadsCounts: Record<string, number>;
}[];

async function getDownloadCounts(
  pkg: PackageIdentifier
): Promise<PackageHistory> {
  let timepoints: string[];

  const pkgPath = pkg.replace("/", "_");
  try {
    timepoints = (await fs.readdir(historyPath(pkgPath)))
      .filter((name) => name.endsWith(".json"))
      .map((name) => name.slice(0, -".json".length))
      .map((name) => name.replace(/_/g, ":"))
      .sort()
      .reverse();
  } catch {
    return [];
  }

  if (timepoints.length === 0) {
    return [];
  }

  const latest = Date.parse(timepoints[0]);
  const earliestAllowableDate = latest - maxDaysOfHistory * 24 * 60 * 60 * 1000;
  const allowableTimepoints = timepoints.filter(
    (timepoint) => Date.parse(timepoint) >= earliestAllowableDate
  );

  const history: PackageHistory = [];
  for (const timepoint of allowableTimepoints) {
    history.push({
      date: timepoint,
      downloadsCounts: JSON.parse(
        (
          await fs.readFile(
            historyPath(pkgPath, `${timepoint.replace(/:/g, "_")}.json`)
          )
        ).toString()
      ),
    });
  }

  return history;
}

function filterToAllowedVersions(
  point: AssetHistoryPoint,
  versionFilter: (version: string) => boolean,
  publishTimes: PackagePublishTimes,
): AssetHistoryPoint {
  const newPoint: AssetHistoryPoint = { date: point.date, versionCounts: {} };
  const sortedVersions = Object.keys(point.versionCounts)
    .filter((v) => {
      if (point.date - Date.parse(publishTimes[v]) > maxDaysPublishedAgo * 24 * 60 * 60 * 1000) {
        return false;
      }
      return versionFilter(v);
    })
    .sort(compareVersion);

  for (const v of sortedVersions) {
    newPoint.versionCounts[v] = point.versionCounts[v];
  }

  return newPoint;
}

function compareVersion(v1: string, v2: string): -1 | 0 | 1 {
  const firstIsCanary = semver.lt(v1, "0.0.0");
  const secondIsCanary = semver.lt(v2, "0.0.0");

  if (firstIsCanary && !secondIsCanary) {
    return 1;
  }

  if (!firstIsCanary && secondIsCanary) {
    return -1;
  }

  // Some 0.0.0-xxx releases are not in sorted order
  if (
    (!firstIsCanary || isCanaryComparable(v1)) &&
    (!secondIsCanary || isCanaryComparable(v2))
  ) {
    return semver.compare(v1, v2);
  }

  return 0;
}

function isCanaryComparable(version: string): boolean {
  const pre = semver.prerelease(version)?.[0];

  if (typeof pre !== "string") {
    return false;
  }

  return pre.split("-").length === 3 || pre === "canary";
}

/**
 * Returns a path to the root of recorded history
 */
function historyPath(...subpaths: string[]) {
  return path.join(__dirname, "..", "history", ...subpaths);
}

/**
 * Fetches a map of when each version of a package was published
 */
 async function fetchPublishTimes(packageName: string): Promise<PackagePublishTimes> {
  const packageMetadata = await axiosInstance.get<{time: PackagePublishTimes}>(
    `https://registry.npmjs.org/${packageName}`
  );

  return packageMetadata.data.time;
}
