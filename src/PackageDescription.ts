import semver from "semver";

/** Takes raw input, and [], to be factored into an accumulated record. */
export type MapToMajor = (version: string) => string;

export type PackageDescription = {
  /** User-visible name of the package */
  friendlyName: string;

  /** Weight, used for sorting  */
  popularity: number;

  /** Filter of package versions to collect and show */
  versionFilter: (version: string) => boolean;

  /** Allows relabeling specific versions to a user-friendly value */
  versionLabeler?: (version: string) => string;
};

function canaryVersionLabeler(version: string): string {
  if (version === "0.0") {
    return "canary";
  }

  const match = version.match(/^0\.0\.0-(?<canary>canary.\d+)$/);
  if (match) {
    return match.groups!.canary;
  }

  return version;
}

const isNightly = (v: string) => semver.lt(v, "0.0.0");
const minVersion = (v: string, min: string) => semver.gte(v, `${min}.0`);

const packagesLiteral = {
  "react-native": {
    friendlyName: "React Native",
    popularity: 1_740_000,
    versionFilter: (v: string) =>
      v !== "1000.0.0" && v !== "0.0" && minVersion(v, "0.66"),
  },
  "react-native-windows": {
    friendlyName: "React Native Windows",
    popularity: 17_940,
    versionFilter: (v: string) =>
      (minVersion(v, "0.66") || isNightly(v)) && v !== "1.0.0",
    versionLabeler: canaryVersionLabeler,
  },
  "react-native-tvos": {
    friendlyName: "React Native TV",
    popularity: 4_490,
    versionFilter: (v: string) => minVersion(v, "0.66"),
  },
  "react-native-macos": {
    friendlyName: "React Native macOS",
    popularity: 3_180,
    versionFilter: (v: string) =>
      v !== "1000.0.0" && v !== "0.0" && minVersion(v, "0.66"),
  },
  "react-native-web": {
    friendlyName: "React Native Web",
    popularity: 384_400,
    versionFilter: (v: string) => minVersion(v, "0.17") || isNightly(v),
    versionLabeler: canaryVersionLabeler,
  },
  expo: {
    friendlyName: "Expo",
    popularity: 571_600,
    versionFilter: (v: string) =>
      v !== "0.1.0pre" && v !== "0.1.0pre2" && minVersion(v, "45.0"),
  },
  react: {
    friendlyName: "React",
    popularity: 17_840_000,
    versionFilter: (v: string) => minVersion(v, "17.0") || isNightly(v),
    versionLabeler: (v: string) => (v === "0.0" ? "experimental" : v),
  },
  "@callstack/react-native-visionos": {
    friendlyName: "React Native visionOS",
    popularity: 2_100,
    versionFilter: (v: string) => minVersion(v, "0.73"),
  },
  "yoga-layout": {
    friendlyName: "Yoga Layout",
    popularity: 130_000,
    versionFilter: () => true,
  },
};

export const packages: Record<PackageIdentifier, PackageDescription> =
  packagesLiteral;

export type PackageIdentifier = keyof typeof packagesLiteral;
