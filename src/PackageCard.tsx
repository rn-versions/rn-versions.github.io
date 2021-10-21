import React, { useEffect, useState } from "react";
import styles from "./PackageCard.module.scss";

import VersionDownloadChart, { MeasurementPoint } from "./VersionDownloadChart";
import chartStyles from "./VersionDownloadChart.styles";

import HistoryReader from "./HistoryReader";
import { PackageIdentifier, packages } from "./PackageDescription";

export type PackageCardProps = {
  identifier: PackageIdentifier;
};

type DataFilledChartProps = {
  identifier: PackageIdentifier;
};

const DataFilledChart: React.FC<DataFilledChartProps> = React.memo(
  ({ identifier }) => {
    const dataPoints = createDownloadMeasurementPoints(identifier);
    return (
      <VersionDownloadChart datapoints={dataPoints} maxVersionsShown={8} />
    );
  }
);

type RenderPhase = "initial" | "charts-rendering" | "charts-visible";

const PackageCard: React.FC<PackageCardProps> = ({ identifier }) => {
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
          <DataFilledChart identifier={identifier} />
        </div>
      ) : (
        <div style={{ height: chartStyles.responsiveContainer.height }}></div>
      )}
    </div>
  );
};

/**
 * Create the point representation of downloads to show
 */
function createDownloadMeasurementPoints(
  identifier: PackageIdentifier
): MeasurementPoint[] {
  const historyReader = new HistoryReader(identifier);

  const dataPoints: MeasurementPoint[] = [];

  for (const datePoint of historyReader.getSimplifiedDatePoints()) {
    for (const [version, count] of Object.entries(datePoint.versions)) {
      dataPoints.push({ date: datePoint.date.getTime(), version, count });
    }
  }

  return dataPoints;
}

export default PackageCard;
