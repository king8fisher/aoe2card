import { useCallback, useEffect, useMemo, useState } from "react";
import { ButtonGroup, IFilterStats } from "../../components/molecules/ButtonGroup";
import { CivView } from "../../components/molecules/CivView";
import GenericUnitsView from "../../components/molecules/GenericUnitsView";
import { ICivData, IGroupByUnitData, IUnitCivData, groupByUnitType, searchCivs, searchUnits } from "../../data/model";
import { DataFilter } from "../../helpers/constants";
import { Container } from "../../styles";
import SearchInput from "../../components/atoms/SearchInput";
import { useDebounce } from "../../helpers/debouncers";

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
    <Container>
      <SearchInput searchTerm={searchTerm} setSearchTerm={handleSetSearchTerm} isLoading={isLoading} />
      <ButtonGroup filter={filter} setFilter={setFilter} filterStats={filterStats} />
      {filter === DataFilter.units && <GenericUnitsView genericUnitsData={searchResult} />}
      {filter === DataFilter.civs && searchResult?.civs.map((civ) => <CivView key={civ.key} civ={civ} />)}
    </Container>
  );
};

export default Home;
