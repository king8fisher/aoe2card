import { UnitsPresentationFlex } from "../../../styles";
import { GroupedUnitPresentation } from "../GroupedUnitPresentation";
import { ISearchResult } from "../../../App";

interface IGenericUnitsViewProps {
  genericUnitsData: ISearchResult | undefined;
}

const GenericUnitsView = ({ genericUnitsData }: IGenericUnitsViewProps) =>
  !!genericUnitsData?.grouped.length && (
    <UnitsPresentationFlex>
      {genericUnitsData?.grouped.map((v, _index) => <GroupedUnitPresentation key={v.unit.id} groupByUnitData={v} />)}
    </UnitsPresentationFlex>
  );

export default GenericUnitsView;
