import semver from "semver";
import {
  PackageDescription,
  PackageIdentifier,
  packages,
} from "./PackageDescription";

type HistoryFile = { points: HistoryPoint[] };
export type HistoryPoint = { date: number; version: string; count: number };

/**
 * Allows reading from stored download history of an npm package
 */
export default class HistoryReader {
  private readonly packageDescription: PackageDescription;
  private readonly historyPoints: HistoryPoint[];

  private majorDatePoints: HistoryPoint[] | null = null;
  private patchDatePoints: HistoryPoint[] | null = null;
  private prereleaseDatePoints: HistoryPoint[] | null = null;

  private static instances: Partial<Record<PackageIdentifier, HistoryReader>> =
    {};

  private constructor(
    packageIdentifier: PackageIdentifier,
    historyPoints: HistoryPoint[]
  ) {
    this.packageDescription = packages[packageIdentifier];

    this.historyPoints = historyPoints;
  }

  static async get(
    packageIdentifier: PackageIdentifier
  ): Promise<HistoryReader> {
    if (!HistoryReader.instances[packageIdentifier]) {
      const historyFile = await HistoryReader.loadHistoryFile(
        packageIdentifier
      );

      HistoryReader.instances[packageIdentifier] = new HistoryReader(
        packageIdentifier,
        historyFile.points
      );
    }
    return HistoryReader.instances[packageIdentifier]!;
  }

  private static async loadHistoryFile(
    packageIdentifier: PackageIdentifier
  ): Promise<HistoryFile> {
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

  getDatePoints(
    versionFilter: "major" | "patch" | "prerelease"
  ): HistoryPoint[] {
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
    extraFilter?: (point: HistoryPoint) => boolean;
  }): HistoryPoint[] {
    let points = this.historyPoints;

    if (opts?.extraFilter) {
      points = this.historyPoints.filter(opts.extraFilter);
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
