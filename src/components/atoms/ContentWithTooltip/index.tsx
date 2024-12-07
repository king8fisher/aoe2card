import { useState, type JSX } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "~/src/shadcn/components/ui/popover";

interface TooltipProps {
  tooltip: JSX.Element;
}

export const ContentWithTooltip = (props: React.PropsWithChildren<TooltipProps>) => {
  const [open, setOpen] = useState(false);

  const handleMouseEnter = () => {
    setOpen(true);
  };

  const handleMouseLeave = () => {
    setOpen(false);
  };

  return (
    <Popover open={open}>
      <PopoverTrigger
        onMouseEnter={handleMouseEnter}
        // `onMouseOut` bubbles, but `onMouseLeave` event does not bubble.
        onMouseLeave={handleMouseLeave}
      >
        {props.children}

      </PopoverTrigger>
      <PopoverContent>
        {props.tooltip}
      </PopoverContent>
    </Popover>
  );
};
