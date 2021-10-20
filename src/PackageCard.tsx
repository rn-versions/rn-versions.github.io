import React, { useEffect, useState } from "react";
import styles from "./PackageCard.module.scss";

import VersionDownloadChart, { MeasurementPoint } from "./VersionDownloadChart";
import chartStyles from "./VersionDownloadChart.styles";

import HistoryReader, { PackageIdentifier } from "./HistoryReader";

export type PackageCardProps = {
  /**
   * The string to use in the title section of the card
   */
  title: string;

  /**
   * Which NPM package to show a shart for
   */
  packageName: PackageIdentifier;
};

type DataFilledChartProps = { packageName: PackageIdentifier };

const DataFilledChart: React.FC<DataFilledChartProps> = React.memo(
  ({ packageName }) => {
    const dataPoints = createDownloadMeasurementPoints(packageName);
    return (
      <VersionDownloadChart datapoints={dataPoints} maxVersionsShown={8} />
    );
  }
);

type RenderPhase = "initial" | "charts-rendering" | "charts-visible";

const PackageCard: React.FC<PackageCardProps> = ({ title, packageName }) => {
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

  return (
    <div
      className={`${styles.packageCard} ${styles.opacityTransition} ${cardVisibilityClass}`}
    >
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.unit}>(Downloads/Week)</p>
      </div>

      {renderPhase === "charts-visible" ? (
        <div className={`${styles.opacityTransition} ${chartVisibilityClass}`}>
          <DataFilledChart packageName={packageName} />
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
  packageName: PackageIdentifier
): MeasurementPoint[] {
  const historyReader = new HistoryReader(packageName);

  const dataPoints: MeasurementPoint[] = [];

  for (const datePoint of historyReader.getMajorVersionDatePoints()) {
    for (const [version, count] of Object.entries(datePoint.versions)) {
      dataPoints.push({ date: datePoint.date.getTime(), version, count });
    }
  }

  return dataPoints;
}

export default PackageCard;
