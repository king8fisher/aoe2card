import { useRef, useState, type JSX } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "~/src/shadcn/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/src/shadcn/components/ui/tooltip";

interface TooltipProps {
  popover: JSX.Element;
  tooltip?: JSX.Element;
}

export const ContentWithPopover = (props: React.PropsWithChildren<TooltipProps>) => {
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
    <>
      <Popover>
        <PopoverTrigger className="leading-none m-0 p-0">
          {props.tooltip ?
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild className="leading-none">
                  {props.children}
                </TooltipTrigger>
                <TooltipContent>
                  {props.tooltip}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            :
            <>
              {props.children}
            </>
          }
        </PopoverTrigger>
        <PopoverContent>
          <div className="flex flex-col gap-2 text-sm max-w-96">{props.popover}</div>
        </PopoverContent>
      </Popover>
    </>
  );

  // return (
  //   <TooltipProvider>
  //     <Tooltip open={open}>
  //       <TooltipTrigger onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
  //         {props.children}
  //       </TooltipTrigger>
  //       <TooltipContent>
  //         <div className="flex flex-col gap-2 text-sm max-w-96">{props.tooltip}</div>
  //       </TooltipContent>
  //     </Tooltip>
  //   </TooltipProvider>
  // );
};
