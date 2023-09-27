import { SlTooltip } from "@shoelace-style/shoelace/dist/react";
import { useState } from "react";
import { IUnitCivData } from "../../../data/model";
import { getCivImgUrl, getStyleForUnit } from "../../../helpers/tools";
import { UnitLineDiv } from "../../../styles";
import { CostPresentation } from "../../atoms/UnitCost";
import { UnitLine } from "../UnitLine";

interface IUnitPresentationProps {
  unitCivData: IUnitCivData;
  showCiv: boolean;
}

export const UnitPresentation = ({ unitCivData, showCiv }: IUnitPresentationProps) => {
  const [showTooltip, setShowTooltip] = useState(false);
  // onMouseLeave event does not bubble. When an event bubbles, it moves, or propagates, up the DOM hierarchy.
  // onMouseOut bubbles.
  return (
    <div
      className={[
        "flex flex-col w-full min-[500px]:w-1/2 md:w-1/3 lg:w-1/4 rounded-md p-1",
        getStyleForUnit(unitCivData.unit),
      ].join(" ")}
    >
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
      <UnitLine unit={unitCivData.unit} cost={unitCivData.unitStats.cost} />
    </div>
  );
};
