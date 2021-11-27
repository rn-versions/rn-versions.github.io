import semver from "semver";

/** Takes each raw version as an input, to be factored into an accumulated record. */
export type ParitionFunction = (
  accum: Record<string, number>,
  current: { version: string; count: number }
) => void;

/** Groups raw versions who share a minor version */
const partitionByMinor: ParitionFunction = (accum, { version, count }) => {
  const simpleVersion = `${semver.major(version)}.${semver.minor(version)}`;

  const accumCount = accum[simpleVersion] || 0;
  accum[simpleVersion] = accumCount + count;
};

export type PackageDescription = {
  /** User-visible name of the package */
  friendlyName: string;

  /** Filter of what pacakge versions should be shown in the graph */
  defaultFilter: (version: string) => boolean;

  /** Defines how to group different packages into a "simplified" view */
  partitionFunction: ParitionFunction;
};

const isNightly = (v: string) => semver.lt(v, "0.0.0");
const minVersion = (v: string, min: string) =>
  semver.gte(v, `${min}.0`, {
    includePrerelease: true,
  });

export const packages = {
  "@types/react-native": {
    friendlyName: "DefinitelyTyped Typings",
    defaultFilter: (v: string) => minVersion(v, "0.63"),
    partitionFunction: partitionByMinor,
  },
  "react-native": {
    friendlyName: "React Native",
    defaultFilter: (v: string) => minVersion(v, "0.63") || isNightly(v),
    partitionFunction: partitionByMinor,
  },
  "react-native-macos": {
    friendlyName: "React Native macOS",
    defaultFilter: (v: string) => minVersion(v, "0.63") || isNightly(v),
    partitionFunction: partitionByMinor,
  },
  "react-native-web": {
    friendlyName: "React Native Web",
    defaultFilter: (v: string) => minVersion(v, "0.11") || isNightly(v),
    partitionFunction: partitionByMinor,
  },
  "react-native-windows": {
    friendlyName: "React Native Windows",
    defaultFilter: (v: string) =>
      (minVersion(v, "0.63") || isNightly(v)) && v !== "1.0.0",
    partitionFunction: partitionByMinor,
  },
};

export type PackageIdentifier = keyof typeof packages;
