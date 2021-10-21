import semver from "semver";

/**
 * Supported packages to render
 */
export type PackageIdentifier =
  | "react-native"
  | "react-native-web"
  | "react-native-windows"
  | "react-native-macos";

type HistoryDatePoint = { date: Date; versions: Record<string, number> };
type HistoryFile = {
  [packageName: string]: HistoryDatePoint[];
};

/**
 * Allows reading from stored download history of an npm package
 */
export default class HistoryReader {
  private readonly dateToCounts: Map<Date, Record<string, number>> = new Map();
  private readonly datePointsSorted: HistoryDatePoint[] = [];

  constructor(private readonly packageName: PackageIdentifier) {
    const historyFile: HistoryFile = require("./assets/download_history.json");
    const packageHistory = historyFile[packageName];
    for (const datePoint of packageHistory) {
      this.dateToCounts.set(new Date(datePoint.date), datePoint.versions);
    }

    this.datePointsSorted = [...this.dateToCounts.entries()]
      .map((entry) => ({
        date: entry[0],
        versions: sortedVersionCount(entry[1]),
      }))
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  getRawDatePoints(): HistoryDatePoint[] {
    return [...this.datePointsSorted];
  }

  getMajorVersionDatePoints(): HistoryDatePoint[] {
    return this.datePointsSorted.map((datePoint) => {
      const combinedVersions: Record<string, number> = {};

      for (const [version, count] of Object.entries(datePoint.versions)) {
        if (!this.isOfficialVersion(version)) {
          continue;
        }

        const mjaorMinor = `${semver.major(version)}.${semver.minor(version)}`;
        if (!combinedVersions[mjaorMinor]) {
          combinedVersions[mjaorMinor] = 0;
        }

        combinedVersions[mjaorMinor] += count;
      }

      return {
        date: datePoint.date,
        versions: combinedVersions,
      };
    });
  }

  private isOfficialVersion(rawVersion: string): boolean {
    switch (this.packageName) {
      case "react-native":
        return semver.satisfies(rawVersion, ">= 0.50.0");
      case "react-native-web":
        return (
          semver.satisfies(rawVersion, ">= 0.11.0") && rawVersion !== "1.0.0"
        );
      case "react-native-windows":
        return (
          semver.satisfies(rawVersion, ">= 0.63.0") && rawVersion !== "1.0.0"
        );
      case "react-native-macos":
        return semver.satisfies(rawVersion, ">= 0.62.0");
    }
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
