import React, { Suspense } from "react";

import type { ITooltipHostProps, IButtonProps } from "@fluentui/react";

import { IconButton } from "@fluentui/react";

const tooltipImport = import(
  /* webpackChunkName: "Tooltip" */
  /* webpackPreload: true */
  "@fluentui/react/lib/components/Tooltip"
);

const TooltipHost = React.lazy(async () => ({
  default: (await tooltipImport).TooltipHost,
}));

const TooltipButton: React.FC<ITooltipHostProps & IButtonProps> = (props) => (
  <Suspense fallback={<IconButton {...props} />}>
    <TooltipHost {...props}>
      <IconButton {...props} />
    </TooltipHost>
  </Suspense>
);

export default TooltipButton;
