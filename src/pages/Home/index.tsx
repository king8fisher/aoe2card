import { useCallback, useEffect, useMemo, useState } from "react";
import { ButtonGroup, IFilterStats } from "../../components/molecules/ButtonGroup";
import { CivSingleView } from "../../components/molecules/CivView";
import GenericUnitsView from "../../components/molecules/GenericUnitsView";
import { ICivData, IGroupByUnitData, IUnitCivData, groupByUnitType, searchCivs, searchUnits } from "../../data/model";
import { DataFilter } from "../../helpers/constants";
import { CancellableDebouncer } from "../../helpers/debouncers";
import { Container } from "../../styles";
import SearchInput from "../../components/atoms/SearchInput";

const debouncer = new CancellableDebouncer<[IUnitCivData[], ICivData[]]>();

export interface ISearchResult {
  grouped: IGroupByUnitData[];
  units: IUnitCivData[];
  civs: ICivData[];
}

const Home = () => {
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

  const filterStats: IFilterStats = useMemo(() => {
    return {
      unitsFoundAmount: searchResult?.grouped.length || 0,
      civsFoundAmount: searchResult?.civs.length || 0,
    };
  }, [searchResult]);

  return (
    <Container>
      <SearchInput searchTerm={searchTerm} setSearchTerm={handleSetSearchTerm} isLoading={isLoading} />
      <ButtonGroup filter={filter} setFilter={setFilter} filterStats={filterStats} />
      {filter === DataFilter.units && <GenericUnitsView genericUnitsData={searchResult} />}
      {filter === DataFilter.civs && searchResult?.civs.map((c, _index) => <CivSingleView key={c.key} civ={c} />)}
    </Container>
  );
};

export default Home;
