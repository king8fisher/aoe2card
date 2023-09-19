import { setBasePath } from "@shoelace-style/shoelace";

import "@shoelace-style/shoelace/dist/themes/dark.css";
import "@shoelace-style/shoelace/dist/themes/light.css";

import { useCallback, useEffect, useState } from "react";
import { ButtonGroup } from "./components/molecules/ButtonGroup";
import { CivSingleView } from "./components/molecules/CivView";
import Navbar from "./components/molecules/Navbar";
import { ICivData, IGroupByUnitData, IUnitCivData, groupByUnitType, searchCivs, searchUnits } from "./data/model";
import { CancellableDebouncer } from "./helpers/debouncers";
import { Container } from "./styles";
import { DataFilter } from "./helpers/constants";
import GenericUnitsView from "./components/molecules/GenericUnitsView";

setBasePath("/shoelace");

const debouncer = new CancellableDebouncer<[IUnitCivData[], ICivData[]]>();

export interface ISearchResult {
  grouped: IGroupByUnitData[];
  units: IUnitCivData[];
  civs: ICivData[];
}

const App = () => {
  // const [selectedCivKey, setSelectedCivKey] = useState("Aztecs");
  const [filter, setFilter] = useState<DataFilter>(DataFilter.units);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState<ISearchResult>();
  const [isLoading, setLoading] = useState(false);

  useEffect(
    () => {
      document.body.classList.add("ready");
      // Return cleanup function
      return () => {
        debouncer.destroyDebouncer();
      };
    },
    [] // Ensure []. Otherwise this will be called more than needed
  );

  const handleSetSearchTerm = useCallback((nextSearchTerm: string) => {
    setSearchTerm(nextSearchTerm);
    setLoading(true);
    const s = nextSearchTerm; // Cache search term copy
    debouncer.runDebounced({
      calc: () => {
        // if (s.trim().length < 2) {
        //   return [[], []];
        // }
        // const t0 = performance.now();
        const u = searchUnits(s);
        const c = searchCivs(s);
        // const t1 = performance.now();
        // console.log(`Search done in ${t1 - t0} ms.`);
        return [u, c];
      },
      assign: ([v, c]) => {
        setSearchResult({
          grouped: groupByUnitType(v),
          units: v,
          civs: c,
        });
      },
      reject: (_) => {},
      destroy: () => {
        setLoading(false);
      },
      delay: 400,
    });
  }, []);

  return (
    <>
      <Navbar searchTerm={searchTerm} setSearchTerm={handleSetSearchTerm} isLoading={isLoading} />
      <Container>
        <ButtonGroup filter={filter} setFilter={setFilter} />
        {filter === DataFilter.units && <GenericUnitsView genericUnitsData={searchResult} />}
        {filter === DataFilter.civs && searchResult?.civs.map((c, _index) => <CivSingleView key={c.key} civ={c} />)}
      </Container>
    </>
  );
};

export default App;
