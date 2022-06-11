import { JSDOM } from "jsdom";
import semver from "semver";

/**
 * Attempt to extract package version download counts from the page, throwing
 * if it cannot
 */
export default function extractDownloadCounts(
  dom: JSDOM
): Record<string, number> {
  const { document } = dom.window;

  const versionPanelLinks = [
    ...(document
      .getElementById("tabpanel-versions")
      ?.getElementsByTagName("a") || []),
  ];

  if (versionPanelLinks.length === 0) {
    throw new Error("Page structure has changed (cannot find versions tab)");
  }

  const downloadsCounts: Record<string, number> = {};

  for (const link of versionPanelLinks) {
    const version = semver.valid(link.text);
    if (version && !downloadsCounts[version]) {
      const countElement = link.parentNode!.querySelector(".downloads");
      if (!countElement) {
        throw new Error("Page structure has changed (no count found)");
      }

      const cleanedText = countElement.textContent!.replace(/[^\d]/g, "");
      const count = parseInt(cleanedText, 10);
      if (count > 0) {
        downloadsCounts[version] = count;
      }
    }
  }

  if (Object.keys(downloadsCounts).length === 0) {
    throw new Error("Page structure has changed (no versions found)");
  }

  return downloadsCounts;
}
