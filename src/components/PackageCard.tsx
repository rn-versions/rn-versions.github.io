import React, { useEffect, useState } from "react";
import styles from "../styles/PackageCard.module.scss";
import chartStyles from "../styles/VersionDownloadChart.styles";

import {
  Text,
  IconButton,
  TooltipHost,
  ThemeProvider,
  ITheme,
} from "@fluentui/react";

import { CalculatorPercentageIcon } from "@fluentui/react-icons-mdl2";

import { PackageIdentifier, packages } from "../PackageDescription";

import VersionDownloadChart from "./VersionDownloadChart";
import HistoryReader from "../HistoryReader";
import { lightTheme } from "../styles/Themes";

export type VersionFilter = "major" | "patch" | "prerelease";

export type PackageCardProps = {
  identifier: PackageIdentifier;
  versionFilter: VersionFilter;
  theme?: ITheme;
  tooltipTheme?: ITheme;
};

function maxDays(versionFilter: VersionFilter) {
  switch (versionFilter) {
    case "major":
      return 84;
    case "patch":
      return 28;
    case "prerelease":
      return 14;
  }
}

const PackageCard: React.FC<PackageCardProps> = ({
  identifier,
  versionFilter,
  theme,
  tooltipTheme,
}) => {
  const [lastVersionFilter, setLastVersionFilter] = useState(versionFilter);
  const [showAsPercentage, setShowAsPercentage] = useState(false);
  const [historyReader, setHistoryReader] = useState<HistoryReader | null>(
    null
  );

  useEffect(() => {
    if (!historyReader) {
      (async () => {
        const reader = await HistoryReader.get(identifier);
        setHistoryReader(reader);
      })();
    }
  }, [historyReader, identifier]);

  useEffect(() => {
    if (versionFilter !== lastVersionFilter) {
      setShowAsPercentage(false);
      setLastVersionFilter(versionFilter);
    }
  }, [versionFilter, lastVersionFilter]);

  const historyPoints = historyReader?.getDatePoints(versionFilter);
  const packageDesc = packages[identifier];

  return (
    <CardFrame
      theme={theme ?? lightTheme}
      loaded={!!historyPoints}
      hasData={!!historyPoints && historyPoints.length > 0}
    >
      <div className={styles.header}>
        <div className={styles.headerLeft} />
        <div className={styles.headerText}>
          <Text variant="large" className={styles.packageName}>
            {packageDesc.friendlyName}
          </Text>
          <Text variant="medium">(Downloads/Week)</Text>
        </div>
        <div className={styles.headerControls}>
          <TooltipHost content="Show as percentage" theme={tooltipTheme}>
            <IconButton
              toggle
              aria-label="Show as percentage"
              disabled={!historyPoints || historyPoints.length === 0}
              onRenderIcon={() => <CalculatorPercentageIcon />}
              checked={showAsPercentage}
              onClick={() => setShowAsPercentage(!showAsPercentage)}
            />
          </TooltipHost>
        </div>
      </div>

      {historyPoints ? (
        <div className={styles.chartContainer}>
          <VersionDownloadChart
            historyPoints={historyPoints}
            maxDaysShown={maxDays(versionFilter)}
            maxVersionsShown={6}
            maxTicks={5}
            unit={showAsPercentage ? "percentage" : "totalDownloads"}
            versionLabeler={packageDesc.versionLabeler}
            theme={theme}
            tooltipTheme={tooltipTheme}
          />
        </div>
      ) : (
        <div style={{ height: chartStyles().responsiveContainer.height }} />
      )}
    </CardFrame>
  );
};

const CardFrame: React.FC<{
  theme: ITheme;
  loaded: boolean;
  hasData: boolean;
}> = ({ loaded, hasData, theme, children }) => {
  return (
    <ThemeProvider
      theme={theme}
      className={`${styles.packageCardFrame} ${
        loaded
          ? hasData
            ? styles.visibleCardFrame
            : styles.noDataCardFrame
          : styles.fadedCardFrame
      }`}
      style={{
        borderColor: theme.isInverted
          ? theme.palette.whiteTranslucent40
          : theme.palette.blackTranslucent40,
      }}
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
    </ThemeProvider>
  );
};

export default PackageCard;
