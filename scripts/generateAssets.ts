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
const maxDaysOfHistory = 365;

/** Number of downloads needed before a version is included */
const minDownloadsRequired = 10;

/** Global HTTP Client **/
const axiosInstance = createAxiosInstance();

const MS_IN_DAY = 24 * 60 * 60 * 1000;

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
      massageForBadNpmData(counts, publishTimes);

      const earliestAllowableDate =
        Date.parse(counts[0].date) - maxDaysOfHistory * MS_IN_DAY;

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
            packages[packageName as PackageIdentifier].versionFilter
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
  const earliestAllowableDate = latest - maxDaysOfHistory * MS_IN_DAY;
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
  versionFilter: (version: string) => boolean
): AssetHistoryPoint {
  const newPoint: AssetHistoryPoint = { date: point.date, versionCounts: {} };
  const sortedVersions = Object.keys(point.versionCounts)
    .filter(versionFilter)
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
async function fetchPublishTimes(
  packageName: string
): Promise<PackagePublishTimes> {
  const packageMetadata = await axiosInstance.get<{
    time: PackagePublishTimes;
  }>(`https://registry.npmjs.org/${packageName}`);

  return packageMetadata.data.time;
}

/**
 * NPM counting is unreliable for the first week of a new month for packages
 * published more than a year ago. Fake the data until the week is over in this
 * case to avoid spikes.
 */
function massageForBadNpmData(
  history: PackageHistory,
  publishTimes: PackagePublishTimes
): void {
  if (history.length <= 1) {
    return;
  }

  history.reverse();

  const maxDaysPublishedAgo = 365;
  history.forEach((point, i) => {
    const date = Date.parse(point.date);
    for (const version of Object.keys(point.downloadsCounts)) {
      if (
        date - Date.parse(publishTimes[version]) >
        maxDaysPublishedAgo * MS_IN_DAY
      ) {
        if (i > 0 && new Date(date).getUTCDate() <= 8) {
          point.downloadsCounts[version] =
            history[i - 1]?.downloadsCounts?.[version] ?? 0;
        }
      }
    }
  });

  history.reverse();
}
