import type {
  AreaProps,
  CartesianGridProps,
  LegendProps,
  ResponsiveContainerProps,
  TooltipProps,
  XAxisProps,
  YAxisProps,
} from "recharts";

export type VersionDownloadChartStyle = {
  area: Partial<AreaProps>;
  responsiveContainer: Partial<ResponsiveContainerProps>;
  grid: Partial<CartesianGridProps>;
  xAxis: Partial<XAxisProps>;
  yAxis: Partial<YAxisProps>;
  tooltip: Partial<TooltipProps>;
  legend: Partial<LegendProps>;
};

const styles: VersionDownloadChartStyle = {
  area: {
    isAnimationActive: false,
  },
  responsiveContainer: {
    width: "100%",
    height: 250,
  },
  grid: {
    strokeDasharray: "3 3",
  },
  xAxis: {
    height: 32,
    tickLine: false,
    tickMargin: 10,
    minTickGap: 32,
  },
  yAxis: {
    width: 72,
    tickLine: false,
    tickMargin: 10,
    tickSize: 0,
  },
  tooltip: {},
  legend: {
    height: 24,
    wrapperStyle: {
      position: "absolute",
      bottom: 0,
    },
  },
};

export default styles;
