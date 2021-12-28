import path from "path";
import semver from "semver";

import { promises as fs } from "fs";

/** Representation of History File JSON */
type HistoryFile = {
  [packageName: string]: Array<{
    date: string;
    versions: Record<string, number>;
  }>;
};

/** Representation of packed asset file */
type AssetHistoryFile = { points: AssetHistoryPoint[] };
type AssetHistoryPoint = { date: number; version: string; count: number };

/** Minimum number of downloads for a version to be recored */

/** Maximum number of days to include */
const maxDaysOfHistory = 60;

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

    const datePoints: AssetHistoryPoint[] = [];

    for (const fileDatePoint of counts) {
      const date = Date.parse(fileDatePoint.date);
      if (date < earliestAllowableDate) {
        break;
      }

      for (const [version, count] of Object.entries(fileDatePoint.versions)) {
        datePoints.push({ date, version, count });
      }
    }

    const sortedPoints: AssetHistoryPoint[] = datePoints.sort(
      compareAssetHistoryPoint
    );

    const historyAssetPath = path.join(
      __dirname,
      "..",
      "src/generated_assets",
      `${packageName.replace(/\//g, "_")}.json`
    );

    const historyFile: AssetHistoryFile = { points: sortedPoints };
    await fs.writeFile(historyAssetPath, JSON.stringify(historyFile));
  }
}

function compareAssetHistoryPoint(
  p1: AssetHistoryPoint,
  p2: AssetHistoryPoint
): -1 | 0 | 1 {
  const firstIsCanary = semver.lt(p1.version, "0.0.0");
  const secondIsCanary = semver.lt(p2.version, "0.0.0");

  if (firstIsCanary && !secondIsCanary) {
    return 1;
  }

  if (!firstIsCanary && secondIsCanary) {
    return -1;
  }

  // Some 0.0.0-xxx releases are not in sorted order
  if (
    (!firstIsCanary || isCanaryComparable(p1.version)) &&
    (!secondIsCanary || isCanaryComparable(p2.version))
  ) {
    const versionComparison = semver.compare(p1.version, p2.version);
    if (versionComparison !== 0) {
      return versionComparison;
    }
  }

  return Math.max(-1, Math.min(1, p1.date - p2.date)) as -1 | 0 | 1;
}

function isCanaryComparable(version: string): boolean {
  const pre = semver.prerelease(version)?.[0] as string;
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
