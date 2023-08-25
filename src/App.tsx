import { setBasePath } from "@shoelace-style/shoelace";

import "@shoelace-style/shoelace/dist/themes/dark.css";
import "@shoelace-style/shoelace/dist/themes/light.css";

import { useEffect, useMemo, useState } from "react";
import Navbar from "./components/molecules/Navbar";
import { IGroupByUnitData, IUnitCivData, allCivUnits, allCivs, groupByUnitType, searchUnits } from "./data/model";
import { createPromiseDebouncer } from "./helpers/debouncers";
import { Container, UnitsPresentationFlex } from "./styles";
import { UnitPresentation } from "./components/molecules/UnitPresentation";
import { GroupedUnitPresentation } from "./components/molecules/GroupedUnitPresentation";
import { CivView } from "./components/molecules/CivView";
import { ButtonGroup } from "./components/molecules/ButtonGroup";

setBasePath("/shoelace");

const debouncer = new createPromiseDebouncer<IUnitCivData[]>();

interface ISearchResult {
  grouped: IGroupByUnitData[];
  units: IUnitCivData[];
}

const App = () => {
  const [selectedCivKey, setCiv] = useState("Aztecs");
  const civsList = allCivs();
  const [isGroupedView, setIsGroupedView] = useState<boolean>(true);
  const [isCivViewActive, setIsCivViewActive] = useState<boolean>(false);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState<ISearchResult>();

  useEffect(() => () => {
    document.body.classList.add("ready");
    debouncer.destroyDebouncer();
  });

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
        <ButtonGroup
          isGroupedView={isGroupedView}
          setIsGroupedView={setIsGroupedView}
          isCivViewActive={isCivViewActive}
          setIsCivViewActive={setIsCivViewActive}
        />
        <UnitsPresentationFlex>
          {isGroupedView
            ? searchResult?.grouped.map((v, _index) => (
                <GroupedUnitPresentation key={`${v.unit.id}`} groupByUnitData={v} />
              ))
            : searchResult?.units.map((v, _index) => (
                <UnitPresentation key={`${v.civ.key}-${v.unit.id}`} unitCivData={v} showCivName={true} />
              ))}
        </UnitsPresentationFlex>
        {isCivViewActive && (
          <CivView selectedCivKey={selectedCivKey} civsList={civsList} setCiv={setCiv} unitsByCiv={unitsByCiv} />
        )}
      </Container>
    </>
  );
};

export default App;
