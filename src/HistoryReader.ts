import semver from "semver";
import {
  packages,
  PackageIdentifier,
  PackageDescription,
} from "./PackageDescription";

export type HistoryDatePoint = { date: Date; versions: Record<string, number> };
type HistoryFile = {
  [packageName: string]: HistoryDatePoint[] | undefined;
};

/**
 * Allows reading from stored download history of an npm package
 */
export default class HistoryReader {
  private readonly packageDescription: PackageDescription;
  private readonly dateToCounts: Map<Date, Record<string, number>> = new Map();
  private readonly datePointsSorted: HistoryDatePoint[] = [];

  private majorDatePoints: HistoryDatePoint[] | null = null;
  private patchDatePoints: HistoryDatePoint[] | null = null;
  private prereleaseDatePoints: HistoryDatePoint[] | null = null;

  private static instances: Partial<Record<PackageIdentifier, HistoryReader>> =
    {};

  private constructor(packageIdentifier: PackageIdentifier) {
    this.packageDescription = packages[packageIdentifier];

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

  static get(packageIdentifier: PackageIdentifier): HistoryReader {
    if (!HistoryReader.instances[packageIdentifier]) {
      HistoryReader.instances[packageIdentifier] = new HistoryReader(
        packageIdentifier
      );
    }
    return HistoryReader.instances[packageIdentifier]!;
  }

  getMajorDatePoints(): HistoryDatePoint[] {
    if (this.majorDatePoints) {
      return this.majorDatePoints;
    }

    this.majorDatePoints = this.datePointsSorted.map((datePoint) => {
      const accum: Record<string, number> = {};
      for (const [version, count] of Object.entries(datePoint.versions)) {
        if (this.packageDescription.defaultFilter(version)) {
          this.packageDescription.partitionFunction(accum, { version, count });
        }
      }

      return {
        date: datePoint.date,
        versions: accum,
      };
    });

    return this.majorDatePoints;
  }

  getPatchDatePoints(): HistoryDatePoint[] {
    if (this.patchDatePoints) {
      return this.patchDatePoints;
    }

    this.patchDatePoints = this.datePointsSorted.map((datePoint) => {
      const versions: Record<string, number> = {};
      for (const [version, count] of Object.entries(datePoint.versions)) {
        if (
          this.packageDescription.defaultFilter(version) &&
          !semver.prerelease(version)
        ) {
          versions[version] = count;
        }
      }

      return {
        date: datePoint.date,
        versions,
      };
    });

    return this.patchDatePoints;
  }

  getPrereleaseDataPoints(): HistoryDatePoint[] {
    if (this.prereleaseDatePoints) {
      return this.prereleaseDatePoints;
    }

    this.prereleaseDatePoints = this.datePointsSorted.map((datePoint) => {
      const versions: Record<string, number> = {};
      for (const [version, count] of Object.entries(datePoint.versions)) {
        if (
          this.packageDescription.defaultFilter(version) &&
          semver.prerelease(version)
        ) {
          versions[version] = count;
        }
      }

      return {
        date: datePoint.date,
        versions,
      };
    });

    return this.prereleaseDatePoints;
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
