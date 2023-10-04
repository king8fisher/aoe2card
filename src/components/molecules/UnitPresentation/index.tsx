import { IUnitCivData } from "../../../data/model";
import { getCivImgUrl, getStyleForUnit } from "../../../helpers/tools";
import { CardInnerPadding, CardWrap, UnitLineDiv } from "../../../styles";
import { ContentWithTooltip } from "../../atoms/ContentWithTooltip";
import { UnitLine } from "../UnitLine";

interface IUnitPresentationProps {
  unitCivData: IUnitCivData;
  showCiv: boolean;
}

export const UnitPresentation = ({ unitCivData, showCiv }: IUnitPresentationProps) => {
  return (
    <CardWrap>
      <CardInnerPadding className={getStyleForUnit(unitCivData.unit)}>
        {showCiv && (
          <ContentWithTooltip
            tooltip={
              <>
                <span className="font-bold leading-6">{unitCivData.civ.value}</span>
                <span dangerouslySetInnerHTML={{ __html: unitCivData.civ.help }} />
              </>
            }
          >
            <UnitLineDiv>
              <img src={getCivImgUrl(unitCivData.civ.key)} className="w-7 h-7 flex-shrink-0 mt-[2px]" />
              <div className="leading-none mt-[0.44rem]">{unitCivData.civ.value}</div>
            </UnitLineDiv>
          </ContentWithTooltip>
        )}
        <UnitLine unit={unitCivData.unit} cost={unitCivData.unitStats.cost} />
      </CardInnerPadding>
    </CardWrap>
  );
};
