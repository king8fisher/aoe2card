import clsx from "clsx";
import { useMemo, useState } from "react";
import { ICivData, getAllCivs } from "../../../data/model";
import SingleCivIcon, { TooltipContent } from "../../atoms/SingleCivIcon";
import { ContentWithTooltip } from "../../atoms/ContentWithTooltip";

export const AllCivsHoverOver = ({ useTooltip, filter }: { useTooltip: boolean; filter: string; }) => {
  const [hovered, setHovered] = useState<ICivData | null>(null);
  const allCivs = useMemo(() => getAllCivs(), []);
  return (
    <div className="flex flex-col flex-wrap md:flex-nowrap gap-1 items-start">
      <div className="grid grid-cols-8 gap-1 p-1 mt-1 shrink-0">
        {allCivs.map((civData) => (
          <ContentWithTooltip
            tooltip={<TooltipContent civData={civData} />}
          >
            <SingleCivIcon
              highlight
              disablePopup
              civData={civData}
              key={civData.key}
              onMouseOver={() => {
                if (!useTooltip) setHovered(civData);
              }}
              onMouseLeave={() => {
                // We want to keep the last still visible.
                //setCivTip(null)
              }}
              className={clsx(
                "cursor-pointer",
                "w-8 h-8 flex-shrink-0 rounded-lg border-white/10 border-2",
                "transition-transform",
                hovered && hovered?.key == civData.key && "border-0 scale-150",
                filter == "" ? "border-white/20" :
                  civData.value.toLowerCase().includes(filter.toLowerCase())
                    ? "border-yellow-400"
                    : "opacity-50"
              )}
            />
          </ContentWithTooltip>
        ))}
      </div>
      {hovered && (
        <div className="grow flex flex-col gap-2 p-2 rounded bg-black/20">
          <TooltipContent civData={hovered} />
        </div>
      )}
    </div>
  );
};
