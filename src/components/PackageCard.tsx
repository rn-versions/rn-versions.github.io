import React, { useEffect, useState } from "react";
import styles from "../styles/PackageCard.module.scss";

import {
  Text,
  IconButton,
  TooltipHost,
  ThemeProvider,
  ITheme,
  Shimmer,
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
      theme={theme ?? lightTheme}
      disabled={history?.points.length === 0}
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
      <div className={styles.chartContainer}>
        <div className={styles.silhouette}>
          <div className={styles.shimmerRoot}>
            {new Array(10).fill(null).map((_, i) => (
              <Shimmer isDataLoaded={!!history} key={i} />
            ))}
          </div>
        </div>

        {history && (
          <div className={styles.innerChartContainer}>
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
      </div>
    </CardFrame>
  );
};

const CardFrame: React.FC<{
  theme: ITheme;
  disabled: boolean;
}> = ({ theme, disabled, children }) => {
  return (
    <ThemeProvider
      className={
        disabled
          ? `${styles.cardFrame} ${styles.disabledCardFrame}`
          : styles.cardFrame
      }
      theme={theme}
    >
      <div
        className={
          disabled
            ? `${styles.contentWrapper} ${styles.disabledContentWrapper}`
            : styles.contentWrapper
        }
      >
        <div className={styles.cardContent}>{children}</div>
      </div>
    </ThemeProvider>
  );
};

export default PackageCard;
