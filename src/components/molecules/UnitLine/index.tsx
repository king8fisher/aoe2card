/* eslint-disable prefer-arrow-callback */
import { Cost, IUnitData } from "../../../data/model";
import { getUnitImgUrl } from "../../../helpers/tools";
import { UnitLineDiv } from "../../../styles";
import { ContentWithTooltip } from "../../atoms/ContentWithTooltip";
import { CostPresentation } from "../../atoms/UnitCost";

interface IUnitLineProps {
  unit: IUnitData;
  cost: Cost;
}

export const UnitLine = ({ unit, cost }: IUnitLineProps) => {
  return (
    <>
      <ContentWithTooltip
        tooltip={
          <>
            <span className="font-bold leading-6">{unit.extractedUnitData.name}</span>
            <span dangerouslySetInnerHTML={{ __html: unit.help.about }} />
          </>
        }
      >
        <UnitLineDiv>
          <span className="flex flex-col gap-px items-center">
            <img src={getUnitImgUrl(unit.id)} className="w-6 h-6 flex-shrink-0 mt-[2px] rounded-sm ml-[4px]" />
            <span className="text-xs">hp {unit.extractedUnitData.hp}</span>
          </span>
          <span className="mx-[4px] text-md break-words">{unit.extractedUnitData.name}</span>
          <CostPresentation cost={cost} />
        </UnitLineDiv>
      </ContentWithTooltip>

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
