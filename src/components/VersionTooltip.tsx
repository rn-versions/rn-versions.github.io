import styles from "../styles/VersionTooltip.module.scss";
import { ITheme, Text, ThemeContext, ThemeProvider } from "@fluentui/react";

import { TooltipProps } from "recharts";
import { Unit } from "./VersionDownloadChart";
import type { Payload } from "recharts/types/component/DefaultTooltipContent";
import { colorForHue } from "../chartColor";

type DateTooltipProps = TooltipProps<number, number>;

const formatPercentage = new Intl.NumberFormat("en-US", {
  style: "percent",
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
}).format;

const formatRoundedPercentage = new Intl.NumberFormat("en-US", {
  style: "percent",
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
}).format;

function formatCount(
  count: number,
  entry: Payload<number, number>,
  measurementTransform: Unit | undefined
): string {
  const { versionCounts } = entry.payload as {
    versionCounts: Record<string, number>;
  };

  const totalCount = Object.values(versionCounts).reduce((a, b) => a + b, 0);

  const pct = count / totalCount;

  if (measurementTransform === "percentage") {
    return formatPercentage(pct);
  } else {
    return `${count.toLocaleString()} (${formatRoundedPercentage(pct)})`;
  }
}

function formatLabel(unixTime: number): string {
  return new Date(unixTime).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function createTooltipContent(
  props: VersionProps
): React.FC<DateTooltipProps> {
  return (tooltipProps) => (
    <VersionTooltipContent {...props} {...tooltipProps} />
  );
}

export type VersionProps = {
  versionHues: Record<string, number>;
  unit?: Unit;
  theme?: ITheme;
  hoveredVersion?: string | null;
};

export const VersionTooltipContent: React.FC<
  VersionProps & DateTooltipProps
> = ({ label, payload, unit, versionHues, theme, hoveredVersion }) => {
  const reversedItems = [...(payload ?? [])];
  reversedItems.reverse();

  return (
    <ThemeContext.Consumer>
      {(contextTheme) => {
        theme = theme ?? contextTheme;

        const versionsList = reversedItems.length > 0 && (
          <ul className={styles.versionsList}>
            {reversedItems.map((entry, i) => {
              const colorChipColor = theme
                ? colorForHue(
                    versionHues[entry.name!],
                    theme.isInverted
                      ? { variant: "dark", targetLuminance: "contrasts-dark" }
                      : { variant: "light", targetLuminance: "contrasts-light" }
                  )
                : entry.color;

              const formattedValue = formatCount(entry.value!, entry, unit);

              return (
                <li key={i} className={styles.versionsListItem}>
                  <Text
                    variant="small"
                    className={styles.versionLabel}
                    style={{
                      color: colorChipColor,
                      fontWeight:
                        hoveredVersion === entry.name ? "bold" : "normal",
                    }}
                  >
                    {entry.name}
                  </Text>
                  <Text
                    variant="small"
                    className={styles.versionCount}
                    style={{
                      fontWeight:
                        hoveredVersion === entry.name ? "bold" : "normal",
                    }}
                  >
                    {formattedValue}
                  </Text>
                </li>
              );
            })}
            <li key="sum" className={styles.versionsListItem}>
              <Text variant="small" className={styles.versionLabel}>
                Total
              </Text>
              <Text variant="small" className={styles.versionCount}>
                {reversedItems
                  .reduce((prev, curr) => prev + (curr.value || 0), 0)
                  .toLocaleString()}
              </Text>
            </li>
          </ul>
        );

        return (
          <ThemeProvider
            theme={theme}
            className={styles.frame}
            style={{
              backgroundColor: (theme ?? contextTheme)?.semanticColors
                .bodyBackground,
            }}
          >
            <Text className={styles.date} variant="medium">
              {formatLabel(label!)}
            </Text>
            {versionsList}
          </ThemeProvider>
        );
      }}
    </ThemeContext.Consumer>
  );
};
