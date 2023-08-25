import { setBasePath } from "@shoelace-style/shoelace";

import "@shoelace-style/shoelace/dist/themes/dark.css";
import "@shoelace-style/shoelace/dist/themes/light.css";

import {
  SlButton,
  SlButtonGroup,
  SlDropdown,
  SlMenu,
  SlMenuItem,
  SlTooltip,
} from "@shoelace-style/shoelace/dist/react";

import { useEffect, useMemo, useState } from "react";
import Navbar from "./components/molecules/Navbar";
import {
  IGroupByUnitData,
  IUnitCivData,
  IUnitData,
  allCivUnits,
  allCivs,
  groupByUnitType,
  searchUnits,
} from "./data/model";
import { createPromiseDebouncer } from "./helpers/debouncers";
import { Container, UnitDisplayLine, UnitsPresentationFlex } from "./styles";
import { getCivImgUrl, getStyleForUnit, getUnitImgUrl } from "./helpers/tools";
import { CostPresentation } from "./components/atoms/UnitCost";

setBasePath("/shoelace");

const debouncer = new createPromiseDebouncer<IUnitCivData[]>();

const App = () => {
  const [selectedCivKey, setCiv] = useState("Aztecs");
  const civsList = allCivs();

  useEffect(() => {
    document.body.classList.add("ready");
  });

  const [groupedView, setGroupedView] = useState(true);
  const [civView, setCivView] = useState(false);

  useEffect(() => () => {
    debouncer.destroyDebouncer();
  });

  interface ISearchResult {
    grouped: IGroupByUnitData[];
    units: IUnitCivData[];
  }

  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState<ISearchResult>();

  const unitsByCiv: IUnitCivData[] = useMemo(() => allCivUnits(selectedCivKey), [selectedCivKey]);

  useEffect(() => {
    debouncer.runDebounced({
      calc: () => searchUnits(search),
      assign: (v) => {
        setSearchResult({
          grouped: groupByUnitType(v),
          units: v,
        });
      },
      delay: 300,
    });
  }, [search]);

  return (
    <>
      <Navbar search={search} setSearch={setSearch} />
      <Container>
        <SlButtonGroup className="mt-2">
          <SlButton size="small" variant={groupedView ? "primary" : "default"} onClick={(_) => setGroupedView(true)}>
            Grouped
          </SlButton>
          <SlButton size="small" variant={!groupedView ? "primary" : "default"} onClick={(_) => setGroupedView(false)}>
            Linear
          </SlButton>
        </SlButtonGroup>

        <SlButtonGroup className="mt-2 ml-2">
          <SlButton size="small" variant={civView ? "primary" : "default"} onClick={(_) => setCivView(!civView)}>
            Civ
          </SlButton>
        </SlButtonGroup>
        <UnitsPresentationFlex>
          {groupedView
            ? searchResult?.grouped.map((v, _index) => (
                <GroupedUnitPresentation key={`${v.unit.id}`} groupByUnitData={v} />
              ))
            : searchResult?.units.map((v, _index) => (
                <UnitPresentation key={`${v.civ.key}-${v.unit.id}`} unitCivData={v} showCivName={true} />
              ))}
        </UnitsPresentationFlex>
      </Container>

      {civView && (
        <Container>
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
        </Container>
      )}
    </>
  );
};

const GroupedUnitPresentation = ({ groupByUnitData }: { groupByUnitData: IGroupByUnitData }) => {
  const commonCostKey = groupByUnitData.mostCommonUnitStats.cost.toKey();
  return (
    <div className={["flex flex-col rounded-md p-1", getStyleForUnit(groupByUnitData.unit)].join(" ")}>
      <UnitLine unit={groupByUnitData.unit} />
      <UnitDisplayLine className="text-xs mt-1">
        <CostPresentation cost={groupByUnitData.mostCommonUnitStats.cost} />
      </UnitDisplayLine>
      <div className="grid grid-cols-8 gap-1 p-1 mt-1">
        {groupByUnitData?.civs.map((c, _index) => (
          <div key={`${c.civ.key}`}>
            <SlTooltip style={{ ["--show-delay" as string]: "400" }}>
              <div className="flex flex-col gap-1" slot="content">
                <span className="font-bold leading-6">{c.civ.value}</span>
                <span dangerouslySetInnerHTML={{ __html: c.civ.help }} />
              </div>
              <div className="flex flex-col items-center">
                <img src={getCivImgUrl(c.civ.key)} className="w-7 h-7" />
                {c.unitStats.cost.toKey() !== commonCostKey && (
                  // TODO: Doesn't seem to ever kick in
                  <UnitDisplayLine className="text-xs mt-1">
                    <CostPresentation cost={c.unitStats.cost} />
                  </UnitDisplayLine>
                )}
              </div>
            </SlTooltip>
          </div>
        ))}
      </div>
    </div>
  );
};

const UnitPresentation = ({ unitCivData, showCivName }: { unitCivData: IUnitCivData; showCivName: boolean }) => (
  <div className={["flex flex-col rounded-md p-1", getStyleForUnit(unitCivData.unit)].join(" ")}>
    {showCivName && (
      <UnitDisplayLine>
        <SlTooltip style={{ ["--show-delay" as string]: "400" }}>
          <div className="flex flex-col gap-1" slot="content">
            <span className="font-bold leading-6">{unitCivData.civ.value}</span>
            <span dangerouslySetInnerHTML={{ __html: unitCivData.civ.help }} />
          </div>
          <img src={getCivImgUrl(unitCivData.civ.key)} className="w-7 h-7 flex-shrink-0 mt-[2px]" />
          <div className="leading-none">{unitCivData.civ.value}</div>
        </SlTooltip>
      </UnitDisplayLine>
    )}
    <UnitLine unit={unitCivData.unit} />
    <UnitDisplayLine className="text-xs mt-1">
      <CostPresentation cost={unitCivData.unitStats.cost} />
    </UnitDisplayLine>
    <UnitLine unit={unitCivData.unit} />
    <UnitDisplayLine className="text-xs mt-1">
      <CostPresentation cost={unitCivData.unitStats.cost} />
    </UnitDisplayLine>
  </div>
);

const UnitLine = ({ unit }: { unit: IUnitData }) => (
  <>
    <UnitDisplayLine>
      <SlTooltip style={{ ["--show-delay" as string]: "400" }}>
        <div className="flex flex-col gap-1" slot="content">
          <span className="font-bold leading-6">{unit.value}</span>
          <span dangerouslySetInnerHTML={{ __html: unit.help.about }} />
        </div>
        <img src={getUnitImgUrl(unit.id)} className="w-5 h-5 flex-shrink-0 mt-[2px] rounded-md opacity-80 ml-[4px]" />
        <span className="ml-[4px]">{unit.value}</span>
        <span className="opacity-50 ml-[4px] text-xs mt-[0.18rem]">{unit.id}</span>
      </SlTooltip>
    </UnitDisplayLine>
    <div className="text-sm leading-1 flex flex-col gap-0 px-2 mt-1">
      {unit.help.strong !== "" && (
        <span className="w-3/4 bg-gradient-to-br via-30% from-green-800/40 to-green-800/0 rounded-md flex-grow p-1 whitespace-normal">
          {unit.help.strong}
        </span>
      )}
      {unit.help.weak !== "" && (
        <span className="w-3/4 bg-gradient-to-br via-30% from-orange-800/40 to-orange-800/0 rounded-md flex-grow p-1 whitespace-normal">
          {unit.help.weak}
        </span>
      )}
    </div>
  </>
);

export default App;
