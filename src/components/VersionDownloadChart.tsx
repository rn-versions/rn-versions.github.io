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
import VersionLegend from "./VersionLegend";

export type Unit = "totalDownloads" | "percentage";

export type VersionLabeler = (version: string) => string;

export type VersionDownloadChartProps = {
  /**
   * Class wrapping the chart
   */
  className?: string;

  /**
   * Whether to show the chart in full screen
   */
  fullScreen?: boolean;

  /**
   * Points to render
   */
  history?: HistoryPointCollection;

  /**
   * Maximum duration the graph will show, in days
   */
  maxDaysShown?: number;

  /**
   * The number of days between ticks. Or "month" for ticks at the start of each month.
   */
  tickInterval?: number | "month";

  /**
   * The maximum number of "popular" versions show (see below).
   */
  maxVersionsShown?: number;

  /**
   * Controls how "popular" versions are selected
   *
   * "all" (Default): Examine and rank all versions that exist in the time-span
   * shown, ranking by sum of downloads/week measurements
   *
   * "most-recent": Select versions from the most recent polling-time, ranking
   * by downloads/week
   */
  popularDuring?: "all" | "most-recent";

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
  className,
  fullScreen,
  history,
  maxDaysShown,
  maxVersionsShown,
  popularDuring,
  showLegend,
  showTooltip,
  theme,
  tickInterval = 7,
  tooltipTheme,
  unit,
  versionLabeler,
}) => {
  const styles = styleProps({ theme, unit });

  const [legendElement, setLegendElement] = useState<HTMLDivElement>();
  const [hiddenSeries, setHiddenSeries] = useState<string[]>([]);

  const filteredHistory = React.useMemo(
    () =>
      filterTopN(
        history,
        maxVersionsShown ?? 5,
        maxDaysShown ?? 30,
        popularDuring
      ),
    [history, maxDaysShown, maxVersionsShown, popularDuring]
  );

  const versionHues = React.useMemo(() => {
    if (!filteredHistory) {
      return {};
    }

    const hues: Record<string, number> = {};
    let lastAvoidToken: AvoidToken | undefined;

    filteredHistory.versions.forEach((v) => {
      const { hue, avoidToken } = generateHue(v, lastAvoidToken);
      lastAvoidToken = avoidToken;
      hues[versionLabeler ? versionLabeler(v) : v] = hue;
    });

    return hues;
  }, [filteredHistory, versionLabeler]);

  const chartAreas = React.useMemo(
    () =>
      !filteredHistory
        ? []
        : filteredHistory.versions
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
    [filteredHistory, theme?.isInverted, versionHues, versionLabeler]
  );

  const lastDateIndex = (filteredHistory?.points.length ?? 0) - 1;
  const firstDate = filteredHistory?.points[0]?.date;
  const lastDate = filteredHistory?.points[lastDateIndex]?.date;

  const ticks: number[] = [];
  if (tickInterval === "month") {
    if (firstDate && lastDate) {
      const currentDate = new Date(firstDate);
      currentDate.setMonth(currentDate.getMonth() + 1);
      currentDate.setDate(1);
      currentDate.setHours(0, 0, 0, 0);

      while (+currentDate <= lastDate) {
        ticks.push(currentDate.getTime());
        currentDate.setMonth(currentDate.getMonth() + 1);
      }
    }
  } else {
    const msInDay = 1000 * 60 * 60 * 24;
    for (
      let date = firstDate ?? 0;
      date <= (lastDate ?? 0);
      date += msInDay * tickInterval
    ) {
      ticks.push(date);
    }
  }

  return (
    <div className={className}>
      <ResponsiveContainer
        {...styles[
          fullScreen ? "responsiveContainerFullScreen" : "responsiveContainer"
        ]}
      >
        <AreaChart
          {...styles.areaChart}
          data={filteredHistory?.points}
          reverseStackOrder
          stackOffset={unit === "percentage" ? "expand" : "none"}
        >
          <XAxis
            {...styles.xAxis}
            ticks={ticks}
            dataKey="date"
            type="number"
            scale="time"
            domain={["dataMin", "dataMax"]}
            tickFormatter={(unixTime) =>
              new Date(unixTime).toLocaleDateString(
                "en-US",
                tickInterval === "month"
                  ? {
                      month: "short",
                      year: "numeric",
                    }
                  : {
                      month: "short",
                      day: "numeric",
                    }
              )
            }
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
                  tickFormatter: formatDownloadCountTicks,
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
                  payload && (
                    <VersionLegend
                      payload={payload}
                      versionHues={versionHues}
                      hiddenSeries={hiddenSeries}
                      setHiddenSeries={setHiddenSeries}
                    />
                  ),
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
              dataKey={(datapoint) =>
                hiddenSeries.includes(
                  versionLabeler ? versionLabeler(dataKey) : dataKey
                )
                  ? undefined
                  : datapoint.versionCounts[dataKey]
              }
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

function formatDownloadCountTicks(count: number) {
  if (!count) {
    return "";
  } else if (count >= 1000000) {
    return `${(count / 1000000).toLocaleString()} m`;
  } else if (count >= 1000) {
    return `${(count / 1000).toLocaleString()} k`;
  } else {
    return count.toLocaleString();
  }
}

function filterTopN(
  history: HistoryPointCollection | undefined,
  n: number,
  windowInDays: number,
  popularDuring?: "all" | "most-recent"
): HistoryPointCollection | undefined {
  if (!history || history.points.length === 0) {
    return history;
  }

  const latestDate = history.points[history.points.length - 1].date;
  const latestDay = new Date(latestDate).setHours(0, 0, 0, 0);
  const earliestAllowableDate = latestDay - windowInDays * 24 * 60 * 60 * 1000;

  const popularVersions =
    popularDuring === "most-recent"
      ? versionsInWindow(history, latestDate)
      : versionsInWindow(history, earliestAllowableDate);

  const topVersions = new Set(
    Object.entries(popularVersions)
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

function versionsInWindow(
  history: HistoryPointCollection,
  earliestAllowableDate: number
): { [version: string]: number | undefined } {
  const versions: { [version: string]: number | undefined } = {};

  for (const point of history.points) {
    if (point.date >= earliestAllowableDate) {
      for (const [version, count] of Object.entries(point.versionCounts)) {
        const existingCount = versions[version] ?? 0;
        versions[version] = existingCount + count!;
      }
    }
  }

  return versions;
}

export default VersionDownloadChart;
