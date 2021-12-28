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
  area: Pick<AreaProps, "isAnimationActive">;
  responsiveContainer: Pick<ResponsiveContainerProps, "width" | "height">;
  grid: Pick<CartesianGridProps, "strokeDasharray">;
  xAxis: Pick<
    XAxisProps,
    "width" | "height" | "tickLine" | "tickSize" | "tickMargin" | "minTickGap"
  >;
  yAxis: Pick<
    YAxisProps,
    "width" | "height" | "tickLine" | "tickSize" | "tickMargin" | "minTickGap"
  >;
  tooltip: Pick<
    TooltipProps<string, number>,
    "animationDuration" | "animationEasing"
  >;
  legend: Pick<LegendProps, "height" | "wrapperStyle">;
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
  tooltip: {
    animationDuration: 300,
    animationEasing: "ease-in-out",
  },
  legend: {
    height: 24,
    wrapperStyle: {
      position: "absolute",
      bottom: 0,
    },
  },
};

export default styles;
