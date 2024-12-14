import { UnitCost } from "~/src/data/types/data_json_types";
import { ICivData, IUnitCivData, IUnitData, IUnitStatsData } from "../../../data/model";
import { getCivImgUrl, getStyleForUnit } from "../../../helpers/tools";
import { CardInnerPadding, CardWrap, UnitLineDiv } from "../../../styles";
import { ContentWithPopover } from "../../atoms/ContentWithTooltip";
import { UnitLine } from "../UnitLine";

interface IUnitPresentationProps {
  civ?: ICivData;
  unit: IUnitData;
  cost?: UnitCost;
}

export const UnitPresentation = ({ civ, unit, cost }: IUnitPresentationProps) => {
  return (
    <>
      {civ && (
        <ContentWithPopover
          popover={
            <>
              <span className="font-bold leading-6">{civ.value}</span>
              <span dangerouslySetInnerHTML={{ __html: civ.help }} />
            </>
          }
        >
          <UnitLineDiv>
            <img src={getCivImgUrl(civ.key)} alt="" className="w-7 h-7 flex-shrink-0 mt-[2px]" />
            <div className="leading-none mt-[0.44rem]">{civ.value}</div>
          </UnitLineDiv>
        </ContentWithPopover>
      )}
      <UnitLine unit={unit} cost={cost} />
    </>
  );
};
