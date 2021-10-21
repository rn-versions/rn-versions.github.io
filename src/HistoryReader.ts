import semver from "semver";
import {
  packages,
  PackageIdentifier,
  PackageDescription,
} from "./PackageDescription";

type HistoryDatePoint = { date: Date; versions: Record<string, number> };
type HistoryFile = {
  [packageName: string]: HistoryDatePoint[] | undefined;
};

/**
 * Allows reading from stored download history of an npm package
 */
export default class HistoryReader {
  private readonly packageDescripton: PackageDescription;
  private readonly dateToCounts: Map<Date, Record<string, number>> = new Map();
  private readonly datePointsSorted: HistoryDatePoint[] = [];

  constructor(private readonly packageIdentifier: PackageIdentifier) {
    this.packageDescripton = packages[packageIdentifier];

    const historyFile: HistoryFile = require("./assets/download_history.json");
    const packageHistory = historyFile[packageIdentifier];
    for (const datePoint of packageHistory || []) {
      this.dateToCounts.set(new Date(datePoint.date), datePoint.versions);
    }

    this.datePointsSorted = [...this.dateToCounts.entries()]
      .map((entry) => ({
        date: entry[0],
        versions: sortedVersionCount(entry[1]),
      }))
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  getPatchDatePoints(): HistoryDatePoint[] {
    return this.datePointsSorted.map((datePoint) => {
      const versions: Record<string, number> = {};
      for (const [version, count] of Object.entries(datePoint.versions)) {
        if (this.packageDescripton.defaultFilter(version)) {
          versions[version] = count;
        }
      }

      return {
        date: datePoint.date,
        versions,
      };
    });
  }

  getMajorDatePoints(): HistoryDatePoint[] {
    return this.datePointsSorted.map((datePoint) => {
      const accum: Record<string, number> = {};
      for (const [version, count] of Object.entries(datePoint.versions)) {
        if (this.packageDescripton.defaultFilter(version)) {
          this.packageDescripton.partitionFunction(accum, { version, count });
        }
      }

      return {
        date: datePoint.date,
        versions: accum,
      };
    });
  }
}

function sortedVersionCount(
  versionsCounts: Record<string, number>
): Record<string, number> {
  const versions = Object.keys(versionsCounts);
  const sortedVersions = versions.sort(semver.compare);

  const ret: Record<string, number> = {};
  for (const v of sortedVersions) {
    ret[v] = versionsCounts[v];
  }

  return ret;
}
