import type {
  AreaProps,
  CartesianGridProps,
  LegendProps,
  ResponsiveContainerProps,
  TooltipProps,
  XAxisProps,
  YAxisProps,
} from "recharts";

type AnimationTimingProps = "animationDuration" | "animationEasing";
type DimensionProps = "width" | "height";
type PaddingProps = "padding";
type StrokeProps = "strokeDasharray";
type TickProps =
  | "tickCount"
  | "tickLine"
  | "tickSize"
  | "tickMargin"
  | "minTickGap";

export type VersionDownloadChartStyle = {
  area: Pick<AreaProps, DimensionProps | "isAnimationActive">;
  responsiveContainer: Pick<ResponsiveContainerProps, DimensionProps>;
  grid: Pick<CartesianGridProps, DimensionProps | StrokeProps>;
  xAxis: Pick<XAxisProps, DimensionProps | PaddingProps | TickProps>;
  yAxis: Pick<YAxisProps, DimensionProps | PaddingProps | TickProps>;
  tooltip: Pick<TooltipProps<string, number>, AnimationTimingProps>;
  legend: Pick<LegendProps, DimensionProps | "wrapperStyle">;
};

const styles: VersionDownloadChartStyle = {
  area: {
    isAnimationActive: false,
  },
  responsiveContainer: {
    width: "100%",
    height: 260,
  },
  grid: {
    strokeDasharray: "3 3",
  },
  xAxis: {
    height: 32,
    tickLine: false,
    tickMargin: 10,
  },
  yAxis: {
    width: 72,
    tickLine: false,
    tickMargin: 10,
    tickSize: 0,
    tickCount: 5,
  },
  tooltip: {
    animationDuration: 300,
    animationEasing: "ease-in-out",
  },
  legend: {
    height: 32,
    wrapperStyle: {
      position: "absolute",
      bottom: 0,
    },
  },
};

export default styles;
