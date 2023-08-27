/* eslint-disable prefer-arrow-callback */
import { SlTooltip } from "@shoelace-style/shoelace/dist/react";
import { memo, useState } from "react";
import { IUnitData } from "../../../data/model";
import { unitImgUrl } from "../../../helpers/tools";
import { UnitLineDiv } from "../../../styles";

export const UnitLine = memo(({ unit }: { unit: IUnitData }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  return (
    <div className="max-w-sm">
      <UnitLineDiv onMouseEnter={() => setShowTooltip(true)} onMouseLeave={() => setShowTooltip(false)}>
        {showTooltip && (
          <SlTooltip style={{ ["--show-delay" as string]: "400" }}>
            <div className="flex flex-col gap-1" slot="content">
              <span className="font-bold leading-6">{unit.value}</span>
              <span dangerouslySetInnerHTML={{ __html: unit.help.about }} />
            </div>
            <img src={unitImgUrl(unit.id)} className="w-5 h-5 flex-shrink-0 mt-[2px] rounded-sm ml-[4px]" />
            <span className="ml-[4px]">{unit.value}</span>
            <span className="opacity-50 ml-[4px] text-xs mt-[0.35rem]">{unit.id}</span>
          </SlTooltip>
        )}
        {!showTooltip && (
          <>
            <img src={unitImgUrl(unit.id)} className="w-5 h-5 flex-shrink-0 mt-[2px] rounded-sm ml-[4px]" />
            <span className="ml-[4px]">{unit.value}</span>
            <span className="opacity-50 ml-[4px] text-xs mt-[0.35rem]">{unit.id}</span>
          </>
        )}
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
    </div>
  );
});
