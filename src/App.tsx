import { setBasePath } from "@shoelace-style/shoelace";

import "@shoelace-style/shoelace/dist/themes/dark.css";
import "@shoelace-style/shoelace/dist/themes/light.css";

import { SlButton, SlButtonGroup, SlDropdown, SlMenu, SlMenuItem } from "@shoelace-style/shoelace/dist/react";

import { useEffect, useMemo, useState } from "react";
import Navbar from "./components/molecules/Navbar";
import { IGroupByUnitData, IUnitCivData, allCivUnits, allCivs, groupByUnitType, searchUnits } from "./data/model";
import { createPromiseDebouncer } from "./helpers/debouncers";
import { Container, UnitsPresentationFlex } from "./styles";
import { getCivImgUrl } from "./helpers/tools";
import { UnitPresentation } from "./components/molecules/UnitPresentation";
import { GroupedUnitPresentation } from "./components/molecules/GroupedUnitPresentation";

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

export default App;
