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
import HistoryReader from "./HistoryReader";
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
   * Whether to show just maor versions. Defaults to true.
   */
  onlyMajorVersions?: boolean;
};

const VersionDownloadChart: React.FC<VersionDownloadChartProps> = ({
  identifier,
  maxVersionsShown,
  onlyMajorVersions,
}) => {
  const datapoints = createDownloadMeasurementPoints(
    identifier,
    onlyMajorVersions
  );
  const dateTimeFormat = new Intl.DateTimeFormat("en-US");
  const filteredDataPoints = maxVersionsShown
    ? filterTopN(datapoints, maxVersionsShown)
    : datapoints;
  const allVersionsSet = new Set(filteredDataPoints.map((p) => p.version));
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
    for (const measurePoint of filteredDataPoints) {
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

  return (
    <ResponsiveContainer {...styles.responsiveContainer}>
      <AreaChart data={data}>
        <CartesianGrid {...styles.grid} />
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
          tickFormatter={(count) => count.toLocaleString()}
        />
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
        <Legend {...styles.legend} />
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
  onlyMajorVersions: boolean | undefined
): MeasurementPoint[] {
  const historyReader = new HistoryReader(identifier);

  const historyPoints =
    onlyMajorVersions === false
      ? historyReader.getPatchDatePoints()
      : historyReader.getMajorDatePoints();

  const dataPoints: MeasurementPoint[] = [];

  for (const datePoint of historyPoints) {
    for (const [version, count] of Object.entries(datePoint.versions)) {
      dataPoints.push({ date: datePoint.date.getTime(), version, count });
    }
  }

  return dataPoints;
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
