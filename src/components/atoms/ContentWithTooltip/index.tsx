import { useRef, useState, type JSX } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/src/shadcn/components/ui/tooltip";

interface TooltipProps {
  tooltip: JSX.Element;
}

export const ContentWithTooltip = (props: React.PropsWithChildren<TooltipProps>) => {
  const [open, setOpen] = useState(false);

  const timerRef = useRef<NodeJS.Timeout>(null); // Ref to store the timeout ID

  const handleMouseEnter = () => {
    timerRef.current = setTimeout(() => {
      setOpen(true);
    }, 300);
  };

  const handleMouseLeave = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setOpen(false);
  };

  return (
    <TooltipProvider>
      <Tooltip open={open}>
        <TooltipTrigger onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>{props.children}</TooltipTrigger>
        <TooltipContent>
          <div className="flex flex-col gap-2 text-sm max-w-96">
            {props.tooltip}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
