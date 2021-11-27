import semver from "semver";
import {
  PackageDescription,
  PackageIdentifier,
  packages,
} from "./PackageDescription";

type HistoryFileDatePoint = { date: Date; versions: Record<string, number> };
type HistoryFile = {
  [packageName: string]: HistoryFileDatePoint[] | undefined;
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
    const packageHistory = historyFile[packageIdentifier] || [];
    const datePoints: HistoryPoint[] = [];

    for (const fileDatePoint of packageHistory) {
      for (const [version, count] of Object.entries(fileDatePoint.versions)) {
        datePoints.push({
          date: new Date(fileDatePoint.date).getTime(),
          version,
          count,
        });
      }
    }

    this.packageDescription = packages[packageIdentifier];
    this.datePointsSorted = datePoints.sort(compareHistoryPoint);
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
        versionMapper: mapToMajor,
      });
    }
    return this.majorDatePoints;
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
    let points = this.datePointsSorted.filter((point) =>
      this.packageDescription.versionFilter(point.version)
    );

    if (opts?.extraFilter) {
      points = points.filter(opts.extraFilter);
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

function compareHistoryPoint(p1: HistoryPoint, p2: HistoryPoint): -1 | 0 | 1 {
  const firstIsCanary = semver.lt(p1.version, "0.0.0");
  const secondIsCanary = semver.lt(p2.version, "0.0.0");

  if (firstIsCanary && !secondIsCanary) {
    return 1;
  }

  if (!firstIsCanary && secondIsCanary) {
    return -1;
  }

  const versionComparison = semver.compare(p1.version, p2.version);
  if (versionComparison !== 0) {
    return versionComparison;
  }

  return Math.max(-1, Math.min(1, p1.date - p2.date)) as -1 | 0 | 1;
}

function mapToMajor(version: string) {
  const versionParts = semver.parse(version)!;

  if (versionParts.major === 0) {
    return `0.${versionParts.minor}`;
  } else {
    return `${versionParts.major}.0`;
  }
}
