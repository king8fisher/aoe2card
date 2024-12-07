import { useCallback, useEffect, useMemo, useState } from "react";
import SearchInput from "../../components/atoms/SearchInput";
import { ButtonGroup, IFilterStats } from "../../components/molecules/ButtonGroup";
import { CivView } from "../../components/molecules/CivView";
import { AllCivsHoverOver } from "../../components/molecules/CivView/AllCivsHoverOver";
import GenericUnitsView from "../../components/molecules/GenericUnitsView";
import {
  ICivData,
  IGroupByUnitData,
  IUnitCivData,
  groupByUnitType,
  searchCivs,
  searchUnits
} from "../../data/model";
import { DataFilter } from "../../helpers/constants";
import { useDebounce } from "../../helpers/debouncers";
import { Container } from "../../styles";

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

  useEffect(() => {
    document.body.classList.add("ready");
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

  const debouncedSearch = useDebounce(search, 400);

  const handleSetSearchTerm = useCallback(
    (nextSearchTerm: string) => {
      setSearchTerm(nextSearchTerm);
      debouncedSearch(nextSearchTerm);
    },
    [debouncedSearch]
  );

  const filterStats: IFilterStats = useMemo(() => {
    return {
      unitsFoundAmount: searchResult?.grouped.length || 0,
      civsFoundAmount: searchResult?.civs.length || 0,
    };
  }, [searchResult]);

  return (
    <Container className="flex flex-col gap-2">
      <SearchInput searchTerm={searchTerm} setSearchTerm={handleSetSearchTerm} isLoading={isLoading} />
      <ButtonGroup filter={filter} setFilter={setFilter} filterStats={filterStats} />
      {filter === DataFilter.units && <GenericUnitsView genericUnitsData={searchResult} />}
      {filter === DataFilter.civs && searchResult?.civs.map((civ) => <CivView key={civ.key} civ={civ} />)}
      {filter === DataFilter.civs && <AllCivsHoverOver />}
    </Container>
  );
};

export default Home;
