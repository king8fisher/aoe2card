import { SlButton, SlDetails, SlDropdown, SlIcon, SlMenu, SlMenuItem } from "@shoelace-style/shoelace/dist/react";
import { useMemo } from "react";
import { ICivData, IUnitCivData, allCivUnits, civByKey } from "../../../data/model";
import { civImgUrl } from "../../../helpers/tools";
import { UnitsPresentationFlex } from "../../../styles";
import { UnitPresentation } from "../UnitPresentation";

export const CivSingleView = ({ civ }: { civ: ICivData }) => {
  return (
    <SlDetails className="w-full">
      <SlIcon name="plus-square" slot="expand-icon" />
      <SlIcon name="dash-square" slot="collapse-icon" />
      <span slot="summary" className="flex flex-row gap-3 items-center">
        <img src={civImgUrl(civ.key)} className="w-5 h-5 flex-shrink-0" />
        {civ.value}
      </span>
      <CivDetailsView civ={civ} />
    </SlDetails>
  );
};

export const CivDetailsView = ({ civ }: { civ: ICivData }) => {
  const unitsByCiv: IUnitCivData[] = useMemo(() => allCivUnits(civ.key), [civ]);
  return (
    <>
      {(civ?.help || "") == "" ? (
        <></>
      ) : (
        <div className="text-xs">
          <span dangerouslySetInnerHTML={{ __html: civ?.help || "" }} />
        </div>
      )}
      <UnitsPresentationFlex>
        {unitsByCiv?.map((v, _index) => (
          <UnitPresentation key={`${v.civ.key}-${v.unit.id}`} unitCivData={v} showCivName={false} />
        ))}
      </UnitsPresentationFlex>
    </>
  );
};

interface ICivViewProps {
  civsList: { key: string; value: string }[];
  selectedCivKey: string;
  setSelectedCivKey: (civ: string) => void;
}

export const CivView = ({ civsList, selectedCivKey, setSelectedCivKey }: ICivViewProps) => {
  const civ = useMemo(() => civByKey(selectedCivKey), [selectedCivKey]);

  return (
    <>
      <SlDetails>
        <SlIcon name="plus-square" slot="expand-icon" />
        <SlIcon name="dash-square" slot="collapse-icon" />
        <SlDropdown className="shadow-lg" slot="summary">
          <SlButton slot="trigger" caret>
            <img slot="prefix" src={civImgUrl(selectedCivKey)} className="w-5 h-5 flex-shrink-0" />
            {selectedCivKey}
          </SlButton>
          <SlMenu
            onSlSelect={(event) => {
              setSelectedCivKey(event.detail.item.value);
            }}
          >
            {civsList.map((value) => (
              <SlMenuItem key={value.key} value={value.key}>
                {value.value}
                <img slot="prefix" src={civImgUrl(value.key)} className="w-5 h-5 flex-shrink-0" />
              </SlMenuItem>
            ))}
          </SlMenu>
        </SlDropdown>
        <CivDetailsView civ={civ} />
      </SlDetails>
    </>
  );
};