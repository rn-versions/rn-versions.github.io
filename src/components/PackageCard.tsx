import { useEffect, useState, startTransition, Suspense } from "react";
import styles from "../styles/PackageCard.module.scss";

import { Text, ThemeProvider, ITheme, Shimmer } from "@fluentui/react";

import { CalculatorPercentageIcon } from "@fluentui/react-icons-mdl2";

import { PackageIdentifier, packages } from "../PackageDescription";

import { lightTheme } from "../styles/Themes";
import useHistory from "../hooks/useHistory";
import TooltipButton from "./TooltipButton";

import type {} from "react/experimental";
import React from "react";

export type VersionFilter = "major" | "patch" | "prerelease";

export type PackageCardProps = {
  identifier: PackageIdentifier;
  versionFilter: VersionFilter;
  theme?: ITheme;
  tooltipTheme?: ITheme;
};

const chartImport = import(
  /* webpackChunkName: "VersionDownloadChart" */
  /* webpackPreload: true */
  "../components/VersionDownloadChart"
);
const VersionDownloadChart = React.lazy(() => chartImport);

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

const ChartFallback: React.FC = () => (
  <div className={styles.silhouette}>
    <div className={styles.shimmerRoot}>
      {new Array(10).fill(null).map((_, i) => (
        <Shimmer key={i} />
      ))}
    </div>
  </div>
);

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

  const [dataIsReady, setDataIsReady] = useState(false);
  useEffect(() => {
    if (history) {
      startTransition(() => setDataIsReady(true));
    }
  }, [history]);

  const disabled = !dataIsReady || (history && history.points.length === 0);

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
          <TooltipButton
            toggle
            content="Show as percentage"
            aria-label="Show as percentage"
            disabled={disabled}
            onRenderIcon={() => <CalculatorPercentageIcon />}
            checked={showAsPercentage}
            onClick={() => setShowAsPercentage(!showAsPercentage)}
          />
        </div>
      </div>
      <div className={styles.chartContainer}>
        <Suspense fallback={<ChartFallback />}>
          {!dataIsReady && <ChartFallback />}
          <VersionDownloadChart
            className={!disabled ? styles.visibleChart : styles.invisibleChart}
            history={dataIsReady ? history : undefined}
            maxDaysShown={maxDays(versionFilter)}
            maxVersionsShown={6}
            maxTicks={4}
            unit={showAsPercentage ? "percentage" : "totalDownloads"}
            versionLabeler={packageDesc.versionLabeler}
            theme={theme}
            tooltipTheme={tooltipTheme}
          />
        </Suspense>
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
