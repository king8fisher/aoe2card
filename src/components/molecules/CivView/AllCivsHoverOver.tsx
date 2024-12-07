import { useState } from "react";
import {
  ICivData,
  getAllCivs
} from "../../../data/model";
import SingleCivIcon, { TooltipContent } from "../../atoms/SingleCivIcon";


export const AllCivsHoverOver = () => {
  const [civTip, setCivTip] = useState<ICivData | null>(null);
  return (
    <div className="flex flex-row flex-wrap md:flex-nowrap gap-1 items-start pb-8">
      <div className="grid grid-cols-8 gap-1 p-1 mt-1 max-w-[300px] shrink-0">
        {getAllCivs().map((civData) => (
          <SingleCivIcon
            highlight
            disablePopup
            civData={civData}
            key={civData.key}
            onMouseOver={() => {
              setCivTip(civData);
            }}
            onMouseLeave={() => {
              // We want to keep the last still visible.
              //setCivTip(null)
            }}
          />
        ))}
      </div>
      {
        civTip && (
          <div className="grow flex flex-col gap-2 p-2 rounded bg-black/20">
            <TooltipContent civData={civTip} />
          </div>
        )
      }
    </div>
  )
};