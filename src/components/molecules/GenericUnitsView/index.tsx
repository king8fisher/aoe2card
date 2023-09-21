import { UnitDisplayLine, UnitsPresentationFlex } from "../../../styles";
import { ISearchResult } from "../../../App";
import { IGroupByUnitData, getAllCivs } from "../../../data/model";
import { getStyleForUnit } from "../../../helpers/tools";
import { UnitLine } from "../UnitLine";
import { CostPresentation } from "../../atoms/UnitCost";
import SingleCivIcon from "../../atoms/SingleCivIcon";

interface IGenericUnitsViewProps {
  genericUnitsData: ISearchResult | undefined;
}

const GenericUnitsView = ({ genericUnitsData }: IGenericUnitsViewProps) => {
  const renderUnitInfo = (groupByUnitData: IGroupByUnitData) => (
    <div className="flex flex-col w-full md:w-1/3 lg:w-1/4">
      <div className={["m-1 rounded-md h-full p-1", getStyleForUnit(groupByUnitData.unit)].join(" ")}>
        <UnitLine unit={groupByUnitData.unit} />
        <UnitDisplayLine className="text-xs mt-1">
          <CostPresentation cost={groupByUnitData.mostCommonUnitStats.cost} />
        </UnitDisplayLine>
        <div className="grid grid-cols-8 gap-1 p-1 mt-1">
          {getAllCivs().map((civData) => (
            <SingleCivIcon highlight={groupByUnitData.civs.has(civData.key)} civData={civData} key={civData.key} />
          ))}
        </div>
      </div>
    </div>
  );

  return (
    !!genericUnitsData?.grouped.length && (
      <UnitsPresentationFlex>
        {genericUnitsData?.grouped.map((groupByUnitData) => renderUnitInfo(groupByUnitData))}
      </UnitsPresentationFlex>
    )
  );
};

export default GenericUnitsView;
