import type {
  AreaProps,
  CartesianGridProps,
  ResponsiveContainerProps,
  TooltipProps,
  XAxisProps,
  YAxisProps,
} from "recharts";

type AnimationProps =
  | "animationDuration"
  | "animationEasing"
  | "isAnimationActive";
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
  areaChart: {
    margin?: { top?: number; right?: number; bottom?: number; left?: number };
  };
  area: Pick<AreaProps, AnimationProps | DimensionProps>;
  responsiveContainer: Pick<ResponsiveContainerProps, DimensionProps>;
  grid: Pick<CartesianGridProps, DimensionProps | StrokeProps>;
  xAxis: Pick<XAxisProps, DimensionProps | PaddingProps | TickProps>;
  yAxis: Pick<YAxisProps, DimensionProps | PaddingProps | TickProps>;
  tooltip: Pick<TooltipProps<string, number>, AnimationProps | "offset">;
};

const styles: VersionDownloadChartStyle = {
  areaChart: {
    margin: { top: 30, right: 30, bottom: 15 },
  },
  area: {
    isAnimationActive: false,
  },
  responsiveContainer: {
    width: "100%",
    height: 250,
  },
  grid: {
    strokeDasharray: "2 4",
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
    tickCount: 5,
  },
  tooltip: {
    animationDuration: 150,
    animationEasing: "linear",
    offset: 24,
  },
};

export default styles;
