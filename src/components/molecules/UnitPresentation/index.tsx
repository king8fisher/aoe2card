import { Cost, ICivData, IUnitCivData, IUnitData, IUnitStatsData } from "../../../data/model";
import { getCivImgUrl, getStyleForUnit } from "../../../helpers/tools";
import { CardInnerPadding, CardWrap, UnitLineDiv } from "../../../styles";
import { ContentWithTooltip } from "../../atoms/ContentWithTooltip";
import { UnitLine } from "../UnitLine";

interface IUnitPresentationProps {
  civ?: ICivData;
  unit: IUnitData;
  cost?: Cost;
}

export const UnitPresentation = ({ civ, unit, cost }: IUnitPresentationProps) => {
  return (
    <>
      {civ && (
        <ContentWithTooltip
          tooltip={
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
        </ContentWithTooltip>
      )}
      <UnitLine unit={unit} cost={cost} />
    </>
  );
};
