import { SlButton, SlDropdown, SlMenu, SlMenuItem } from "@shoelace-style/shoelace/dist/react";
import { getCivImgUrl } from "../../../helpers/tools";
import { UnitsPresentationFlex } from "../../../styles";
import { UnitPresentation } from "../UnitPresentation";
import { IUnitCivData } from "../../../data/model";

interface ICivViewProps {
  selectedCivKey: string;
  civsList: { key: string; value: string }[];
  setCiv: (civ: string) => void;
  unitsByCiv: IUnitCivData[];
}

export const CivView = ({ selectedCivKey, civsList, setCiv, unitsByCiv }: ICivViewProps) => (
  <>
    <SlDropdown className="shadow-lg">
      <SlButton slot="trigger" caret>
        <img slot="prefix" src={getCivImgUrl(selectedCivKey)} className="w-5 h-5 flex-shrink-0" />
        {selectedCivKey}
      </SlButton>
      <SlMenu
        onSlSelect={(event) => {
          setCiv(event.detail.item.value);
        }}
      >
        {civsList.map((value) => (
          <SlMenuItem key={value.key} value={value.key}>
            {value.value}
            <img slot="prefix" src={getCivImgUrl(value.key)} className="w-5 h-5 flex-shrink-0" />
          </SlMenuItem>
        ))}
      </SlMenu>
    </SlDropdown>
    <UnitsPresentationFlex>
      {unitsByCiv?.map((v, _index) => (
        <UnitPresentation key={`${v.civ.key}-${v.unit.id}`} unitCivData={v} showCivName={false} />
      ))}
    </UnitsPresentationFlex>
  </>
);
