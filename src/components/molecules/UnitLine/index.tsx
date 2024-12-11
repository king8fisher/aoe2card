import { Cost, IUnitData } from "../../../data/model";
import { getUnitImgUrl } from "../../../helpers/tools";
import { UnitLineDiv } from "../../../styles";
import { ContentWithPopover } from "../../atoms/ContentWithTooltip";
import { StatisticsBlock } from "../../atoms/StatisticsBlock";
import { CostPresentation } from "../../atoms/UnitCost";

interface IUnitLineProps {
  unit: IUnitData;
  cost?: Cost;
}

export const UnitLine = ({ unit, cost }: IUnitLineProps) => {
  return (
    <>
      <ContentWithPopover
        popover={
          <>
            <span className="font-bold leading-6">{unit.statisticsUnitData.name}</span>
            <span dangerouslySetInnerHTML={{ __html: unit.help.about }} />
            <span className="italic">
              <strong>Upgrades: </strong>
              {unit.help.upgrades}
            </span>
          </>
        }
      >
        <UnitLineDiv>
          <span className="flex flex-row w-full gap-px items-center">
            <img src={getUnitImgUrl(unit.id)} alt="" className="w-8 h-8 flex-shrink-0 mt-[2px] rounded-sm ml-[4px]" />
            <span className="mx-[4px] text-md break-words font-bold grow">{unit.statisticsUnitData.name}</span>
            {cost &&
              <span className="place-self-end">
                <CostPresentation cost={cost} />
              </span>
            }
          </span>
        </UnitLineDiv>
      </ContentWithPopover>
      <UnitLineDiv>
        <StatisticsBlock unitData={unit.statisticsUnitData} />
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
          {unit.help.upgrades !== "" && (
            <span className="w-full bg-gradient-to-br via-30% from-blue-800/40 to-blue-800/0 rounded-md flex-grow p-1 whitespace-normal">
              {unit.help.upgrades}
            </span>
          )}
        </div>
      </div>
    </>
  );
};
