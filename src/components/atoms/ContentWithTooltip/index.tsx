import { useRef, useState, type JSX } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "~/src/shadcn/components/ui/popover";

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
    <Popover open={open}>
      <PopoverTrigger
        onMouseEnter={handleMouseEnter}
        // `onMouseOut` bubbles, but `onMouseLeave` event does not bubble.
        onMouseLeave={handleMouseLeave}
      >
        {props.children}

      </PopoverTrigger>
      <PopoverContent>
        <div className="flex flex-col gap-2 text-sm">
          {props.tooltip}
        </div>
      </PopoverContent>
    </Popover>
  );
};
