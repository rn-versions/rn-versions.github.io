import React, { useState } from "react";

import generateHue, { AvoidToken, colorForHue } from "../chartColor";
import styleProps from "../styles/VersionDownloadChart.styles";
import styles from "../styles/VersionDownloadChart.module.scss";
import { createTooltipContent } from "./VersionTooltip";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { HistoryPoint } from "../HistoryReader";
import { ITheme } from "@fluentui/react";

import { createPortal } from "react-dom";
import { createLegendContent } from "./VersionLegend";

export type Unit = "totalDownloads" | "percentage";

export type VersionLabeler = (version: string) => string;

export type VersionDownloadChartProps = {
  /**
   * Points to render
   */
  historyPoints: HistoryPoint[];

  /**
   * Maximum duration the graph will show, in days
   */
  maxDaysShown?: number;

  /**
   * Maximum total ticks to show for dates/times
   */
  maxTicks?: number;

  /**
   * Maximum separate versions show, attempting to show most popular versions.
   */
  maxVersionsShown?: number;

  /**
   * Whether to show the legend (defaults to true)
   */
  showLegend?: boolean;

  /**
   * Whether to show the tooltip (defaults to true)
   */
  showTooltip?: boolean;

  /**
   * The unit to show in the Y axis
   */
  unit?: Unit;

  /**
   * Allows relabeling versions
   */
  versionLabeler?: VersionLabeler;

  /**
   * Theme, used to ensure we have enough contrast.
   */
  theme?: ITheme;

  /**
   * Override the default provided theme for the tooltip
   */
  tooltipTheme?: ITheme;
};

const VersionDownloadChart: React.FC<VersionDownloadChartProps> = ({
  historyPoints,
  maxDaysShown,
  maxVersionsShown,
  maxTicks,
  showLegend,
  showTooltip,
  unit,
  versionLabeler,
  theme,
  tooltipTheme,
}) => {
  const jsStyles = styleProps({ theme, unit });

  const [legendElement, setLegendElement] = useState<HTMLDivElement | null>(
    null
  );

  maxDaysShown = maxDaysShown ?? 30;
  const datapoints = maxVersionsShown
    ? filterTopN(historyPoints, maxVersionsShown, maxDaysShown)
    : historyPoints;

  const allVersions = [...new Set(datapoints.map((p) => p.version))];

  const versionHues: Record<string, number> = {};
  // Generate color from earlier versions to later
  let lastAvoidToken: AvoidToken | undefined = undefined;
  const areas = [...allVersions]
    .map((v) => {
      const { hue, avoidToken } = generateHue(v, lastAvoidToken);
      lastAvoidToken = avoidToken;
      const name = versionLabeler ? versionLabeler(v) : v;
      versionHues[name] = hue;
      return { name, hue, dataKey: v };
    })
    .reverse();

  const data: Array<{
    date: number;
    versionCounts: Record<string, number>;
  }> = [];

  for (const version of allVersions) {
    for (const measurePoint of datapoints) {
      if (measurePoint.version === version) {
        const datePoint = data.find((p) => p.date === measurePoint.date);
        if (datePoint) {
          datePoint.versionCounts[version] = measurePoint.count;
        } else {
          data.push({
            date: measurePoint.date,
            versionCounts: { [version]: measurePoint.count },
          });
        }
      }
    }
  }

  if (datapoints.length === 0) {
    return (
      <div
        className={styles.placeholderContainer}
        style={{
          height: jsStyles.responsiveContainer.height,
        }}
      ></div>
    );
  }

  const VersionLegend = createLegendContent({ versionHues });
  const colorVariant = theme?.isInverted ? "dark" : "light";

  return (
    <div className={styles.chartContainer}>
      <div className={styles.chartFill}>
        <ResponsiveContainer {...jsStyles.responsiveContainer}>
          <AreaChart
            {...jsStyles.areaChart}
            data={data}
            reverseStackOrder
            stackOffset={unit === "percentage" ? "expand" : "none"}
          >
            <XAxis
              {...jsStyles.xAxis}
              dataKey="date"
              type="number"
              scale="time"
              domain={["dataMin", "dataMax"]}
              tickFormatter={(unixTime) =>
                new Date(unixTime).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }
              interval={0}
              ticks={calculateDateTicks(
                datapoints.map((p) => p.date),
                maxTicks ?? 6
              )}
            />
            <YAxis
              {...jsStyles.yAxis}
              type="number"
              {...(unit === "percentage"
                ? {
                    domain: [0, 1],
                    tickFormatter: (count) => `${Math.round(count * 100)}%`,
                  }
                : {
                    domain: ["auto", "auto"],
                    tickFormatter: (count) => count.toLocaleString(),
                  })}
            />

            {showTooltip !== false && (
              <Tooltip
                {...jsStyles.tooltip}
                content={createTooltipContent({
                  versionHues,
                  unit,
                  theme: tooltipTheme,
                })}
              />
            )}
            {showLegend !== false && legendElement && (
              <Legend
                height={0}
                content={({ payload }) =>
                  createPortal(
                    payload && <VersionLegend payload={payload} />,
                    legendElement
                  )
                }
              />
            )}

            {areas.map(({ name, hue, dataKey }) => (
              <Area
                {...jsStyles.area}
                name={name}
                key={name}
                dataKey={(datapoint) => datapoint.versionCounts[dataKey]}
                stackId="1"
                fill={colorForHue(hue, { variant: colorVariant })}
                fillOpacity={1}
              />
            ))}

            <CartesianGrid {...jsStyles.grid} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div ref={(el) => setLegendElement(el)} className={styles.legend} />
    </div>
  );
};

