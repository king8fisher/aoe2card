import { SlTooltip } from "@shoelace-style/shoelace/dist/react";
import { memo, useState } from "react";
import { IUnitCivData } from "../../../data/model";
import { getCivImgUrl, getStyleForUnit } from "../../../helpers/tools";
import { UnitLineDiv } from "../../../styles";
import { CostPresentation } from "../../atoms/UnitCost";
import { UnitLine } from "../UnitLine";

export const UnitPresentation = memo(({ unitCivData, showCiv }: { unitCivData: IUnitCivData; showCiv: boolean }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  // onMouseLeave event does not bubble. When an event bubbles, it moves, or propagates, up the DOM hierarchy.
  // onMouseOut bubbles.
  return (
    <div className={["flex flex-col rounded-md p-1", getStyleForUnit(unitCivData.unit)].join(" ")}>
      {showCiv && (
        <UnitLineDiv onMouseEnter={() => setShowTooltip(true)} onMouseLeave={() => setShowTooltip(false)}>
          {showTooltip && (
            <SlTooltip style={{ ["--show-delay" as string]: "400" }}>
              <div className="flex flex-col gap-1" slot="content">
                <span className="font-bold leading-6">{unitCivData.civ.value}</span>
                <span dangerouslySetInnerHTML={{ __html: unitCivData.civ.help }} />
              </div>
              <img src={getCivImgUrl(unitCivData.civ.key)} className="w-7 h-7 flex-shrink-0 mt-[2px]" />
              <div className="leading-none mt-[0.44rem]">{unitCivData.civ.value}</div>
            </SlTooltip>
          )}
          {!showTooltip && (
            <>
              <img src={getCivImgUrl(unitCivData.civ.key)} className="w-7 h-7 flex-shrink-0 mt-[2px]" />
              <div className="leading-none mt-[0.44rem]">{unitCivData.civ.value}</div>
            </>
          )}
        </UnitLineDiv>
      )}
      <UnitLine unit={unitCivData.unit} />
      <div className="text-xs mt-1">
        <CostPresentation cost={unitCivData.unitStats.cost} />
      </div>
    </div>
  );
});
