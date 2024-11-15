import { useCallback, useEffect, useMemo, useState } from "react";
import SearchInput from "../../components/atoms/SearchInput";
import SingleCivIcon, { TooltipContent } from "../../components/atoms/SingleCivIcon";
import { ButtonGroup, IFilterStats } from "../../components/molecules/ButtonGroup";
import { CivView } from "../../components/molecules/CivView";
import GenericUnitsView from "../../components/molecules/GenericUnitsView";
import {
  ICivData,
  IGroupByUnitData,
  IUnitCivData,
  getAllCivs,
  groupByUnitType,
  searchCivs,
  searchUnits,
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

  const [civTip, setCivTip] = useState<ICivData | null>(null);

  return (
    <Container>
      <SearchInput searchTerm={searchTerm} setSearchTerm={handleSetSearchTerm} isLoading={isLoading} />
      <ButtonGroup filter={filter} setFilter={setFilter} filterStats={filterStats} />
      {filter === DataFilter.units && <GenericUnitsView genericUnitsData={searchResult} />}
      {filter === DataFilter.civs && searchResult?.civs.map((civ) => <CivView key={civ.key} civ={civ} />)}
      <div className="flex flex-row flex-wrap md:flex-nowrap gap-1 items-start pb-8">
        {filter === DataFilter.civs && (
          <div className="grid grid-cols-8 gap-1 p-1 mt-1 max-w-[300px] shrink-0">
            {getAllCivs().map((civData) => (
              <SingleCivIcon
                highlight
                disablePopup
                civData={civData}
                key={civData.key}
                onMouseOver={() => {
                  setCivTip(civData);
                }}
                onMouseLeave={() => {
                  // We want to keep the last still visible.
                  //setCivTip(null)
                }}
              />
            ))}
          </div>
        )}
        {filter === DataFilter.civs && civTip && (
          <div className="grow flex flex-col gap-2 p-2 rounded bg-black/20">
            <TooltipContent civData={civTip} />
          </div>
        )}
      </div>
    </Container>
  );
};

export default Home;
