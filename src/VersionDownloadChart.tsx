import React from "react";

import generateColor, { AvoidToken } from "./generateColor";
import styles from "./VersionDownloadChart.styles";
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
import type { HistoryPoint } from "./HistoryReader";

export type MeasurementTransform = "totalDownloads" | "percentage";

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
   * Allows transforming raw measurements to a different unit
   */
  measurementTransform?: MeasurementTransform;

  /**
   * Allows relabeling versions
   */
  versionLabeler?: VersionLabeler;
};

const VersionDownloadChart: React.FC<VersionDownloadChartProps> = ({
  historyPoints,
  maxDaysShown,
  maxVersionsShown,
  showLegend,
  showTooltip,
  measurementTransform,
  versionLabeler,
}) => {
  const topRawDataPoints = maxVersionsShown
    ? filterTopN(historyPoints, maxVersionsShown, maxDaysShown ?? 30)
    : historyPoints;

  const datapoints =
    measurementTransform === "percentage"
      ? transformToPercentage(topRawDataPoints)
      : topRawDataPoints;

  const dateTimeFormat = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
  });

  const allVersionsSet = new Set(datapoints.map((p) => p.version));
  const allVersionsArr = [...allVersionsSet];

  let latAvoidToken: AvoidToken | undefined = undefined;
  const chartAreas = allVersionsArr.map((v, i) => {
    const { color, avoidToken } = generateColor(v, latAvoidToken);
    latAvoidToken = avoidToken;

    return (
      <Area
        {...styles.area}
        name={versionLabeler ? versionLabeler(v) : v}
        key={v}
        dataKey={(datapoint) => datapoint.versionCounts[v]}
        stackId="1"
        stroke={color}
        fill={color}
      />
    );
  });

  const data: Array<{ date: number; versionCounts: Record<string, number> }> =
    [];
  for (const version of allVersionsArr) {
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
        style={{
          height: styles.responsiveContainer.height,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      ></div>
    );
  }

  return (
    <ResponsiveContainer {...styles.responsiveContainer}>
      <AreaChart data={data}>
        <XAxis
          {...styles.xAxis}
          dataKey="date"
          type="number"
          interval="preserveStartEnd"
          scale="time"
          domain={["dataMin", "dataMax"]}
          tickFormatter={(unixTime) =>
            dateTimeFormat.format(new Date(unixTime))
          }
        />
        <YAxis
          {...styles.yAxis}
          type="number"
          {...(measurementTransform === "percentage"
            ? {
                domain: [0, 1],
                tickFormatter: (count) => `${Math.round(count * 100)}%`,
              }
            : {
                domain: ["auto", "auto"],
                tickFormatter: (count) => count.toLocaleString(),
              })}
        />
        <CartesianGrid {...styles.grid} />

        {showTooltip !== false && (
          <Tooltip content={createTooltipContent({ measurementTransform })} />
        )}
        {showLegend !== false && <Legend {...styles.legend} />}

        {chartAreas}
      </AreaChart>
    </ResponsiveContainer>
  );
};

function transformToPercentage(points: HistoryPoint[]): HistoryPoint[] {
  const totalCountByDate: Record<number, number | undefined> = {};

  for (const point of points) {
    const prevTotal = totalCountByDate[point.date] ?? 0;
    totalCountByDate[point.date] = prevTotal + point.count;
  }

  return points.map((point) => ({
    ...point,
    count: point.count / totalCountByDate[point.date]!,
  }));
}

function filterTopN(
  historyPoints: HistoryPoint[],
  n: number,
  windowInDays: number
): HistoryPoint[] {
  let latestDate: number = 0;
  for (const point of historyPoints) {
    latestDate = Math.max(latestDate, point.date);
  }

  const earliestAllowableDate = latestDate - windowInDays * 24 * 60 * 60 * 1000;
  const versionsInWindow: Array<{ version: string; count: number }> = [];

  for (const point of historyPoints) {
    if (point.date >= earliestAllowableDate) {
      const existingCount = versionsInWindow.find(
        (v) => v.version === point.version
      );
      const newCount = point.date < earliestAllowableDate ? 0 : point.count;

      if (existingCount) {
        existingCount.count += newCount;
      } else {
        versionsInWindow.push({ version: point.version, count: newCount });
      }
    }
  }

  const topVersions = versionsInWindow
    .sort((a, b) => a.count - b.count)
    .slice(-n)
    .map((v) => v.version);

  const topVersionsInOrder: string[] = [];
  for (const point of historyPoints) {
    if (
      topVersions.includes(point.version) &&
      !topVersionsInOrder.includes(point.version)
    ) {
      topVersionsInOrder.push(point.version);
    }
  }

  const filteredPoints: HistoryPoint[] = [];
  for (const point of historyPoints) {
    if (topVersions.includes(point.version)) {
      filteredPoints.push(point);
    }
  }

  const pointsByDate: Map<
    number,
    { version: string; count: number }[] | undefined
  > = new Map();
  for (const point of filteredPoints) {
    const last = pointsByDate.get(point.date) ?? [];
    pointsByDate.set(point.date, [...last, point]);
  }

  const datesAscending = [...pointsByDate.keys()].sort();
  const pointsWithZero: HistoryPoint[] = [];

  for (const date of datesAscending) {
    if (date < earliestAllowableDate) {
      continue;
    }

    for (const topVersion of topVersionsInOrder) {
      const existingPoint = pointsByDate
        .get(date)!
        .find((p) => p.version === topVersion);
      if (existingPoint) {
        pointsWithZero.push({ date, ...existingPoint });
      } else {
        pointsWithZero.push({ date, version: topVersion, count: 0 });
      }
    }
  }

  return pointsWithZero;
}

export default VersionDownloadChart;
