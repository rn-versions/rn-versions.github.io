import { useEffect, useState, startTransition, Suspense } from "react";
import styles from "../styles/PackageCard.module.scss";

import { Text, ThemeProvider, ITheme, Shimmer } from "@fluentui/react";

import {
  CalculatorPercentageIcon,
  FullScreenIcon,
} from "@fluentui/react-icons-mdl2";

import { PackageIdentifier, packages } from "../PackageDescription";

import { lightTheme } from "../styles/Themes";
import TooltipButton from "./TooltipButton";

import useHistory from "../hooks/useHistory";
import useSearchParamsState from "../hooks/useSearchParamsState";

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
      return 360;
    case "patch":
      return 28;
    case "prerelease":
      return 14;
  }
}

function tickInterval(versionFilter: VersionFilter): "month" | number {
  switch (versionFilter) {
    case "major":
      return "month";
    case "patch":
      return 7;
    case "prerelease":
      return 7;
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
  const [fullScreenKey, setFullScreenKey] = useSearchParamsState<string | null>(
    "fullScreen",
    null
  );
  const fullScreen = fullScreenKey === identifier;

  const setFullScreen = (value: boolean) => {
    if (value) {
      setFullScreenKey(identifier);
    } else {
      setFullScreenKey(null);
    }
  };

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
      fullScreen={fullScreen}
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
            aria-label="Show as percentage"
            checked={showAsPercentage}
            content="Show as percentage"
            disabled={disabled}
            onClick={() => setShowAsPercentage(!showAsPercentage)}
            onRenderIcon={() => <CalculatorPercentageIcon />}
            toggle
          />
          <TooltipButton
            aria-label="Show full screen"
            checked={fullScreen}
            content="Show full screen"
            disabled={disabled}
            onClick={() => setFullScreen(!fullScreen)}
            onRenderIcon={() => <FullScreenIcon />}
            toggle
          />
        </div>
      </div>
      <div className={styles.chartContainer}>
        <Suspense fallback={<ChartFallback />}>
          {!dataIsReady && <ChartFallback />}
          <VersionDownloadChart
            className={!disabled ? styles.visibleChart : styles.invisibleChart}
            fullScreen={fullScreen}
            history={dataIsReady ? history : undefined}
            maxDaysShown={maxDays(versionFilter)}
            maxVersionsShown={maxVersionsShown ?? 4}
            popularDuring={popularDuring(versionFilter)}
            theme={theme}
            tickInterval={tickInterval(versionFilter)}
            tooltipTheme={tooltipTheme}
            unit={showAsPercentage ? "percentage" : "totalDownloads"}
            versionLabeler={packageDesc.versionLabeler}
          />
        </Suspense>
      </div>
    </CardFrame>
  );
};

const CardFrame: React.FC<{
  children: React.ReactNode;
  disabled: boolean;
  fullScreen?: boolean;
  theme: ITheme;
}> = ({ children, disabled, fullScreen, theme }) => {
  return (
    <ThemeProvider
      className={`${styles.cardFrame} ${
        disabled ? styles.disabledCardFrame : ""
      } ${fullScreen ? styles.fullScreenCardFrame : ""}`}
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
