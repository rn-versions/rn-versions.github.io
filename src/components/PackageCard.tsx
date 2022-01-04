import React, { useEffect, useState } from "react";
import styles from "../styles/PackageCard.module.scss";

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
import { lightTheme } from "../styles/Themes";
import useHistory from "../hooks/useHistory";

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

  useEffect(() => {
    if (versionFilter !== lastVersionFilter) {
      setShowAsPercentage(false);
      setLastVersionFilter(versionFilter);
    }
  }, [versionFilter, lastVersionFilter]);

  const history = useHistory(identifier, versionFilter);
  const packageDesc = packages[identifier];

  return (
    <CardFrame
      loaded={!!history}
      theme={theme ?? lightTheme}
      disabled={!!history && history.points.length === 0}
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
              disabled={!history || history.points.length === 0}
              onRenderIcon={() => <CalculatorPercentageIcon />}
              checked={showAsPercentage}
              onClick={() => setShowAsPercentage(!showAsPercentage)}
            />
          </TooltipHost>
        </div>
      </div>

      {history && (
        <div className={styles.chartContainer}>
          <VersionDownloadChart
            history={history}
            maxDaysShown={maxDays(versionFilter)}
            maxVersionsShown={6}
            maxTicks={4}
            unit={showAsPercentage ? "percentage" : "totalDownloads"}
            versionLabeler={packageDesc.versionLabeler}
            theme={theme}
            tooltipTheme={tooltipTheme}
          />
        </div>
      )}
    </CardFrame>
  );
};

const CardFrame: React.FC<{
  theme: ITheme;
  loaded: boolean;
  disabled: boolean;
}> = ({ theme, loaded, disabled, children }) => {
  return (
    <div
      className={
        disabled
          ? `${styles.cardFrame} ${styles.disabledCardFrame}`
          : styles.cardFrame
      }
    >
      <ThemeProvider className={styles.silhouette} theme={theme} />

      {loaded && (
        <ThemeProvider
          className={
            disabled
              ? `${styles.contentWrapper} ${styles.disabledContentWrapper}`
              : styles.contentWrapper
          }
          theme={theme}
        >
          <div className={styles.cardContent}>{children}</div>
        </ThemeProvider>
      )}
    </div>
  );
};

export default PackageCard;
