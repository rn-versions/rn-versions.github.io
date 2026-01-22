import { ITheme } from "@fluentui/react";

import type {
  AreaProps,
  CartesianGridProps,
  ResponsiveContainerProps,
  TooltipProps,
  XAxisProps,
  YAxisProps,
} from "recharts";
import { Unit } from "../components/VersionDownloadChart";

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

export type VersionDownloadChartStyle = (opts?: {
  theme?: ITheme;
  unit?: Unit;
}) => {
  areaChart: {
    margin?: { top?: number; right?: number; bottom?: number; left?: number };
  };
  area: Pick<AreaProps, AnimationProps | DimensionProps>;
  responsiveContainer: Pick<ResponsiveContainerProps, DimensionProps>;
  responsiveContainerFullScreen: Pick<ResponsiveContainerProps, DimensionProps>;
  grid: Pick<CartesianGridProps, DimensionProps | StrokeProps>;
  xAxis: Pick<XAxisProps, DimensionProps | PaddingProps | TickProps>;
  yAxis: Pick<YAxisProps, DimensionProps | PaddingProps | TickProps>;
  tooltip: Pick<TooltipProps<string, number>, AnimationProps | "offset">;
};

const styles: VersionDownloadChartStyle = ({ theme, unit } = {}) => ({
  areaChart: {
    margin: { top: 15, right: 28, bottom: 5 },
  },
  area: {
    type: "basis",
    isAnimationActive: false,
    stroke: theme?.isInverted
      ? theme.palette.whiteTranslucent40
      : theme?.palette.blackTranslucent40,
  },
  responsiveContainer: {
    width: "100%",
    height: 260,
  },
  responsiveContainerFullScreen: {
    width: "100%",
    height: "100%",
  },
  grid: {
    stroke: theme?.isInverted
      ? theme.palette.whiteTranslucent40
      : theme?.palette.blackTranslucent40,
    strokeDasharray: "1 1",
  },
  xAxis: {
    tickLine: false,
    tick: { fill: theme?.semanticColors.bodyText },
  },
  yAxis: {
    tickLine: false,
    tickMargin: 10,
    tickSize: 0,
    tickCount: 5,
    width: 56,
    tick: { fill: theme?.semanticColors.bodyText },
  },
  tooltip: {
    animationDuration: 150,
    animationEasing: "linear",
    offset: 24,
  },
});

export default styles;
