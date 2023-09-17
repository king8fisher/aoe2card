import { setBasePath } from "@shoelace-style/shoelace";

import "@shoelace-style/shoelace/dist/themes/dark.css";
import "@shoelace-style/shoelace/dist/themes/light.css";

import { useCallback, useEffect, useState } from "react";
import { CivSingleView, CivView } from "./components/molecules/CivView";
import Navbar from "./components/molecules/Navbar";
import {
  ICivData,
  IGroupByUnitData,
  IUnitCivData,
  allCivs,
  groupByUnitType,
  searchCivs,
  searchUnits,
} from "./data/model";
import { CancellableDebouncer } from "./helpers/debouncers";
import { Container } from "./styles";
import GenericUnitsView from "./components/molecules/GenericUnitsView";

setBasePath("/shoelace");

const debouncer = new CancellableDebouncer<[IUnitCivData[], ICivData[]]>();

export interface ISearchResult {
  grouped: IGroupByUnitData[];
  units: IUnitCivData[];
  civs: ICivData[];
}

const App = () => {
  const [selectedCivKey, setSelectedCivKey] = useState("Aztecs");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState<ISearchResult>();
  const [isLoading, setLoading] = useState(false);
  const [showDropdown] = useState(false);

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

  const genericUnitsDataLength = searchResult?.grouped.length || 0;

  return (
    <>
      <Navbar searchTerm={searchTerm} setSearchTerm={handleSetSearchTerm} isLoading={isLoading} />
      <Container>
        {genericUnitsDataLength > 0 && <GenericUnitsView genericUnitsData={searchResult} />}
        {searchResult?.civs.map((c, _index) => {
          return <CivSingleView key={c.key} civ={c} />;
        })}
        {showDropdown ?? (
          <CivView selectedCivKey={selectedCivKey} civsList={allCivs()} setSelectedCivKey={setSelectedCivKey} />
        )}
      </Container>
    </>
  );
};

export default App;
