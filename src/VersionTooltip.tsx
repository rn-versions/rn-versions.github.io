import React, { useEffect, useState } from "react";
import styles from "./VersionTooltip.module.scss";
import { Text, ThemeContext } from "@fluentui/react";

import { LabelFormatter, TooltipPayload, TooltipProps } from "recharts";
import { MeasurementTransform } from "./VersionDownloadChart";

function formatCount(
  count: number,
  entry: TooltipPayload,
  measurementTransform: MeasurementTransform | undefined
): string {
  const totalCount = (
    Object.values(entry.payload.versionCounts) as number[]
  ).reduce((a, b) => a + b, 0);

  const pct = ((count as number) / totalCount) * 100;

  if (measurementTransform === "percentage") {
    return `${Math.round(pct * 100) / 100}%`;
  } else {
    return `${count.toLocaleString()} (${Math.round(pct)}%)`;
  }
}

const formatLabel: LabelFormatter = (unixTime) =>
  new Date(unixTime).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
  });

export function createTooltipContent(
  props: VersionProps
): React.FC<TooltipProps> {
  return (tooltipProps) => (
    <VersionTooltipContent {...props} {...tooltipProps} />
  );
}

export type VersionProps = {
  measurementTransform?: MeasurementTransform;
};

export const VersionTooltipContent: React.FC<VersionProps & TooltipProps> = ({
  active,
  label,
  payload,
  measurementTransform,
}) => {
  const [hidden, setHidden] = useState(false);
  const [lastActive, setLastActive] = useState(active);
  const [lastLabel, setLastLabel] = useState(label);

  // We want to hide the tooltip on scroll, to not take up space on mobile,
  //which recharts will not normally do.
  useEffect(() => {
    if (lastActive !== active) {
      if (active && !lastActive) {
        setHidden(false);
      }

      setLastActive(active);
    }

    if (lastLabel !== label) {
      setHidden(false);
      setLastLabel(label);
    }
  }, [lastActive, active, lastLabel, label]);

  useEffect(() => {
    const onScroll = () => {
      setHidden(true);
    };
    document.addEventListener("scroll", onScroll);
    return () => document.removeEventListener("scroll", onScroll);
  });

  const reversedItems = [...(payload ?? [])];
  reversedItems.reverse();

  const versionsList = reversedItems.length > 0 && (
    <ul className={styles.versionsList}>
      {reversedItems.map((entry, i) => {
        const formattedValue = formatCount(
          entry.value as number,
          entry,
          measurementTransform
        );

        return (
          <li key={i} className={styles.versionsListItem}>
            <div
              className={styles.versionColorIndicator}
              style={{ backgroundColor: entry.color || "#000" }}
            />
            <Text className={styles.versionLabel}>{entry.name}</Text>
            <Text className={styles.versionCount}>{formattedValue}</Text>
          </li>
        );
      })}
    </ul>
  );

  return (
    <ThemeContext.Consumer>
      {(theme) => (
        <div
          className={styles.frame}
          style={
            hidden
              ? { display: "none" }
              : { backgroundColor: theme?.semanticColors.bodyBackground }
          }
        >
          <Text className={styles.date} variant="medium">
            {formatLabel(label!)}
          </Text>
          {versionsList}
        </div>
      )}
    </ThemeContext.Consumer>
  );
};
