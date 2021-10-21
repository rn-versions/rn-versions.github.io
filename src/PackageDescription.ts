import semver from "semver";

/** Takes each raw version as an input, to be factored into an accumulated record. */
export type ParitionFunction = (
  accum: Record<string, number>,
  current: { version: string; count: number }
) => void;

/** Groups raw versions who share a minor version */
const paritionByMinor: ParitionFunction = (accum, { version, count }) => {
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

export const packages = {
  "@types/react-native": {
    friendlyName: "DefinitelyTyped Typings",
    defaultFilter: (version: string) => semver.satisfies(version, ">= 0.50.0"),
    partitionFunction: paritionByMinor,
  },
  "react-native": {
    friendlyName: "React Native",
    defaultFilter: (version: string) => semver.satisfies(version, ">= 0.50.0"),
    partitionFunction: paritionByMinor,
  },
  "react-native-macos": {
    friendlyName: "React Native macOS",
    defaultFilter: (version: string) => semver.satisfies(version, ">= 0.62.0"),
    partitionFunction: paritionByMinor,
  },
  "react-native-reanimated": {
    packageName: "react-native-reanimated",
    friendlyName: "React Native Reanimated",
    defaultFilter: (version: string) => semver.satisfies(version, ">= 2.0.0"),
    partitionFunction: paritionByMinor,
  },
  "react-native-web": {
    friendlyName: "React Native Web",
    defaultFilter: (version: string) =>
      semver.satisfies(version, ">= 0.11.0") && version !== "1.0.0",
    partitionFunction: paritionByMinor,
  },
  "react-native-windows": {
    friendlyName: "React Native Windows",
    defaultFilter: (version: string) =>
      semver.satisfies(version, ">= 0.63.0") && version !== "1.0.0",
    partitionFunction: paritionByMinor,
  },
};

export type PackageIdentifier = keyof typeof packages;
