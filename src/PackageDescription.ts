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

  const match = version.match(/^0\.0\.0-(?<canary>canary.\d+)$/);
  if (match) {
    return match.groups!.canary;
  }

  return version;
}

function nightlyHashVersionLabeler(version: string): string {
  if (version === "0.0") {
    return "nightly";
  }

  const match = version.match(/^0\.0\.0-(?<hash>[0-9a-f]{1,7})[0-9a-f]*$/);
  if (match) {
    return `nightly@${match.groups!.hash}`;
  }

  return version;
}

function nightlyDateHashVersionLabeler(version: string): string {
  if (version === "0.0") {
    return "nightly";
  }

  const match = version.match(
    /^0\.0\.0-(?<year>\d{4})(?<month>\d{2})(?<day>\d{2})-\d{4}-[0-9a-f]+$/
  );

  if (match) {
    const year = parseInt(match.groups!.year, 10);
    const month = parseInt(match.groups!.month, 10);
    const day = parseInt(match.groups!.day, 10);

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
  "react-native": {
    friendlyName: "React Native",
    versionFilter: (v: string) => minVersion(v, "0.63") || isNightly(v),
    versionLabeler: nightlyDateHashVersionLabeler,
  },
  "@types/react-native": {
    friendlyName: "DefinitelyTyped Typings",
    versionFilter: (v: string) => minVersion(v, "0.63"),
  },
  "react-native-windows": {
    friendlyName: "React Native Windows",
    versionFilter: (v: string) =>
      (minVersion(v, "0.63") || isNightly(v)) && v !== "1.0.0",
    versionLabeler: canaryVersionLabeler,
  },
  "react-native-macos": {
    friendlyName: "React Native macOS",
    versionFilter: (v: string) => minVersion(v, "0.63") || isNightly(v),
    versionLabeler: nightlyHashVersionLabeler,
  },
  "react-native-web": {
    friendlyName: "React Native Web",
    versionFilter: (v: string) => minVersion(v, "0.13") || isNightly(v),
    versionLabeler: nightlyHashVersionLabeler,
  },
  expo: {
    friendlyName: "Expo",
    versionFilter: (v: string) => minVersion(v, "39.0"),
  },
  react: {
    friendlyName: "React",
    versionFilter: (v: string) => minVersion(v, "16.0") || isNightly(v),
    versionLabeler: nightlyHashVersionLabeler,
  },
};

export const packages: Record<PackageIdentifier, PackageDescription> =
  packagesLiteral;

export type PackageIdentifier = keyof typeof packagesLiteral;
