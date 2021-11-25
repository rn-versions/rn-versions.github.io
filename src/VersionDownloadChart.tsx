import React from "react";

import generateColor from "./generateColor";
import styles from "./VersionDownloadChart.styles";

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
import HistoryReader, { HistoryDatePoint } from "./HistoryReader";
import { PackageIdentifier } from "./PackageDescription";

export type MeasurementPoint = { date: number; version: string; count: number };

export type VersionDownloadChartProps = {
  /**
   * Which package to show data for
   */
  identifier: PackageIdentifier;

  /**
   * Number of versions shown at once, with the most popular versions always
   * showing up
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
   * Which versions to show in the graph. Defaults to only major versions
   */
  versionFilter?: "major" | "patch" | "prerelease";

  /**
   * Allows transforming raw measurements to a different unit
   */
  measurementTransform?: "totalDownloads" | "percentage";
};

const VersionDownloadChart: React.FC<VersionDownloadChartProps> = ({
  identifier,
  maxVersionsShown,
  versionFilter,
  showLegend,
  showTooltip,
  measurementTransform,
}) => {
  const rawDatapoints = createDownloadMeasurementPoints(
    identifier,
    versionFilter || "major"
  );

  const topRawDataPoints = maxVersionsShown
    ? filterTopN(rawDatapoints, maxVersionsShown)
    : rawDatapoints;

  const datapoints =
    measurementTransform === "percentage"
      ? transformToPercentage(topRawDataPoints)
      : topRawDataPoints;

  const dateTimeFormat = new Intl.DateTimeFormat("en-US");

  const allVersionsSet = new Set(datapoints.map((p) => p.version));
  const allVersionsArr = [...allVersionsSet];

  const chartAreas = allVersionsArr.map((v) => {
    const color = generateColor(v);

    return (
      <Area
        {...styles.area}
        name={v}
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
      >
        <h4
          style={{
            color: "#888",
          }}
        >
          No data available
        </h4>
      </div>
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
          <Tooltip
            {...styles.tooltip}
            labelFormatter={(unixTime) =>
              dateTimeFormat.format(new Date(unixTime))
            }
            formatter={(count, _rnVersion, entry) => {
              const totalCount = (
                Object.values(entry.payload.versionCounts) as number[]
              ).reduce((a, b) => a + b, 0);

              const pct = Math.round(((count as number) / totalCount) * 100);
              return `${count.toLocaleString()} (${pct}%)`;
            }}
          />
        )}

        {showLegend !== false && <Legend {...styles.legend} />}

        {chartAreas}
      </AreaChart>
    </ResponsiveContainer>
  );
};

/**
 * Create the point representation of downloads to show
 */
function createDownloadMeasurementPoints(
  identifier: PackageIdentifier,
  versionFilter: "major" | "patch" | "prerelease"
): MeasurementPoint[] {
  const historyReader = new HistoryReader(identifier);

  let historyPoints: HistoryDatePoint[] = [];
  switch (versionFilter) {
    case "major":
      historyPoints = historyReader.getMajorDatePoints();
      break;
    case "patch":
      historyPoints = historyReader.getPatchDatePoints();
      break;
    case "prerelease":
      historyPoints = historyReader.getPrereleaseDataPoints();
      break;
  }

  const dataPoints: MeasurementPoint[] = [];

  for (const datePoint of historyPoints) {
    for (const [version, count] of Object.entries(datePoint.versions)) {
      dataPoints.push({ date: datePoint.date.getTime(), version, count });
    }
  }

  return dataPoints;
}

function transformToPercentage(points: MeasurementPoint[]): MeasurementPoint[] {
  const totalCountByDate: Record<string, number | undefined> = {};
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
  historyPoints: MeasurementPoint[],
  n: number
): MeasurementPoint[] {
  const allVersions: Array<{ version: string; count: number }> = [];

  for (const point of historyPoints) {
    const existingCount = allVersions.find((v) => v.version === point.version);
    if (existingCount) {
      existingCount.count += point.count;
    } else {
      allVersions.push({ version: point.version, count: point.count });
    }
  }

  if (allVersions.length <= n) {
    return [...historyPoints];
  }

  const includedVersions = allVersions
    .sort((a, b) => b.count - a.count)
    .slice(0, Math.min(allVersions.length, n))
    .map((v) => v.version);

  return historyPoints.filter((point) =>
    includedVersions.includes(point.version)
  );
}

export default VersionDownloadChart;
