import semver from "semver";
import { PackageIdentifier } from "./PackageDescription";

export type HistoryPointCollection = {
  versions: string[];
  points: HistoryPoint[];
};

type HistoryFile = {
  epoch: number;
  versions: string[];
  points: HistoryPoint[];
};

export type HistoryPoint = {
  date: number;
  versionCounts: { [version: string]: number | undefined };
};

type FlattenedPoint = { date: number; version: string; count: number };

const imports: Record<PackageIdentifier, () => Promise<HistoryFile>> = {
  "react-native": () =>
    import(
      /* webpackChunkName: "react-native" */
      /* webpackPrefetch: true */
      "./generated_assets/react-native.json"
    ),
  "@types/react-native": () =>
    import(
      /* webpackChunkName: "@types_react-native" */
      /* webpackPrefetch: true */
      "./generated_assets/@types_react-native.json"
    ),
  "react-native-windows": () =>
    import(
      /* webpackChunkName: "react-native-windows" */
      /* webpackPrefetch: true */
      "./generated_assets/react-native-windows.json"
    ),
  "react-native-macos": () =>
    import(
      /* webpackChunkName: "react-native-macos" */
      /* webpackPrefetch: true */
      "./generated_assets/react-native-macos.json"
    ),
  "react-native-web": () =>
    import(
      /* webpackChunkName: "react-native-web" */
      /* webpackPrefetch: true */
      "./generated_assets/react-native-web.json"
    ),
};

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
      const historyPoint: HistoryPoint = {
        date: historyFile.epoch + filePoint.date * 1000,
        versionCounts: {},
      };

      for (const [versionIndex, count] of Object.entries(
        filePoint.versionCounts
      )) {
        historyPoint.versionCounts[
          historyFile.versions[parseInt(versionIndex, 10)]
        ] = count;
      }

      history.points.push(historyPoint);
    }

    this.pointCollection = history;
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
    return imports[packageIdentifier]();
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
