import type {
  AreaProps,
  CartesianGridProps,
  ResponsiveContainerProps,
  TooltipProps,
  XAxisProps,
  YAxisProps,
} from "recharts";

type AnimationTimingProps = "animationDuration" | "animationEasing";
type DimensionProps = "width" | "height";
type PaddingProps = "padding";
type StrokeProps = "stroke" | "strokeDasharray" | "strokeOpacity";
type TickProps =
  | "tick"
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
};

const styles: VersionDownloadChartStyle = {
  area: {
    isAnimationActive: false,
  },
  responsiveContainer: {
    width: "100%",
    height: 230,
  },
  grid: {
    strokeDasharray: "5 5",
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
};

export default styles;
