import React, { useEffect, useState } from "react";
import styles from "./PackageCard.module.scss";
import chartStyles from "./VersionDownloadChart.styles";

import { Text, Toggle } from "@fluentui/react";

import { PackageIdentifier, packages } from "./PackageDescription";

import VersionDownloadChart from "./VersionDownloadChart";
import HistoryReader from "./HistoryReader";

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
    <CardFrame
      loaded={!!historyPoints}
      hasData={!!historyPoints && historyPoints.length > 0}
    >
      <div className={styles.header}>
        <div className={styles.headerLeft} />
        <div className={styles.headerText}>
          <Text variant="large">{packageDesc.friendlyName}</Text>
          <Text variant="medium">(Downloads/Week)</Text>
        </div>
        <div className={styles.headerControls}>
          <Toggle
            disabled={!historyPoints || historyPoints.length === 0}
            label="%"
            inlineLabel={true}
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
    </CardFrame>
  );
};

const CardFrame: React.FC<{ loaded: boolean; hasData: boolean }> = ({
  loaded,
  hasData,
  children,
}) => {
  return (
    <div
      className={`${styles.packageCardFrame} ${
        loaded
          ? hasData
            ? styles.visibleCardFrame
            : styles.noDataCardFrame
          : styles.fadedCardFrame
      }`}
    >
      <div
        className={`${styles.packageCardContent} ${
          loaded
            ? hasData
              ? styles.visibleCardContent
              : styles.noDataCardContent
            : styles.fadedCardContent
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default PackageCard;
