import type { ITooltipHostProps } from "@fluentui/react";

import { useEffect, useState } from "react";

const tooltipImport = import(
  /* webpackChunkName: "TooltipHost" */
  /* webpackPrefetch: true */
  "@fluentui/react/lib/Tooltip"
);

let tooltipHost: React.FC<ITooltipHostProps> | undefined;
void tooltipImport.then((imp) => {
  tooltipHost = imp.TooltipHost;
  return tooltipHost;
});

export default function useTooltipHost():
  | React.FC<ITooltipHostProps>
  | undefined {
  const [tooltipLoaded, settooltipLoaded] = useState(tooltipHost !== undefined);

  useEffect(() => {
    if (!tooltipLoaded) {
      void tooltipImport.then(() => settooltipLoaded(true));
    }
  });

  return tooltipHost;
}
