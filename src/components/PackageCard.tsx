import { useEffect, useState, startTransition, Suspense } from "react";
import styles from "../styles/PackageCard.module.scss";

import { Text, ThemeProvider, ITheme, Shimmer } from "@fluentui/react";

import { CalculatorPercentageIcon } from "@fluentui/react-icons-mdl2";

import { PackageIdentifier, packages } from "../PackageDescription";

import { lightTheme } from "../styles/Themes";
import useHistory from "../hooks/useHistory";
import TooltipButton from "./TooltipButton";

import React from "react";
import usePersistentState from "../hooks/usePersistentState";

export type VersionFilter = "major" | "patch" | "prerelease";

export type PackageCardProps = {
  identifier: PackageIdentifier;
  versionFilter: VersionFilter;
  theme?: ITheme;
  tooltipTheme?: ITheme;
  maxVersionsShown?: number;
};

const chartImport = import("../components/VersionDownloadChart");
const VersionDownloadChart = React.lazy(() => chartImport);

function maxDays(versionFilter: VersionFilter) {
  switch (versionFilter) {
    case "major":
      return 365;
    case "patch":
      return 28;
    case "prerelease":
      return 14;
  }
}

function popularDuring(versionFilter: VersionFilter): "most-recent" | "all" {
  switch (versionFilter) {
    case "major":
      return "most-recent";
    case "patch":
      return "most-recent";
    case "prerelease":
      return "all";
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
  maxVersionsShown,
}) => {
  const showAsPercentageKey = `PackageCard.showAsPercentage-${identifier}-${versionFilter}`;
  const [showAsPercentage, setShowAsPercentage] = usePersistentState(
    showAsPercentageKey,
    false
  );

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
            maxVersionsShown={maxVersionsShown ?? 4}
            popularDuring={popularDuring(versionFilter)}
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
  children: React.ReactNode;
  disabled: boolean;
  theme: ITheme;
}> = ({ children, disabled, theme }) => {
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
