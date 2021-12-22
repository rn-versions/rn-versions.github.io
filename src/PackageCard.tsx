import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import styles from "./PackageCard.module.scss";
import chartStyles from "./VersionDownloadChart.styles";

import { PackageIdentifier, packages } from "./PackageDescription";

import VersionDownloadChart from "./VersionDownloadChart";
import HistoryReader from "./HistoryReader";
import EaseVisiblity from "./EaseVisibility";
export type VersionFilter = "major" | "patch" | "prerelease";

export type PackageCardProps = {
  identifier: PackageIdentifier;
  versionFilter: VersionFilter;
};

function maxDays(versionFilter: VersionFilter) {
  switch (versionFilter) {
    case "major":
      return 60;
    case "patch":
      return 30;
    case "prerelease":
      return 14;
  }
}

const PackageCard: React.FC<PackageCardProps> = (props) => {
  const [lastVersionFilter, setLastVersionFilter] = useState<
    VersionFilter | undefined
  >(props.versionFilter);
  const [showAsPercentage, setShowAsPercentage] = useState<boolean>(false);
  const [historyReader, setHistoryReader] = useState<HistoryReader | null>(
    null
  );

  useEffect(() => {
    (async () => {
      const reader = await HistoryReader.get(props.identifier);
      setHistoryReader(reader);
    })();
  }, [historyReader, props.identifier]);

  const historyPoints = historyReader?.getDatePoints(props.versionFilter);

  // Reset show-as-percentage if version filter changes
  if (props.versionFilter !== lastVersionFilter) {
    setShowAsPercentage(false);
    setLastVersionFilter(props.versionFilter);
  }

  const packageDesc = packages[props.identifier];

  return (
    <EaseVisiblity
      visible={!!historyPoints}
      duration="slow"
      className={styles.packageCard}
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

      {historyPoints ? (
        <div className={styles.chartContainer}>
          <VersionDownloadChart
            historyPoints={historyPoints}
            maxDaysShown={maxDays(props.versionFilter)}
            maxVersionsShown={7}
            measurementTransform={
              showAsPercentage ? "percentage" : "totalDownloads"
            }
            versionLabeler={packageDesc.versionLabeler}
          />
        </div>
      ) : (
        <div style={{ height: chartStyles.responsiveContainer.height }} />
      )}
    </EaseVisiblity>
  );
};

export default PackageCard;