function calculateDateTicks(dates: number[], maxTicks: number): number[] {
  if (maxTicks === 0) {
    return [];
  }

  const sortedDates = dates.sort();

  const first = sortedDates[0];
  const last = sortedDates[sortedDates.length - 1];

  if (maxTicks === 1) {
    return [first];
  }

  if (maxTicks === 2) {
    return [first, last];
  }

  const dataDuration = last - first;
  const dayDuration = 24 * 60 * 60 * 1000;
  const weekDuration = 7 * dayDuration;

  const maxInteriorTicks = maxTicks - 1;
  let tickInterval = weekDuration;
  while (Math.floor(dataDuration / tickInterval) > maxInteriorTicks) {
    tickInterval *= 2;
  }

  const ticks = new Set([first]);
  let nextTick = fromDayStart(first, tickInterval);

  for (const date of sortedDates) {
    if (date >= nextTick) {
      ticks.add(date);
      nextTick = fromDayStart(date, tickInterval);
    }
  }

  return [...ticks];
}

function fromDayStart(date: number, duration: number): number {
  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);

  return dayStart.getTime() + duration;
}

function filterTopN(
  historyPoints: HistoryPoint[],
  n: number,
  windowInDays: number
): HistoryPoint[] {
  if (historyPoints.length === 0) {
    return [];
  }

  const latestDate = historyPoints[historyPoints.length - 1].date;
  const latestDay = new Date(latestDate).setHours(0, 0, 0, 0);

  const earliestAllowableDate = latestDay - windowInDays * 24 * 60 * 60 * 1000;
  const versionsInWindow: { [version: string]: number | undefined } = {};

  for (const point of historyPoints) {
    if (point.date >= earliestAllowableDate) {
      const existingCount = versionsInWindow[point.version] ?? 0;
      versionsInWindow[point.version] = existingCount + point.count;
    }
  }

  const topVersions = new Set(
    Object.entries(versionsInWindow)
      .sort((a, b) => a[1]! - b[1]!)
      .slice(-n)
      .map(([version, _count]) => version)
  );

  return historyPoints.filter(
    (p) => p.date >= earliestAllowableDate && topVersions.has(p.version)
  );
}

export default VersionDownloadChart;
