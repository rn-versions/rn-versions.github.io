import type {
  AreaProps,
  CartesianGridProps,
  LegendProps,
  ResponsiveContainerProps,
  TooltipProps,
  XAxisProps,
  YAxisProps,
} from "recharts";

const cardBackgroundColor = "#f8f9fa";

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
    fill: cardBackgroundColor,
  },
  xAxis: {
    height: 32,
    tickLine: false,
    tickMargin: 10,
  },
  yAxis: {
    width: 80,
    tickLine: false,
    tickMargin: 10,
    tickSize: 0,
  },
  tooltip: {
    wrapperStyle: {
      backgroundColor: cardBackgroundColor,
    },
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
