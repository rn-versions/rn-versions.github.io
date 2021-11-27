import semver from "semver";
import {
  PackageDescription,
  PackageIdentifier,
  packages,
} from "./PackageDescription";

type HistoryFile = {
  [packageName: string]: HistoryPoint[] | undefined;
};

export type HistoryPoint = { date: number; version: string; count: number };

/**
 * Allows reading from stored download history of an npm package
 */
export default class HistoryReader {
  private readonly packageDescription: PackageDescription;
  private readonly datePointsSorted: HistoryPoint[];

  private majorDatePoints: HistoryPoint[] | null = null;
  private patchDatePoints: HistoryPoint[] | null = null;
  private prereleaseDatePoints: HistoryPoint[] | null = null;

  private static instances: Partial<Record<PackageIdentifier, HistoryReader>> =
    {};

  private constructor(packageIdentifier: PackageIdentifier) {
    const historyFile: HistoryFile = require("./assets/download_history.json");
    this.packageDescription = packages[packageIdentifier];
    this.datePointsSorted = historyFile[packageIdentifier] ?? [];
  }

  static get(packageIdentifier: PackageIdentifier): HistoryReader {
    if (!HistoryReader.instances[packageIdentifier]) {
      HistoryReader.instances[packageIdentifier] = new HistoryReader(
        packageIdentifier
      );
    }
    return HistoryReader.instances[packageIdentifier]!;
  }

  getMajorDatePoints(): HistoryPoint[] {
    if (!this.majorDatePoints) {
      this.majorDatePoints = this.accumulateDatePoints({
        versionMapper: this.mapToMajor,
      });
    }
    return this.majorDatePoints;
  }

  private mapToMajor(version: string) {
    const versionParts = semver.parse(version)!;

    if (versionParts.major === 0) {
      return `0.${versionParts.minor}`;
    } else {
      return `${versionParts.major}.0`;
    }
  }

  getPatchDatePoints(): HistoryPoint[] {
    if (!this.patchDatePoints) {
      this.patchDatePoints = this.accumulateDatePoints();
    }
    return this.patchDatePoints;
  }

  getPrereleaseDataPoints(): HistoryPoint[] {
    if (!this.prereleaseDatePoints) {
      this.prereleaseDatePoints = this.accumulateDatePoints({
        extraFilter: (point) => !!semver.prerelease(point.version),
      });
    }
    return this.prereleaseDatePoints;
  }

  private accumulateDatePoints(opts?: {
    versionMapper?: (v: string) => string;
    extraFilter?: (point: HistoryPoint) => boolean;
  }): HistoryPoint[] {
    let points: HistoryPoint[];

    if (opts?.extraFilter) {
      points = this.datePointsSorted.filter(
        (point) =>
          opts.extraFilter!(point) &&
          this.packageDescription.versionFilter(point.version)
      );
    } else {
      points = this.datePointsSorted.filter((point) =>
        this.packageDescription.versionFilter(point.version)
      );
    }

    if (opts?.versionMapper) {
      const pointsByMappedVersion: Record<
        string,
        Array<{ date: number; count: number }> | undefined
      > = {};

      for (const point of points) {
        const mappedVersion = opts.versionMapper(point.version);

        const versionPoints = pointsByMappedVersion[mappedVersion] ?? [];
        pointsByMappedVersion[mappedVersion] = versionPoints;

        const versionDatePoint = versionPoints.find(
          (p) => point.date === p.date
        );

        if (versionDatePoint) {
          versionDatePoint.count += point.count;
        } else {
          versionPoints.push({ date: point.date, count: point.count });
        }
      }

      points = [];
      for (const [version, pointsByVersion] of Object.entries(
        pointsByMappedVersion
      )) {
        const pointsByVersionByDate = pointsByVersion!.sort(
          (p1, p2) => p1.date - p2.date
        );
        points.push(...pointsByVersionByDate.map((p) => ({ ...p, version })));
      }
    }

    return points;
  }
}
