import path from "path";
import semver from "semver";

import { promises as fs } from "fs";

import { PackageDescription, packages } from "../src/PackageDescription";

type VersionIndex = string;

/** Representation of History File JSON */
type HistoryFile = {
  [packageName: string]: Array<{
    date: string;
    versions: Record<string, number>;
  }>;
};

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

/** Maximum number of days to include */
const maxDaysOfHistory = 90;

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
  const fullHistory: HistoryFile = require(fullHistoryPath());

  for (const [packageName, counts] of Object.entries(fullHistory)) {
    const earliestAllowableDate =
      Date.parse(counts[0].date) - maxDaysOfHistory * 24 * 60 * 60 * 1000;

    const description = (
      packages as Record<string, PackageDescription | undefined>
    )[packageName];
    if (!description) {
      continue;
    }

    const includedPoints = counts
      .filter((p) => Date.parse(p.date) >= earliestAllowableDate)
      .map((p) => ({ versionCounts: p.versions, date: Date.parse(p.date) }))
      .sort((a, b) => a.date - b.date)
      .map((p) => filterToAllowedVersions(p, description.versionFilter))
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
  }
}

function filterToAllowedVersions(
  point: AssetHistoryPoint,
  versionFilter?: (version: string) => boolean
): AssetHistoryPoint {
  const newPoint: AssetHistoryPoint = { date: point.date, versionCounts: {} };
  const sortedVersions = Object.keys(point.versionCounts)
    .filter(versionFilter ?? (() => true))
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
 * Returns a path to the fully recorded history
 */
function fullHistoryPath() {
  return historyPath("full_download_history.json");
}
