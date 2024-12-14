import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDebounce } from "use-debounce";
import { AllUnitsGrid } from "~/src/components/molecules/UnitPresentation/AllUnitsGrid";
import SearchInput from "../../components/atoms/SearchInput";
import { IFilterStats } from "../../components/molecules/ButtonGroup";
import { CivView } from "../../components/molecules/CivView";
import { AllCivsHoverOver } from "../../components/molecules/CivView/AllCivsHoverOver";
import GenericUnitsView from "../../components/molecules/GenericUnitsView";
import { ICivData, IGroupByUnitData, IUnitCivData, groupByUnitType, searchCivs, searchUnits } from "../../data/model";
import { DataFilter } from "../../helpers/constants";
import { Container } from "../../styles";

export interface ISearchResult {
  grouped: IGroupByUnitData[];
  units: IUnitCivData[];
  civs: ICivData[];
}

const Home = () => {
  const [filter, setFilter] = useState<DataFilter>(DataFilter.explore);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState<ISearchResult>();
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    document.body.classList.add("ready");
  }, []);

  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "k") {
        event.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const search = useCallback((nextSearchTerm: string) => {
    nextSearchTerm = nextSearchTerm.trim();
    if (nextSearchTerm.length < 2) nextSearchTerm = "";
    setLoading(true);

    const units = searchUnits(nextSearchTerm);
    const civs = searchCivs(nextSearchTerm);
    setSearchResult({
      grouped: groupByUnitType(units),
      units,
      civs,
    });
    setLoading(false);
  }, []);

  const [debouncedSearch] = useDebounce(search, 400);

  const handleSetSearchTerm = useCallback(
    (nextSearchTerm: string) => {
      setSearchTerm(nextSearchTerm);
      //debouncedSearch(nextSearchTerm);
    },
    [/*debouncedSearch*/]
  );

  const filterStats: IFilterStats = useMemo(() => {
    return {
      unitsFoundAmount: searchResult?.grouped.length || 0,
      civsFoundAmount: searchResult?.civs.length || 0,
    };
  }, [searchResult]);

  return (
    <Container className="flex flex-col gap-2">
      <SearchInput ref={searchRef} searchTerm={searchTerm} setSearchTerm={handleSetSearchTerm} isLoading={isLoading} />
      {/* <ButtonGroup filter={filter} setFilter={setFilter} filterStats={filterStats} /> */}
      {filter === DataFilter.units && <GenericUnitsView genericUnitsData={searchResult} />}
      {filter === DataFilter.civs && searchResult?.civs.map((civ) => <CivView key={civ.key} civ={civ} />)}
      {filter === DataFilter.explore && (
        <div className="flex flex-row flex-wrap gap-2">
          <div className="shrink-0">
            <span className="pl-1 text-sm opacity-50">Civs</span>
            <AllCivsHoverOver showTooltip filter={searchTerm} />
          </div>
          <div className="grow">
            <span className="pl-1 text-sm opacity-50">Units</span>
            <AllUnitsGrid filter={searchTerm} />
          </div>
        </div>
      )}
    </Container>
  );
};

export default Home;
