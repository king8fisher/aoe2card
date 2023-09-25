import { SlDetails, SlIcon } from "@shoelace-style/shoelace/dist/react";
import { useMemo } from "react";
import { ICivData, IUnitCivData, getAllCivUnits } from "../../../data/model";
import { getCivImgUrl } from "../../../helpers/tools";
import { UnitsPresentationFlex } from "../../../styles";
import { UnitPresentation } from "../UnitPresentation";

interface ICivViewProps {
  civ: ICivData;
}

export const CivView = ({ civ }: ICivViewProps) => {
  const unitsByCiv: IUnitCivData[] = useMemo(() => getAllCivUnits(civ.key), [civ]);

  const renderCivDetailsView = () => (
    <>
      {(civ?.help || "") != "" && (
        <div className="text-sm pb-3">{<span dangerouslySetInnerHTML={{ __html: civ?.help || "" }} />}</div>
      )}
      <UnitsPresentationFlex>
        {unitsByCiv?.map((unitCivData) => (
          <UnitPresentation
            key={`${unitCivData.civ.key}-${unitCivData.unit.id}`}
            unitCivData={unitCivData}
            showCiv={false}
          />
        ))}
      </UnitsPresentationFlex>
    </>
  );

  return (
    <SlDetails className="details w-full mt-2">
      <SlIcon name="plus-square" slot="expand-icon" />
      <SlIcon name="dash-square" slot="collapse-icon" />
      <span slot="summary" className="flex flex-row gap-3 items-center">
        <img src={getCivImgUrl(civ.key)} className="w-5 h-5 flex-shrink-0" />
        {civ.value}
      </span>
      {renderCivDetailsView()}
    </SlDetails>
  );
};
