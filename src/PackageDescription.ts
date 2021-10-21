import semver from "semver";

export type PackageDescription = {
  /** User-visible name of the package */
  friendlyName: string;

  /** Filter of what pacakge versions should be shown in the graph */
  defaultFilter: (version: string) => boolean;
};

export const packages = {
  "@types/react-native": {
    friendlyName: "DefinitelyTyped Typings",
    defaultFilter: (version: string) => semver.satisfies(version, ">= 0.50.0"),
  },
  "react-native": {
    friendlyName: "React Native",
    defaultFilter: (version: string) => semver.satisfies(version, ">= 0.50.0"),
  },
  "react-native-macos": {
    friendlyName: "React Native macOS",
    defaultFilter: (version: string) => semver.satisfies(version, ">= 0.62.0"),
  },
  "react-native-reanimated": {
    packageName: "react-native-reanimated",
    friendlyName: "React Native Reanimated",
    defaultFilter: (version: string) => semver.satisfies(version, ">= 2.0.0"),
  },
  "react-native-web": {
    friendlyName: "React Native Web",
    defaultFilter: (version: string) =>
      semver.satisfies(version, ">= 0.11.0") && version !== "1.0.0",
  },
  "react-native-windows": {
    friendlyName: "React Native Windows",
    defaultFilter: (version: string) =>
      semver.satisfies(version, ">= 0.63.0") && version !== "1.0.0",
  },
};

export type PackageIdentifier = keyof typeof packages;
