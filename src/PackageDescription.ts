import semver from "semver";

/** Takes raw input, and [], to be factored into an accumulated record. */
export type MapToMajor = (version: string) => string;

export type PackageDescription = {
  /** User-visible name of the package */
  friendlyName: string;

  /** Filter of package versions to collect and show */
  versionFilter: (version: string) => boolean;
};

const isNightly = (v: string) => semver.lt(v, "0.0.0");
const minVersion = (v: string, min: string) =>
  semver.gte(v, `${min}.0`, {
    includePrerelease: true,
  });

export const packages = {
  "@types/react-native": {
    friendlyName: "DefinitelyTyped Typings",
    versionFilter: (v: string) => minVersion(v, "0.63"),
  },
  "react-native": {
    friendlyName: "React Native",
    versionFilter: (v: string) => minVersion(v, "0.63") || isNightly(v),
  },
  "react-native-macos": {
    friendlyName: "React Native macOS",
    versionFilter: (v: string) => minVersion(v, "0.63") || isNightly(v),
  },
  "react-native-web": {
    friendlyName: "React Native Web",
    versionFilter: (v: string) => minVersion(v, "0.11") || isNightly(v),
  },
  "react-native-windows": {
    friendlyName: "React Native Windows",
    versionFilter: (v: string) =>
      (minVersion(v, "0.63") || isNightly(v)) && v !== "1.0.0",
  },
};

export type PackageIdentifier = keyof typeof packages;
