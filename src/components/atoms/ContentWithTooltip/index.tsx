import { SlTooltip } from "@shoelace-style/shoelace/dist/react";
import { useState } from "react";

interface TooltipProps {
  tooltip: JSX.Element;
}

export const ContentWithTooltip = (props: React.PropsWithChildren<TooltipProps>) => {
  const [showTooltip, setShowTooltip] = useState(false);
  // onMouseLeave event does not bubble. When an event bubbles, it moves, or propagates, up the DOM hierarchy.
  // onMouseOut bubbles.
  return (
    <div onMouseEnter={() => setShowTooltip(true)} onMouseLeave={() => setShowTooltip(false)}>
      {showTooltip && (
        <SlTooltip style={{ ["--show-delay" as string]: "400" }}>
          <div className="flex flex-col gap-1" slot="content">
            {props.tooltip}
          </div>
          {props.children}
        </SlTooltip>
      )}
      {!showTooltip && <>{props.children}</>}
    </div>
  );
};
