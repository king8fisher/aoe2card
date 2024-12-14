import { IGroupByUnitData, getAllCivs } from "../../../data/model";
import { getStyleForUnit } from "../../../helpers/tools";
import { ISearchResult } from "../../../pages/Home";
import { CardInnerPadding, CardWrap, UnitsPresentationFlex } from "../../../styles";
import SingleCivIcon from "../../atoms/SingleCivIcon";
import { UnitLine } from "../UnitLine";

interface IGenericUnitsViewProps {
  genericUnitsData: ISearchResult | undefined;
}

const GenericUnitsView = ({ genericUnitsData }: IGenericUnitsViewProps) => {
  return (
    !!genericUnitsData?.grouped.length && (
      <UnitsPresentationFlex>
        {genericUnitsData?.grouped.map((groupByUnitData: IGroupByUnitData) =>
          <RenderUnitInfo key={groupByUnitData.unit.id} groupByUnitData={groupByUnitData} />)}
      </UnitsPresentationFlex>
    )
  );
};

const RenderUnitInfo = ({ groupByUnitData }: { groupByUnitData: IGroupByUnitData; }) => (
  <CardWrap key={groupByUnitData.unit.id}>
    <CardInnerPadding className={getStyleForUnit(groupByUnitData.unit)}>
      <div>
        <UnitLine
          withPopover
          unit={groupByUnitData.unit}
          cost={groupByUnitData.mostCommonUnitStats.cost} />
      </div>
      <div className="grid grid-cols-8 gap-1 p-1 mt-1">
        {getAllCivs().map((civData) => (
          <SingleCivIcon showTooltip highlight={groupByUnitData.civs.has(civData.key)} civData={civData} key={civData.key} />
        ))}
      </div>
    </CardInnerPadding>
  </CardWrap>
);


export default GenericUnitsView;
