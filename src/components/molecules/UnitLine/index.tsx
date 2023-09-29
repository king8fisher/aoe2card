/* eslint-disable prefer-arrow-callback */
import { SlTooltip } from "@shoelace-style/shoelace/dist/react";
import { useState } from "react";
import { Cost, IUnitData } from "../../../data/model";
import { getUnitImgUrl } from "../../../helpers/tools";
import { UnitLineDiv } from "../../../styles";
import { CostPresentation } from "../../atoms/UnitCost";

interface IUnitLineProps {
  unit: IUnitData;
  cost: Cost;
}

export const UnitLine = ({ unit, cost }: IUnitLineProps) => {
  const [showTooltip, setShowTooltip] = useState(false);
  return (
    <>
      <UnitLineDiv onMouseEnter={() => setShowTooltip(true)} onMouseLeave={() => setShowTooltip(false)}>
        {showTooltip && (
          <SlTooltip style={{ ["--show-delay" as string]: "400" }}>
            <div className="flex flex-col gap-1" slot="content">
              <span className="font-bold leading-6">{unit.value}</span>
              <span dangerouslySetInnerHTML={{ __html: unit.help.about }} />
            </div>
            <img src={getUnitImgUrl(unit.id)} className="w-5 h-5 flex-shrink-0 mt-[2px] rounded-sm ml-[4px]" />
            <span className="mx-[4px] text-md break-all">{unit.value}</span>
          </SlTooltip>
        )}
        {!showTooltip && (
          <>
            <img src={getUnitImgUrl(unit.id)} className="w-5 h-5 flex-shrink-0 mt-[2px] rounded-sm ml-[4px]" />
            <span className="mx-[4px] text-md break-all">{unit.value}</span>
          </>
        )}
        <CostPresentation cost={cost} />
      </UnitLineDiv>
      <div className="flex">
        <div className="text-sm leading-1 flex flex-col gap-0 px-2 mt-1">
          {unit.help.strong !== "" && (
            <span className="w-full bg-gradient-to-br via-30% from-green-800/40 to-green-800/0 rounded-md flex-grow p-1 whitespace-normal">
              {unit.help.strong}
            </span>
          )}
          {unit.help.weak !== "" && (
            <span className="w-full bg-gradient-to-br via-30% from-orange-800/40 to-orange-800/0 rounded-md flex-grow p-1 whitespace-normal">
              {unit.help.weak}
            </span>
          )}
        </div>
      </div>
    </>
  );
};
