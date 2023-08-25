import { setBasePath } from "@shoelace-style/shoelace";

import "@shoelace-style/shoelace/dist/themes/dark.css";
import "@shoelace-style/shoelace/dist/themes/light.css";

import { useCallback, useEffect, useMemo, useState } from "react";
import Navbar from "./components/molecules/Navbar";
import { IGroupByUnitData, IUnitCivData, allCivUnits, allCivs, groupByUnitType, searchUnits } from "./data/model";
import { debounce } from "./helpers/debounce";
import { Container, UnitsPresentationFlex } from "./styles";
import { UnitPresentation } from "./components/molecules/UnitPresentation";
import { GroupedUnitPresentation } from "./components/molecules/GroupedUnitPresentation";
import { CivView } from "./components/molecules/CivView";
import { ButtonGroup } from "./components/molecules/ButtonGroup";

setBasePath("/shoelace");

interface ISearchResult {
  grouped: IGroupByUnitData[];
  units: IUnitCivData[];
}

const App = () => {
  const [selectedCivKey, setCiv] = useState("Aztecs");
  const civsList = allCivs();
  const [isGroupedView, setIsGroupedView] = useState<boolean>(true);
  const [isCivViewActive, setIsCivViewActive] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState<ISearchResult>();
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => () => {
    document.body.classList.add("ready");
  });

  const getSearchResults = useCallback((currentSearchTerm: string) => {
    try {
      const result = searchUnits(currentSearchTerm);
      const grouped = groupByUnitType(result);
      setSearchResult({ grouped, units: result });
    } catch (error) {
      // Display an error message to the user
    }
    setIsLoading(false);
  }, []);

  const handleSearchChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newSearchTerm = event.target.value;
      newSearchTerm && setIsLoading(true);
      setSearchTerm(newSearchTerm);

      if (timer) {
        clearTimeout(timer);
      }

      setTimer(setTimeout(() => getSearchResults(newSearchTerm), 300));
    },
    [getSearchResults, timer, setSearchTerm, setTimer]
  );

  const unitsByCiv: IUnitCivData[] = useMemo(() => allCivUnits(selectedCivKey), [selectedCivKey]);

  const renderSearchResults = () => (
    <UnitsPresentationFlex>
      {isGroupedView
        ? searchResult?.grouped.map((v, _index) => <GroupedUnitPresentation key={`${v.unit.id}`} groupByUnitData={v} />)
        : searchResult?.units.map((v, _index) => (
            <UnitPresentation key={`${v.civ.key}-${v.unit.id}`} unitCivData={v} showCivName={true} />
          ))}
    </UnitsPresentationFlex>
  );

  return (
    <>
      <Navbar searchTerm={searchTerm} onSearchChange={handleSearchChange} />
      <Container>
        <ButtonGroup
          isGroupedView={isGroupedView}
          setIsGroupedView={setIsGroupedView}
          isCivViewActive={isCivViewActive}
          setIsCivViewActive={setIsCivViewActive}
        />
        {isLoading ? <div>Loading...</div> : renderSearchResults()}
        {isCivViewActive && (
          <CivView selectedCivKey={selectedCivKey} civsList={civsList} setCiv={setCiv} unitsByCiv={unitsByCiv} />
        )}
      </Container>
    </>
  );
};

export default App;
