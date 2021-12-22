import semver from "semver";

/** Takes raw input, and [], to be factored into an accumulated record. */
export type MapToMajor = (version: string) => string;

export type PackageDescription = {
  /** User-visible name of the package */
  friendlyName: string;

  /** Filter of package versions to collect and show */
  versionFilter: (version: string) => boolean;

  /** Allows relabeling specific versions to a user-friendly value */
  versionLabeler?: (version: string) => string;
};

function canaryVersionLabeler(version: string): string {
  if (version === "0.0") {
    return "canary";
  }

  if (version.startsWith("0.0.0-canary")) {
    return version.slice(6, version.length);
  }

  return version;
}

function nightlyHashVersionLabeler(version: string): string {
  if (version === "0.0") {
    return "nightly";
  }

  if (version.match(/^0\.0\.0-[0-9a-f]+$/)) {
    const hash = version.slice(6);
    const shortenedHash = hash.slice(0, Math.min(hash.length, 7));

    return `nightly@${shortenedHash}`;
  }

  return version;
}

function nightlyDateHashVersionLabeler(version: string): string {
  if (version === "0.0") {
    return "nightly";
  }

  if (version.match(/^0\.0\.0-\d{8}-\d{4}-[0-9a-f]+$/)) {
    const dateStr = version.split("-")[1];

    const year = parseInt(dateStr.slice(0, 4), 10);
    const month = parseInt(dateStr.slice(4, 6), 10);
    const day = parseInt(dateStr.slice(6, 8), 10);

    const date = new Date(year, month - 1, day);

    return `nightly@${date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "2-digit",
    })}`;
  }

  return version;
}

const isNightly = (v: string) => semver.lt(v, "0.0.0");
const minVersion = (v: string, min: string) =>
  semver.gte(v, `${min}.0`, {
    includePrerelease: true,
  });

const packagesLiteral = {
  "@types/react-native": {
    friendlyName: "DefinitelyTyped Typings",
    versionFilter: (v: string) => minVersion(v, "0.63"),
  },
  "react-native": {
    friendlyName: "React Native",
    versionFilter: (v: string) => minVersion(v, "0.63") || isNightly(v),
    versionLabeler: nightlyDateHashVersionLabeler,
  },
  "react-native-macos": {
    friendlyName: "React Native macOS",
    versionFilter: (v: string) => minVersion(v, "0.63") || isNightly(v),
    versionLabeler: nightlyHashVersionLabeler,
  },
  "react-native-web": {
    friendlyName: "React Native Web",
    versionFilter: (v: string) => minVersion(v, "0.11") || isNightly(v),
    versionLabeler: nightlyHashVersionLabeler,
  },
  "react-native-windows": {
    friendlyName: "React Native Windows",
    versionFilter: (v: string) =>
      (minVersion(v, "0.63") || isNightly(v)) && v !== "1.0.0",
    versionLabeler: canaryVersionLabeler,
  },
};

export const packages: Record<PackageIdentifier, PackageDescription> =
  packagesLiteral;

export type PackageIdentifier = keyof typeof packagesLiteral;
