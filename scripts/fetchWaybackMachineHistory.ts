import path from "path";

import { promises as fs } from "fs";

import createAxiosInstance from "./helper/createAxiosInstance.js";
import { PackageIdentifier, packages } from "../src/PackageDescription.js";

type WaybackMachineStats = {
  archived_snapshots?: {
    closest: {
      available: boolean;
      url: string;
      timestamp: string;
      status: `${number}`;
    };
  };
};

/** Packages to record */
const packageNames = Object.keys(packages) as PackageIdentifier[];

/** The approximate time npmjs.com started publishing version downloads data */
const npmStart = new Date(2021, 1, 21);

/** Global HTTP Client **/
const axiosInstance = createAxiosInstance();

/** Number of days between checks */
const numberOfDaysBetweenChecks = 5;

/**
 * Main function
 */
(async () => {
  for (const packageName of packageNames) {
    console.log(`Downloading Wayback Machine stats for ${packageName}…`);

    const endTime = await findFirstVersionCount(packageName);

    console.log("Found first version count at", endTime.toISOString());

    const snapshots = await populateSnapshotsMap(packageName, endTime);

    await fetchSnapshots(packageName, snapshots);
  }
})();

async function findNextSnapshot(
  packageName: PackageIdentifier,
  startDate: Date,
  endDate: Date,
  foundSnapshots: Set<string>
): Promise<boolean> {
  if (startDate > endDate) {
    return true;
  }

  console.log(`Finding snapshot closest to ${startDate.toISOString()}…`);

  const timestamp = `${startDate.getFullYear()}${startDate.getMonth()}${startDate.getDate()}`;
  const response = await axiosInstance.get<WaybackMachineStats>(
    `https://archive.org/wayback/available?url=npmjs.com/package/${packageName}&timestamp=${timestamp}`
  );

  const closestSnapshot = response.data.archived_snapshots?.closest;

  if (closestSnapshot) {
    console.log(`Found snapshot ${closestSnapshot.url}`);

    const { timestamp } = closestSnapshot;

    const parsedTimestamp = new Date(
      Number(timestamp.slice(0, 4)),
      Number(timestamp.slice(4, 6)) - 1,
      Number(timestamp.slice(6, 8))
    );

    const isDateAfterStartDate = parsedTimestamp >= startDate;
    const isDateBeforeEndDate = parsedTimestamp <= endDate;

    if (isDateAfterStartDate) {
      if (!isDateBeforeEndDate) {
        return true;
      }

      foundSnapshots.add(closestSnapshot.url);

      const newStartDate = new Date(parsedTimestamp);
      newStartDate.setDate(newStartDate.getDate() + numberOfDaysBetweenChecks);

      return findNextSnapshot(
        packageName,
        newStartDate,
        endDate,
        foundSnapshots
      );
    } else {
      const newStartDate = new Date(startDate);
      newStartDate.setDate(newStartDate.getDate() + numberOfDaysBetweenChecks);

      return findNextSnapshot(
        packageName,
        newStartDate,
        endDate,
        foundSnapshots
      );
    }
  }

  return false;
}

async function findFirstVersionCount(packageName: string) {
  const folderContents = await fs.readdir(
    path.join("history", packageName.replace("/", "_"))
  );

  const timestamps = folderContents.map((filename) => {
    // Remove the extension
    const [rawTimestamp] = filename.split(".");

    const timestamp = rawTimestamp.replaceAll("_", ":");

    return new Date(timestamp);
  });

  return timestamps.sort()[0];
}

/**
 * Downloads snapshot URLs from the Wayback Machine API
 */
async function populateSnapshotsMap(
  packageName: PackageIdentifier,
  endDate: Date
): Promise<Set<string>> {
  const foundSnapshots = new Set<string>();

  const startDate = npmStart;

  await findNextSnapshot(packageName, startDate, endDate, foundSnapshots);

  return foundSnapshots;
}

async function fetchSnapshots(
  packageName: PackageIdentifier,
  snapshots: Set<string>
) {
  console.log(`Downloading ${snapshots.size} snapshots for ${packageName}…`);

  const snapshotsArray = Array.from(snapshots);

  for (const snapshot of snapshotsArray) {
    console.log(`Downloading ${snapshot}…`);
    const response = await axiosInstance.get<string>(snapshot);
    const timestamp = snapshot.split("/")[4];

    const filePath = timePointPath(packageName, timestamp, ".html");
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, response.data);

    const { data: rawHtml } = response;

    if (!rawHtml.includes('"versionsDownloads":')) {
      continue;
    }

    const beginIndex =
      rawHtml.indexOf('"versionsDownloads":') + '"versionsDownloads":'.length;
    const endIndex = beginIndex + rawHtml.slice(beginIndex).indexOf("}") + 1;

    const rawVersionsDownloads = rawHtml.slice(beginIndex, endIndex);
    const versionsDownloads = JSON.parse(rawVersionsDownloads);

    const filePath2 = timePointPath(packageName, timestamp, ".json");
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath2, JSON.stringify(versionsDownloads, null, 2));
  }
}

/**
 * Returns a path to the root of recorded history
 */
function historyPath(...subpaths: string[]) {
  return path.join("history", ...subpaths);
}

/**
 * Returns a path to save a timestamped resource
 */
function timePointPath(
  packageName: PackageIdentifier,
  timestamp: string,
  extension?: string
) {
  const parsedTimestamp = new Date(
    Number(timestamp.slice(0, 4)),
    Number(timestamp.slice(4, 6)) - 1,
    Number(timestamp.slice(6, 8)),
    Number(timestamp.slice(8, 10)),
    Number(timestamp.slice(10, 12)),
    Number(timestamp.slice(12, 14))
  );

  const filename =
    parsedTimestamp.toISOString().replace(/:/g, "_") + (extension ?? "");

  return historyPath(packageName.replace("/", "_"), filename);
}
