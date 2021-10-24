import React, { useEffect, useState } from "react";
import styles from "./PackageCard.module.scss";

import VersionDownloadChart from "./VersionDownloadChart";
import chartStyles from "./VersionDownloadChart.styles";

import { PackageIdentifier, packages } from "./PackageDescription";

export type PackageCardProps = {
  identifier: PackageIdentifier;
  versionFilter?: "major" | "patch" | "prerelease";
};

const MemoVersionDownloadChart: React.FC<PackageCardProps> = React.memo(
  ({ identifier, versionFilter }) => {
    switch (versionFilter || "major") {
      case "major":
        return (
          <VersionDownloadChart
            identifier={identifier}
            maxVersionsShown={8}
            versionFilter={versionFilter}
          />
        );
      case "patch":
        return (
          <VersionDownloadChart
            identifier={identifier}
            maxVersionsShown={8}
            versionFilter={versionFilter}
          />
        );
      case "prerelease":
        return (
          <VersionDownloadChart
            identifier={identifier}
            versionFilter={versionFilter}
            maxVersionsShown={6}
          />
        );
    }
  }
);

type RenderPhase = "initial" | "charts-rendering" | "charts-visible";

const PackageCard: React.FC<PackageCardProps> = ({
  identifier,
  versionFilter,
}) => {
  const [renderPhase, setRenderPhase] = useState<RenderPhase>("initial");

  useEffect(() => {
    switch (renderPhase) {
      case "initial":
        setRenderPhase("charts-rendering");
        break;
      case "charts-rendering":
        setRenderPhase("charts-visible");
        break;
      case "charts-visible":
        break;
    }
  }, [renderPhase]);

  const cardVisibilityClass =
    renderPhase === "initial" ? styles.hidden : styles.visible;

  const chartVisibilityClass =
    renderPhase === "charts-visible" ? "visible" : "hidden";

  const packageDesc = packages[identifier];

  return (
    <div
      className={`${styles.packageCard} ${styles.opacityTransition} ${cardVisibilityClass}`}
    >
      <div className={styles.header}>
        <h3 className={styles.title}>{packageDesc.friendlyName}</h3>
        <p className={styles.unit}>(Downloads/Week)</p>
      </div>

      {renderPhase === "charts-visible" ? (
        <div className={`${styles.opacityTransition} ${chartVisibilityClass}`}>
          <MemoVersionDownloadChart
            identifier={identifier}
            versionFilter={versionFilter}
          />
        </div>
      ) : (
        <div style={{ height: chartStyles.responsiveContainer.height }}></div>
      )}
    </div>
  );
};

export default PackageCard;
