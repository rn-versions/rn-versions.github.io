import React, { Suspense, useState } from "react";
import { Form } from "react-bootstrap";
import styles from "./PackageCard.module.scss";
import chartStyles from "./VersionDownloadChart.styles";

import { PackageIdentifier, packages } from "./PackageDescription";

import type {
  MeasurementTransform,
  VersionFilter,
} from "./VersionDownloadChart";
import FadeIn from "./FadeIn";

const VersionDownloadChart = React.lazy(() => import("./VersionDownloadChart"));

export type PackageCardProps = {
  identifier: PackageIdentifier;
  versionFilter?: VersionFilter;
};

type CardChartProps = {
  identifier: PackageIdentifier;
  versionFilter: VersionFilter;
  measurementTransform: MeasurementTransform;
};

const CardChart: React.FC<CardChartProps> = React.memo(
  ({ identifier, versionFilter, measurementTransform }) => {
    const maxVersionsShown = maxVersions(versionFilter);
    return (
      <VersionDownloadChart
        identifier={identifier}
        versionFilter={versionFilter}
        measurementTransform={measurementTransform}
        maxVersionsShown={maxVersionsShown}
      />
    );
  }
);

function maxVersions(versionFilter: VersionFilter) {
  switch (versionFilter) {
    case "major":
      return 8;
    case "patch":
      return 9;
    case "prerelease":
      return 4;
  }
}

const PackageCard: React.FC<PackageCardProps> = (props) => {
  const [lastVersionFilter, setLastVersionFilter] = useState<
    VersionFilter | undefined
  >(props.versionFilter);
  const [showAsPercentage, setShowAsPercentage] = useState<boolean>(false);

  // Reset show-as-percentage if version filter changes
  if (props.versionFilter !== lastVersionFilter) {
    setShowAsPercentage(false);
    setLastVersionFilter(props.versionFilter);
  }

  const packageDesc = packages[props.identifier];

  return (
    <FadeIn duration="slow" className={styles.packageCard}>
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

      <Suspense
        fallback={
          <div style={{ height: chartStyles.responsiveContainer.height }} />
        }
      >
        <div className={styles.chartContainer}>
          <CardChart
            identifier={props.identifier}
            versionFilter={props.versionFilter || "major"}
            measurementTransform={
              showAsPercentage ? "percentage" : "totalDownloads"
            }
          />
        </div>
      </Suspense>
    </FadeIn>
  );
};

export default PackageCard;
