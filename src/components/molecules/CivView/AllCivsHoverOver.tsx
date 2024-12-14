import clsx from "clsx";
import { useEffect, useMemo, useRef, useState } from "react";
import { ICivData, getAllCivs } from "../../../data/model";
import SingleCivIcon, { SingleCivTooltipContent } from "../../atoms/SingleCivIcon";
import { ContentWithPopover } from "../../atoms/ContentWithTooltip";
import { useDebounce, useDebouncedCallback } from "use-debounce";

export const AllCivsHoverOver = (
  { reactToHovering = false, showTooltip = false, filter = "" }:
    { reactToHovering?: boolean; showTooltip?: boolean; filter?: string; }
) => {
  const [hovered, setHovered] = useState<ICivData | null>(null);
  const allCivs = useMemo(() => getAllCivs(), []);

  const delayedSetHovered = useDebouncedCallback((civData: ICivData) => {
    setHovered(civData);
  }, 50);

  const handleHover = (civData: ICivData) => {
    setHovered(civData);
    //delayedSetHovered(civData);
  };

  return (
    <div className="flex flex-col min-[550px]:flex-row gap-2 items-start">
      <div className="grid grid-cols-8 gap-1 p-1 mt-1 shrink-0">
        {allCivs.map((civData) => (
          <ContentWithPopover
            tooltip={showTooltip ? <span className="text-sm">{civData.value}</span> : undefined}
            popover={<SingleCivTooltipContent civData={civData} />}
            key={civData.key}
          >
            <SingleCivIcon
              highlight
              disablePopup
              civData={civData}
              key={civData.key}
              onMouseOver={() => {
                if (reactToHovering) handleHover(civData);
              }}
              onMouseLeave={() => {
                // We want to keep the last still visible.
                //setCivTip(null)
              }}
              className={clsx(
                "cursor-pointer",
                "w-8 h-8 flex-shrink-0 rounded-lg border-2",
                "transition-transform",
                hovered && hovered?.key == civData.key && "border-none scale-150",
                filter == "" ? "border-black/20 dark:border-white/10" :
                  civData.value.toLowerCase().includes(filter.toLowerCase())
                    ? "border-yellow-600 dark:border-yellow-400"
                    : "opacity-50"
              )}
            />
          </ContentWithPopover>
        ))}

      </div>
      {hovered && (
        <div className="max-w-[500px] rounded-lg bg-black/20 p-2">
          <SingleCivTooltipContent civData={hovered} />
        </div>
      )}
    </div>
  );
};
