import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import styles from "./PackageCard.module.scss";

import VersionDownloadChart from "./VersionDownloadChart";
import chartStyles from "./VersionDownloadChart.styles";

import { PackageIdentifier, packages } from "./PackageDescription";

export type PackageCardProps = {
  identifier: PackageIdentifier;
  versionFilter?: "major" | "patch" | "prerelease";
};

type MemDownloadChartProps = {
  identifier: PackageIdentifier;
  versionFilter: "major" | "patch" | "prerelease";
  showAsPercentage: boolean;
};

const MemDownloadChart: React.FC<MemDownloadChartProps> = React.memo(
  ({ identifier, versionFilter, showAsPercentage }) => {
    switch (versionFilter) {
      case "major":
        return (
          <VersionDownloadChart
            identifier={identifier}
            maxVersionsShown={8}
            versionFilter={versionFilter}
            {...(showAsPercentage && {
              measurementTransform: "percentage",
            })}
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
            maxVersionsShown={4}
            versionFilter={versionFilter}
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
  const [showAsPercentage, setShowAsPercentage] = useState<boolean>(false);

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
        <div className={styles.headerLeft} />
        <div className={styles.headerText}>
          <h3 className={styles.title}>{packageDesc.friendlyName}</h3>
          <p className={styles.unit}>(Downloads/Week)</p>
        </div>
        <div className={styles.headerControls}>
          <Form.Switch
            label="%"
            checked={showAsPercentage}
            onChange={() => setShowAsPercentage(!showAsPercentage)}
          />
        </div>
      </div>

      {renderPhase === "charts-visible" ? (
        <div className={`${styles.opacityTransition} ${chartVisibilityClass}`}>
          <MemDownloadChart
            identifier={identifier}
            versionFilter={versionFilter || "major"}
            showAsPercentage={showAsPercentage}
          />
        </div>
      ) : (
        <div style={{ height: chartStyles.responsiveContainer.height }}></div>
      )}
    </div>
  );
};

export default PackageCard;
