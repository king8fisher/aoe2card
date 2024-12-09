import clsx from "clsx";
import { useState } from "react";
import { ICivData, getAllCivs } from "../../../data/model";
import SingleCivIcon, { TooltipContent } from "../../atoms/SingleCivIcon";

export const AllCivsHoverOver = () => {
  const [hovered, setHovered] = useState<ICivData | null>(null);
  return (
    <div className="flex flex-row flex-wrap md:flex-nowrap gap-1 items-start pb-8">
      <div className="grid grid-cols-8 gap-1 p-1 mt-1 shrink-0">
        {getAllCivs().map((civData) => (
          <SingleCivIcon
            highlight
            disablePopup
            civData={civData}
            key={civData.key}
            onMouseOver={() => {
              setHovered(civData);
            }}
            onMouseLeave={() => {
              // We want to keep the last still visible.
              //setCivTip(null)
            }}
            className={clsx(
              "w-8 h-8 flex-shrink-0 rounded-lg border-white/10 border-2",
              "transition-transform",
              hovered && hovered?.key == civData.key && "border-0 scale-150"
            )}
          />
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
