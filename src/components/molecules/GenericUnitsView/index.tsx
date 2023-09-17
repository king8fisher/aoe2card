import { SlDetails, SlIcon } from "@shoelace-style/shoelace/dist/react";
import { useState } from "react";

import { UnitsPresentationFlex } from "../../../styles";
import { getUnitImgUrl } from "../../../helpers/tools";
import { ButtonGroup } from "../ButtonGroup";
import { GroupedUnitPresentation } from "../GroupedUnitPresentation";
import { UnitPresentation } from "../UnitPresentation";
import { ISearchResult } from "../../../App";

interface IGenericUnitsViewProps {
  genericUnitsData: ISearchResult | undefined;
}

const GenericUnitsView = (props: IGenericUnitsViewProps) => {
  const [isGroupedView, setIsGroupedView] = useState<boolean>(true);

  const { genericUnitsData } = props;
  return (
    <SlDetails className="sl-details w-full mt-2" open>
      <SlIcon name="plus-square" slot="expand-icon" />
      <SlIcon name="dash-square" slot="collapse-icon" />
      <span slot="summary">
        <div className="flex flex-row flex-wrap -space-x-2 pr-4">
          {genericUnitsData?.grouped?.map((v, _index) => {
            return (
              <img
                key={v.unit.id}
                src={getUnitImgUrl(v.unit.id)}
                className="w-8 h-8 flex-shrink-0 rounded-full border-white dark:border-zinc-400 border-2 bg-zinc-300 dark:bg-zinc-700 shadow-sm"
              />
            );
          })}
        </div>

        {/* Found: {isGroupedView ? searchResult?.grouped.length : searchResult?.units.length} */}
      </span>
      <div className="flex flex-col gap-2">
        <ButtonGroup isGroupedView={isGroupedView} setIsGroupedView={setIsGroupedView} />
        <UnitsPresentationFlex>
          {isGroupedView
            ? genericUnitsData?.grouped.map((v, _index) => (
                <GroupedUnitPresentation key={v.unit.id} groupByUnitData={v} />
              ))
            : genericUnitsData?.units?.map((v, _index) => (
                <UnitPresentation key={`${v.civ.key}-${v.unit.id}`} unitCivData={v} showCiv={true} />
              ))}
        </UnitsPresentationFlex>
      </div>
    </SlDetails>
  );
};

export default GenericUnitsView;
