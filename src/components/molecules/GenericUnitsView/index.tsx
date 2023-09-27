import { IGroupByUnitData, getAllCivs } from "../../../data/model";
import { getStyleForUnit } from "../../../helpers/tools";
import { ISearchResult } from "../../../pages/Home";
import { UnitsPresentationFlex } from "../../../styles";
import SingleCivIcon from "../../atoms/SingleCivIcon";
import { UnitLine } from "../UnitLine";

interface IGenericUnitsViewProps {
  genericUnitsData: ISearchResult | undefined;
}

const GenericUnitsView = ({ genericUnitsData }: IGenericUnitsViewProps) => {
  const renderUnitInfo = (groupByUnitData: IGroupByUnitData) => (
    <div className="flex flex-col w-full min-[500px]:w-1/2 md:w-1/3 lg:w-1/4">
      <div
        className={[
          "flex flex-col justify-between rounded-md m-1 h-full p-1",
          getStyleForUnit(groupByUnitData.unit),
        ].join(" ")}
      >
        <div>
          <UnitLine unit={groupByUnitData.unit} cost={groupByUnitData.mostCommonUnitStats.cost} />
        </div>
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
        {genericUnitsData?.grouped.map((groupByUnitData: IGroupByUnitData) => renderUnitInfo(groupByUnitData))}
      </UnitsPresentationFlex>
    )
  );
};

export default GenericUnitsView;
