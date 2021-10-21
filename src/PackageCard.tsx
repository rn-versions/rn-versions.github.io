import React, { useEffect, useState } from "react";
import styles from "./PackageCard.module.scss";

import VersionDownloadChart from "./VersionDownloadChart";
import chartStyles from "./VersionDownloadChart.styles";

import { PackageIdentifier, packages } from "./PackageDescription";

export type PackageCardProps = {
  identifier: PackageIdentifier;
  showPatchVersions?: boolean;
};

const MemoVersionDownloadChart: React.FC<PackageCardProps> = React.memo(
  ({ identifier, showPatchVersions }) => {
    if (showPatchVersions) {
      return (
        <VersionDownloadChart
          identifier={identifier}
          maxVersionsShown={5}
          onlyMajorVersions={false}
        />
      );
    } else {
      return (
        <VersionDownloadChart
          identifier={identifier}
          maxVersionsShown={8}
          onlyMajorVersions={true}
        />
      );
    }
  }
);

type RenderPhase = "initial" | "charts-rendering" | "charts-visible";

const PackageCard: React.FC<PackageCardProps> = ({
  identifier,
  showPatchVersions,
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
            showPatchVersions={showPatchVersions}
          />
        </div>
      ) : (
        <div style={{ height: chartStyles.responsiveContainer.height }}></div>
      )}
    </div>
  );
};

export default PackageCard;
