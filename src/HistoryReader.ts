import semver from "semver";
import { PackageIdentifier } from "./PackageDescription";

export type HistoryPointCollection = {
  versions: string[];
  points: HistoryPoint[];
};
export type HistoryPoint = {
  date: number;
  versionCounts: { [version: string]: number | undefined };
};

type FlattenedPoint = { date: number; version: string; count: number };

/**
 * Allows reading from stored download history of an npm package
 */
export default class HistoryReader {
  private readonly pointCollection: HistoryPointCollection;

  private majorDatePoints: HistoryPointCollection | null = null;
  private prereleaseDatePoints: HistoryPointCollection | null = null;

  private static instances: Partial<Record<PackageIdentifier, HistoryReader>> =
    {};

  private constructor(historyPoints: HistoryPointCollection) {
    this.pointCollection = historyPoints;
  }

  static async get(
    packageIdentifier: PackageIdentifier
  ): Promise<HistoryReader> {
    if (!HistoryReader.instances[packageIdentifier]) {
      const historyFile = await HistoryReader.loadHistoryFile(
        packageIdentifier
      );

      HistoryReader.instances[packageIdentifier] = new HistoryReader(
        historyFile
      );
    }
    return HistoryReader.instances[packageIdentifier]!;
  }

  private static async loadHistoryFile(
    packageIdentifier: PackageIdentifier
  ): Promise<HistoryPointCollection> {
    switch (packageIdentifier) {
      case "@types/react-native":
        return await import("./generated_assets/@types_react-native.json");
      case "react-native":
        return await import("./generated_assets/react-native.json");
      case "react-native-macos":
        return await import("./generated_assets/react-native-macos.json");
      case "react-native-web":
        return await import("./generated_assets/react-native-web.json");
      case "react-native-windows":
        return await import("./generated_assets/react-native-windows.json");
    }
  }

  getMajorDatePoints(): HistoryPointCollection {
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

  getPatchDatePoints(): HistoryPointCollection {
    return this.pointCollection;
  }

  getPrereleaseDataPoints(): HistoryPointCollection {
    if (!this.prereleaseDatePoints) {
      this.prereleaseDatePoints = this.accumulateDatePoints({
        versionFilter: (v) => !!semver.prerelease(v),
      });
    }
    return this.prereleaseDatePoints;
  }

  getDatePoints(
    versionFilter: "major" | "patch" | "prerelease"
  ): HistoryPointCollection {
    switch (versionFilter) {
      case "major":
        return this.getMajorDatePoints();
      case "patch":
        return this.getPatchDatePoints();
      case "prerelease":
        return this.getPrereleaseDataPoints();
    }
  }

  private accumulateDatePoints(opts?: {
    versionMapper?: (v: string) => string;
    versionFilter?: (version: string) => boolean;
  }): HistoryPointCollection {
    let versions = [...this.pointCollection.versions];
    let points = flattenPoints(this.pointCollection.points);

    if (opts?.versionFilter) {
      versions = versions.filter(opts.versionFilter);
      points = points.filter((p) => opts.versionFilter!(p.version));
    }

    if (opts?.versionMapper) {
      versions = [...new Set(versions.map(opts.versionMapper))];
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

    return { versions, points: unflattenPoints(points) };
  }
}

function flattenPoints(points: HistoryPoint[]): FlattenedPoint[] {
  const flattened: FlattenedPoint[] = [];

  for (const point of points) {
    for (const [version, count] of Object.entries(point.versionCounts)) {
      flattened.push({ date: point.date, version, count: count! });
    }
  }

  return flattened;
}

function unflattenPoints(points: FlattenedPoint[]): HistoryPoint[] {
  const unflattenedPoints: Array<HistoryPoint> = [];

  for (const flatPoint of points) {
    const datePoint = unflattenedPoints.find((p) => p.date === flatPoint.date);
    if (datePoint) {
      datePoint.versionCounts[flatPoint.version] = flatPoint.count;
    } else {
      unflattenedPoints.push({
        date: flatPoint.date,
        versionCounts: { [flatPoint.version]: flatPoint.count },
      });
    }
  }

  return unflattenedPoints;
}
