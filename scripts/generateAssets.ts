import path from "path";
import semver from "semver";

import { promises as fs } from "fs";

import createAxiosInstance from "./helper/createAxiosInstance.js";
import { PackageIdentifier, packages } from "../src/PackageDescription.js";

type VersionIndex = string;

/** Representation of packed asset file */
type AssetHistoryFile = {
  versions: string[];
  points: (AssetHistoryPointAsObject | AssetHistoryPointAsArray)[];
};

type AssetHistoryPointAsObject = {
  date: number;
  versionCounts: Record<VersionIndex, number>;
};

type AssetHistoryPointAsArray = {
  date: number;
  versionCounts: number[];
};

/** Maximum number of days to include */
const MAX_DAYS_OF_HISTORY = 375;

/** Number of downloads needed before a version is included */
const MIN_DOWNLOADS_REQUIRED = 100;

/** milliseconds in a day */
const MS_IN_DAY = 24 * 60 * 60 * 1000;

/** Date ranges to exclude from the output */
const BAD_DATE_RANGES = [
  // A flat amount added to every download count creates an incorrect spike in
  // nightly usage
  ["2022-10-30Z", "2022-11-17"],
  // NPM underreported downloads for a week
  ["2023-09-16Z", "2023-09-23"],
];

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
      const unfilteredCounts = await getDownloadCounts(
        packageName as PackageIdentifier,
        MAX_DAYS_OF_HISTORY
      );
      const counts = filterBadDateRanges(unfilteredCounts);
      if (counts.length === 0) {
        return;
      }

      const publishTimes = await fetchPublishTimes(packageName);
      flattenEarlyMonthSpikes(counts, publishTimes);

      const includedPoints = counts
        .map((p) =>
          filterToAllowedVersions(
            p,
            packages[packageName as PackageIdentifier].versionFilter
          )
        )
        .map((p) => {
          const filteredCounts: Record<string, number> = {};
          for (const [version, count] of Object.entries(p.versionCounts)) {
            if (count >= MIN_DOWNLOADS_REQUIRED) {
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
      const keyedPoints: (
        | AssetHistoryPointAsObject
        | AssetHistoryPointAsArray
      )[] = [];

      const lastDate = 0;
      for (const point of includedPoints) {
        const msInDay = 1000 * 60 * 60 * 24;
        if (point.date < lastDate + msInDay) {
          continue;
        }

        const newPoint: AssetHistoryPointAsObject = {
          date: Math.round(point.date / 1000),
          versionCounts: {},
        };
        for (const [version, count] of Object.entries(point.versionCounts)) {
          const key = versions.indexOf(version.toString());
          newPoint.versionCounts[key] = count;
        }

        /**
         * When versionCounts doesn't have a lot of missing values, it's SIGNIFICANTLY smaller
         * to store versionCounts as an array instead.
         */
        const before = JSON.stringify(point.versionCounts);
        const optimizedVersionCounts = Array.from<number>({
          length: versions.length,
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        }).map((_, i) => newPoint.versionCounts[i] ?? -1);
        // Trim trailing -1s
        while (optimizedVersionCounts.at(-1) === -1) {
          optimizedVersionCounts.pop();
        }
        const after = JSON.stringify(optimizedVersionCounts);

        if (after.length < before.length) {
          const newPointOptimized: AssetHistoryPointAsArray = {
            date: newPoint.date,
            versionCounts: optimizedVersionCounts,
          };

          keyedPoints.push(newPointOptimized);
        } else {
          keyedPoints.push(newPoint);
        }
      }

      const historyAssetPath = path.join(
        "src",
        "generated_assets",
        `${packageName.replace(/\//g, "_")}.json`
      );

      console.log(historyAssetPath);

      const historyFile: AssetHistoryFile = {
        versions,
        points: keyedPoints,
      };
      await fs.writeFile(historyAssetPath, JSON.stringify(historyFile));
    })
  );
}

async function getDownloadCounts(
  pkg: PackageIdentifier,
  maxDaysOfHistory: number
): Promise<AssetHistoryPointAsObject[]> {
  let timepoints: string[];

  const pkgPath = pkg.replace("/", "_");
  try {
    timepoints = (await fs.readdir(historyPath(pkgPath)))
      .filter((name) => name.endsWith(".json"))
      .map((name) => name.slice(0, -".json".length))
      .map((name) => name.replace(/_/g, ":"))
      .sort((a, b) => Date.parse(a) - Date.parse(b));
  } catch {
    return [];
  }

  if (timepoints.length === 0) {
    return [];
  }

  const latestDate = Date.parse(timepoints[timepoints.length - 1]);
  const earliestDate = latestDate - maxDaysOfHistory * MS_IN_DAY;
  const allowableTimepoints = timepoints.filter(
    (timepoint) => Date.parse(timepoint) >= earliestDate
  );

  const history: AssetHistoryPointAsObject[] = [];
  for (const timepoint of allowableTimepoints) {
    history.push({
      date: Date.parse(timepoint),
      versionCounts: JSON.parse(
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
  point: AssetHistoryPointAsObject,
  versionFilter: (version: string) => boolean
): AssetHistoryPointAsObject {
  const newPoint: AssetHistoryPointAsObject = {
    date: point.date,
    versionCounts: {},
  };
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
  return path.join("history", ...subpaths);
}

/**
 * Fetches a map of when each version of a package was published
 */
async function fetchPublishTimes(
  packageName: string
): Promise<Record<string, number>> {
  const packageMetadata = await axiosInstance.get<{
    time: Record<string, string>;
  }>(`https://registry.npmjs.org/${packageName}`);

  const times: Record<string, string> = packageMetadata.data.time;

  const parsedTimes: Record<string, number> = {};
  for (const [version, time] of Object.entries(times)) {
    parsedTimes[version] = Date.parse(time);
  }

  return parsedTimes;
}

/**
 * NPM counting is unreliable for the first week of a new month for packages
 * published more than a year ago. Flatten the data until the week is over to
 * skip counting new packages until we know the data is reliable again.
 */
function flattenEarlyMonthSpikes(
  history: AssetHistoryPointAsObject[],
  publishTimes: Record<string, number>
): void {
  if (history.length <= 1) {
    return;
  }

  const maxDaysPublishedAgo = 365;
  history.forEach((point, i) => {
    for (const version of Object.keys(point.versionCounts)) {
      if (
        point.date - publishTimes[version] >
        maxDaysPublishedAgo * MS_IN_DAY
      ) {
        if (i > 0 && new Date(point.date).getUTCDate() <= 8) {
          point.versionCounts[version] =
            history[i - 1]?.versionCounts?.[version] ?? 0;
        }
      }
    }
  });
}

/**
 * Removes sampling points falling within known bad-dates
 */
function filterBadDateRanges(
  history: AssetHistoryPointAsObject[]
): AssetHistoryPointAsObject[] {
  const badDateRanges = BAD_DATE_RANGES.map((range) => range.map(Date.parse));
  return history.filter(
    (point) =>
      !badDateRanges.some(
        (range) => point.date >= range[0] && point.date < range[1]
      )
  );
}
