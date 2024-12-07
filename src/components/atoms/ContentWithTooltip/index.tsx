import { useState, type JSX } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "~/src/shadcn/components/ui/popover";

interface TooltipProps {
  tooltip: JSX.Element;
}

export const ContentWithTooltip = (props: React.PropsWithChildren<TooltipProps>) => {

  // onMouseLeave event does not bubble. When an event bubbles, it moves, or propagates, up the DOM hierarchy.
  // onMouseOut bubbles.
  const [open, setOpen] = useState(false);

  const handleMouseEnter = () => {
    setOpen(true);
  };

  const handleMouseLeave = () => {
    setOpen(false);
  };

  return (
    <Popover open={open}
    // onMouseEnter={() => setShowTooltip(true)} onMouseLeave={() => setShowTooltip(false)}
    >
      <PopoverTrigger
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {props.children}

      </PopoverTrigger>
      <PopoverContent>
        {props.tooltip}
      </PopoverContent>
    </Popover>
    // <div >
    //   {showTooltip && (

    //   )}
    //   {!showTooltip && <>{props.children}</>}
    // </div>
  );
};
