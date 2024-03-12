import semver from "semver";
import { PackageIdentifier, packages } from "./PackageDescription";

export type HistoryPointCollection = {
  versions: string[];
  points: HistoryPoint[];
};

type HistoryFile = {
  versions: string[];
  points: RawHistoryPoint[];
};

type RawHistoryPoint = {
  date: number;
  versionCounts: Record<string, number | undefined> | number[];
};

export type HistoryPoint = {
  date: number;
  versionCounts: Record<string, number | undefined>;
};

type FlattenedPoint = { date: number; version: string; count: number };

/**
 * Allows reading from stored download history of an npm package
 */
export default class HistoryReader {
  private readonly pointCollection: HistoryPointCollection;

  private majorDatePoints: HistoryPointCollection | null = null;
  private prereleaseDatePoints: HistoryPointCollection | null = null;

  private static historyImports: Partial<
    Record<PackageIdentifier, Promise<HistoryFile>>
  > = {};
  private static lastAcquisition: Promise<unknown> = Promise.resolve();

  private constructor(historyFile: HistoryFile) {
    const history: HistoryPointCollection = {
      versions: historyFile.versions,
      points: [],
    };

    for (const filePoint of historyFile.points) {
      const msInDay = 1000 * 60 * 60 * 24;
      const historyPoint: HistoryPoint = {
        date: filePoint.date * msInDay,
        versionCounts: {},
      };

      if (Array.isArray(filePoint.versionCounts)) {
        for (const [versionIndex, count] of filePoint.versionCounts.entries()) {
          const versionName = historyFile.versions[versionIndex];

          if (count !== -1) {
            historyPoint.versionCounts[versionName] = count;
          }
        }
      } else {
        for (const [versionIndex, count] of Object.entries(
          filePoint.versionCounts
        )) {
          const versionName = historyFile.versions[parseInt(versionIndex, 10)];

          historyPoint.versionCounts[versionName] = count;
        }
      }

      history.points.push(historyPoint);
    }

    this.pointCollection = history;
  }

  static prefetch() {
    for (const identifier of Object.keys(packages)) {
      if (!this.historyImports[identifier as PackageIdentifier]) {
        this.historyImports[identifier as PackageIdentifier] =
          HistoryReader.loadHistoryFile(identifier as PackageIdentifier);
      }
    }
  }

  static get(packageIdentifier: PackageIdentifier): Promise<HistoryReader> {
    if (!HistoryReader.historyImports[packageIdentifier]) {
      HistoryReader.historyImports[packageIdentifier] =
        HistoryReader.loadHistoryFile(packageIdentifier);
    }

    const readerAcquisition = HistoryReader.lastAcquisition
      .then(() => HistoryReader.historyImports[packageIdentifier])
      .then((history) => new HistoryReader(history!));

    this.lastAcquisition = readerAcquisition;
    return readerAcquisition;
  }

  private static loadHistoryFile(
    packageIdentifier: PackageIdentifier
  ): Promise<HistoryFile> {
    switch (packageIdentifier) {
      case "react-native":
        return import("./generated_assets/react-native.json");
      case "react-native-macos":
        return import("./generated_assets/react-native-macos.json");
      case "react-native-tvos":
        return import("./generated_assets/react-native-tvos.json");
      case "react-native-web":
        return import("./generated_assets/react-native-web.json");
      case "react-native-windows":
        return import("./generated_assets/react-native-windows.json");
      case "@callstack/react-native-visionos":
        return import(
          "./generated_assets/@callstack_react-native-visionos.json"
        );
      case "expo":
        return import("./generated_assets/expo.json");
      case "react":
        return import("./generated_assets/react.json");
      case "yoga-layout":
        return import("./generated_assets/yoga-layout.json");
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
      const versionMapping: Record<string, string> = {};
      for (const v of versions) {
        versionMapping[v] = opts.versionMapper(v);
      }

      versions = [...new Set(Object.values(versionMapping))];
      const pointsByMappedVersion: Record<
        string,
        Array<{ date: number; count: number }> | undefined
      > = {};

      for (const point of points) {
        const mappedVersion = versionMapping[point.version];

        const versionPoints = pointsByMappedVersion[mappedVersion] ?? [];
        pointsByMappedVersion[mappedVersion] = versionPoints;

        let pointFound = false;
        for (let i = versionPoints.length - 1; i >= 0; i--) {
          if (versionPoints[i].date === point.date) {
            pointFound = true;
            versionPoints[i].count += point.count;
            break;
          }

          if (versionPoints[i].date < point.date) {
            break;
          }
        }

        if (!pointFound) {
          versionPoints.push({ date: point.date, count: point.count });
        }
      }

      const dates = new Set(points.map((p) => p.date));
      for (const date of dates) {
        for (const version of versions) {
          if (!pointsByMappedVersion[version]!.some((p) => p.date === date)) {
            pointsByMappedVersion[version]!.push({ date, count: 0 });
          }
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
