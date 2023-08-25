import { setBasePath } from "@shoelace-style/shoelace";

import "@shoelace-style/shoelace/dist/themes/dark.css";
import "@shoelace-style/shoelace/dist/themes/light.css";

import { SlDetails, SlIcon } from "@shoelace-style/shoelace/dist/react";
import { useEffect, useState } from "react";
import { ButtonGroup } from "./components/molecules/ButtonGroup";
import { CivSingleView, CivView } from "./components/molecules/CivView";
import { GroupedUnitPresentation } from "./components/molecules/GroupedUnitPresentation";
import Navbar from "./components/molecules/Navbar";
import { UnitPresentation } from "./components/molecules/UnitPresentation";
import {
  ICivData,
  IGroupByUnitData,
  IUnitCivData,
  allCivs,
  groupByUnitType,
  searchCivs,
  searchUnits,
} from "./data/model";
import { cancellableDebouncer } from "./helpers/debouncers";
import { Container, UnitsPresentationFlex } from "./styles";

setBasePath("/shoelace");

const debouncer = new cancellableDebouncer<[IUnitCivData[], ICivData[]]>();

interface ISearchResult {
  grouped: IGroupByUnitData[];
  units: IUnitCivData[];
  civs: ICivData[];
}

const App = () => {
  const [selectedCivKey, setSelectedCivKey] = useState("Aztecs");
  const civsList = allCivs();
  const [isGroupedView, setIsGroupedView] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState<ISearchResult>();
  const [isLoading, setLoading] = useState(false);
  const [showDropdown] = useState(false);

  useEffect(() => {
    document.body.classList.add("ready");
  });

  useEffect(
    () => {
      // Return cleanup function
      return () => {
        debouncer.destroyDebouncer();
      };
    },
    [] // Ensure []. Otherwise this will be called more than needed
  );

  useEffect(() => {
    setLoading(true);
    const s = searchTerm; // Cache search term copy
    debouncer.runDebounced(
      {
        calc: () => {
          return [searchUnits(s), searchCivs(s)];
        },
        assign: ([v, c]) => {
          setSearchResult({
            grouped: groupByUnitType(v),
            units: v,
            civs: c,
          });
          setLoading(false);
        },
        reject: (_) => {
          setLoading(false);
        },
        delay: 300,
      },
      s
    );
  }, [searchTerm]);

  const renderSearchResults = () => {
    return (
      <>
        <SlDetails className="w-full mt-4" open={true}>
          <SlIcon name="plus-square" slot="expand-icon" />
          <SlIcon name="dash-square" slot="collapse-icon" />
          <span slot="summary">Found: {isGroupedView ? searchResult?.grouped.length : searchResult?.units.length}</span>
          <div>
            <ButtonGroup isGroupedView={isGroupedView} setIsGroupedView={setIsGroupedView} />
            <UnitsPresentationFlex>
              {isGroupedView
                ? searchResult?.grouped.map((v, _index) => (
                    <GroupedUnitPresentation key={v.unit.id} groupByUnitData={v} />
                  ))
                : searchResult?.units.map((v, _index) => (
                    <UnitPresentation key={`${v.civ.key}-${v.unit.id}`} unitCivData={v} showCivName={true} />
                  ))}
            </UnitsPresentationFlex>
          </div>
        </SlDetails>
        {searchResult?.civs.map((c, _index) => {
          return <CivSingleView key={c.key} civ={c} />;
        })}
      </>
    );
  };

  return (
    <>
      <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} isLoading={isLoading} />
      <Container>
        {renderSearchResults()}
        {showDropdown ? (
          <CivView selectedCivKey={selectedCivKey} civsList={civsList} setSelectedCivKey={setSelectedCivKey} />
        ) : (
          <></>
        )}
      </Container>
    </>
  );
};

export default App;
