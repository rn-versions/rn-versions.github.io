import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import styles from "./PackageCard.module.scss";

import VersionDownloadChart, {
  MeasurementTransform,
  VersionFilter,
} from "./VersionDownloadChart";
import chartStyles from "./VersionDownloadChart.styles";

import { PackageIdentifier, packages } from "./PackageDescription";

export type PackageCardProps = {
  identifier: PackageIdentifier;
  versionFilter?: VersionFilter;
};

type CardChartProps = {
  identifier: PackageIdentifier;
  versionFilter: VersionFilter;
  measurementTransform: MeasurementTransform;
};

const CardChart: React.FC<CardChartProps> = React.memo((props) => {
  switch (props.versionFilter) {
    case "major":
      return <VersionDownloadChart {...props} maxVersionsShown={8} />;
    case "patch":
      return <VersionDownloadChart {...props} maxVersionsShown={8} />;
    case "prerelease":
      return <VersionDownloadChart {...props} maxVersionsShown={4} />;
  }
});

type RenderPhase = "initial" | "charts-rendering" | "charts-visible";

const PackageCard: React.FC<PackageCardProps> = (props) => {
  const [renderPhase, setRenderPhase] = useState<RenderPhase>("initial");
  const [lastVersionFilter, setLastVersionFilter] = useState<
    VersionFilter | undefined
  >(props.versionFilter);
  const [showAsPercentage, setShowAsPercentage] = useState<boolean>(false);

  // Reset show-as-percentage if version filter changes
  if (props.versionFilter !== lastVersionFilter) {
    setShowAsPercentage(false);
    setLastVersionFilter(props.versionFilter);
  }

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

  const packageDesc = packages[props.identifier];

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
          <CardChart
            identifier={props.identifier}
            versionFilter={props.versionFilter || "major"}
            measurementTransform={
              showAsPercentage ? "percentage" : "totalDownloads"
            }
          />
        </div>
      ) : (
        <div style={{ height: chartStyles.responsiveContainer.height }}></div>
      )}
    </div>
  );
};

export default PackageCard;
