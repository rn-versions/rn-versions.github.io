import { useEffect, useState } from "react";
import type { VersionDownloadChartProps } from "../components/VersionDownloadChart";

const chartImport = import(
  /* webpackChunkName: "VersionDownloadChart" */
  /* webpackPreload: true */
  "../components/VersionDownloadChart"
);

let chart: React.FC<VersionDownloadChartProps> | undefined;
void chartImport.then((imp) => {
  chart = imp.default;
  return chart;
});

export default function useVersionDownloadChart():
  | React.FC<VersionDownloadChartProps>
  | undefined {
  const [chartLoaded, setChartLoaded] = useState(chart !== undefined);

  useEffect(() => {
    if (!chartLoaded) {
      void chartImport.then(() => setChartLoaded(true));
    }
  });

  return chart;
}
