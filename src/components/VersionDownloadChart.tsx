import React, { useState } from "react";

import generateHue, { AvoidToken, colorForHue } from "../chartColor";
import styleProps from "../styles/VersionDownloadChart.styles";
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
import type { HistoryPointCollection, HistoryPoint } from "../HistoryReader";
import { ITheme } from "@fluentui/react";

import { createPortal } from "react-dom";
import { createLegendContent } from "./VersionLegend";

export type Unit = "totalDownloads" | "percentage";

export type VersionLabeler = (version: string) => string;

export type VersionDownloadChartProps = {
  /**
   * Points to render
   */
  history: HistoryPointCollection;

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
  history,
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
  const styles = styleProps({ theme, unit });

  const [legendElement, setLegendElement] = useState<HTMLDivElement>();

  const filteredHistory = React.useMemo(
    () => filterTopN(history, maxVersionsShown ?? 5, maxDaysShown ?? 30),
    [history, maxDaysShown, maxVersionsShown]
  );

  const dateTicks = React.useMemo(
    () =>
      calculateDateTicks(
        filteredHistory.points.map((p) => p.date),
        maxTicks ?? 6
      ),
    [filteredHistory.points, maxTicks]
  );

  const versionHues = React.useMemo(() => {
    const hues: Record<string, number> = {};
    let lastAvoidToken: AvoidToken | undefined;

    filteredHistory.versions.forEach((v) => {
      const { hue, avoidToken } = generateHue(v, lastAvoidToken);
      lastAvoidToken = avoidToken;
      hues[versionLabeler ? versionLabeler(v) : v] = hue;
    });

    return hues;
  }, [filteredHistory.versions, versionLabeler]);

  const chartAreas = React.useMemo(
    () =>
      filteredHistory.versions
        .map((v) => {
          const name = versionLabeler ? versionLabeler(v) : v;
          const hue = versionHues[name];
          const colorVariant = theme?.isInverted ? "dark" : "light";
          const fill = colorForHue(hue, {
            variant: colorVariant,
            targetLuminance: theme?.isInverted
              ? "contrasts-light"
              : "contrasts-dark",
          });
          return { name, hue, fill, dataKey: v };
        })
        .reverse(),
    [filteredHistory.versions, theme?.isInverted, versionHues, versionLabeler]
  );

  if (filteredHistory.points.length === 0) {
    return null;
  }

  const VersionLegend = React.memo(createLegendContent({ versionHues }));

  return (
    <div>
      <ResponsiveContainer {...styles.responsiveContainer}>
        <AreaChart
          {...styles.areaChart}
          data={filteredHistory.points}
          reverseStackOrder
          stackOffset={unit === "percentage" ? "expand" : "none"}
        >
          <XAxis
            {...styles.xAxis}
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
            ticks={dateTicks}
          />
          <YAxis
            {...styles.yAxis}
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
              {...styles.tooltip}
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

          {chartAreas.map(({ name, fill, dataKey }) => (
            <Area
              {...styles.area}
              name={name}
              key={name}
              dataKey={(datapoint) => datapoint.versionCounts[dataKey]}
              stackId="1"
              fill={fill}
              fillOpacity={1}
            />
          ))}

          <CartesianGrid {...styles.grid} />
        </AreaChart>
      </ResponsiveContainer>
      <div ref={(el) => setLegendElement(el ?? undefined)} />
    </div>
  );
};

function calculateDateTicks(dates: number[], maxTicks: number): number[] {
  if (maxTicks === 0) {
    return [];
  }

  const first = dates[0];
  const last = dates[dates.length - 1];

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

  for (const date of dates) {
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
  history: HistoryPointCollection,
  n: number,
  windowInDays: number
): HistoryPointCollection {
  if (history.points.length === 0) {
    return history;
  }

  const latestDate = history.points[history.points.length - 1].date;
  const latestDay = new Date(latestDate).setHours(0, 0, 0, 0);

  const earliestAllowableDate = latestDay - windowInDays * 24 * 60 * 60 * 1000;
  const versionsInWindow: { [version: string]: number | undefined } = {};

  for (const point of history.points) {
    if (point.date >= earliestAllowableDate) {
      for (const [version, count] of Object.entries(point.versionCounts)) {
        const existingCount = versionsInWindow[version] ?? 0;
        versionsInWindow[version] = existingCount + count!;
      }
    }
  }

  const topVersions = new Set(
    Object.entries(versionsInWindow)
      .sort((a, b) => a[1]! - b[1]!)
      .slice(-n)
      .map(([version, _count]) => version)
  );

  const filteredPoints: HistoryPoint[] = [];

  for (const point of history.points) {
    if (point.date >= earliestAllowableDate) {
      const topVersionsOnDate = Object.keys(point.versionCounts).filter((v) =>
        topVersions.has(v)
      );

      if (topVersionsOnDate.length > 0) {
        const filteredPoint: HistoryPoint = {
          date: point.date,
          versionCounts: {},
        };

        for (const topVersion of topVersionsOnDate) {
          filteredPoint.versionCounts[topVersion] =
            point.versionCounts[topVersion];
        }

        filteredPoints.push(filteredPoint);
      }
    }
  }

  return {
    versions: history.versions.filter((v) => topVersions.has(v)),
    points: filteredPoints,
  };
}

export default VersionDownloadChart;
