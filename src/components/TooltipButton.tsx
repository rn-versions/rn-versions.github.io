import type { ITooltipHostProps, IButtonProps } from "@fluentui/react";

import { IconButton } from "@fluentui/react";
import useTooltipHost from "../hooks/useTooltipHost";

const TooltipButton: React.FC<ITooltipHostProps & IButtonProps> = (props) => {
  const TooltipHost = useTooltipHost();

  if (TooltipHost) {
    return (
      <TooltipHost {...props}>
        <IconButton {...props} />
      </TooltipHost>
    );
  } else {
    return <IconButton {...props} />;
  }
};

export default TooltipButton;
