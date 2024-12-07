import { type JSX } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/src/shadcn/components/ui/tooltip";

interface TooltipProps {
  tooltip: JSX.Element;
}

export const ContentWithTooltip = (props: React.PropsWithChildren<TooltipProps>) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>{props.children}</TooltipTrigger>
        <TooltipContent>
          <div className="flex flex-col gap-2 text-sm max-w-96">
            {props.tooltip}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
