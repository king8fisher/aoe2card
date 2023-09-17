import { SlDetails, SlIcon } from "@shoelace-style/shoelace/dist/react";
import { UnitsPresentationFlex } from "../../../styles";
import { GroupedUnitPresentation } from "../GroupedUnitPresentation";
import { ISearchResult } from "../../../App";

interface IGenericUnitsViewProps {
  genericUnitsData: ISearchResult | undefined;
}

const GenericUnitsView = ({ genericUnitsData }: IGenericUnitsViewProps) =>
  !!genericUnitsData?.grouped.length && (
    <SlDetails className="sl-details w-full mt-2" open>
      <SlIcon name="plus-square" slot="expand-icon" />
      <SlIcon name="dash-square" slot="collapse-icon" />
      <UnitsPresentationFlex>
        {genericUnitsData?.grouped.map((v, _index) => <GroupedUnitPresentation key={v.unit.id} groupByUnitData={v} />)}
      </UnitsPresentationFlex>
    </SlDetails>
  );

export default GenericUnitsView;
