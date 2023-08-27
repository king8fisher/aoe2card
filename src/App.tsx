import { setBasePath } from "@shoelace-style/shoelace";

import "@shoelace-style/shoelace/dist/themes/dark.css";
import "@shoelace-style/shoelace/dist/themes/light.css";

import { SlDetails, SlIcon } from "@shoelace-style/shoelace/dist/react";
import { useCallback, useEffect, useState } from "react";
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
import { CancellableDebouncer } from "./helpers/debouncers";
import { unitImgUrl } from "./helpers/tools";
import { Container, UnitsPresentationFlex } from "./styles";

setBasePath("/shoelace");

const debouncer = new CancellableDebouncer<[IUnitCivData[], ICivData[]]>();

interface ISearchResult {
  grouped: IGroupByUnitData[];
  units: IUnitCivData[];
  civs: ICivData[];
}

const App = () => {
  const [selectedCivKey, setSelectedCivKey] = useState("Aztecs");
  const [isGroupedView, setIsGroupedView] = useState<boolean>(true);
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

  // TODO: Must be a shoelace bug. Removing a hover from any SlTooltip within this SlDetails
  // makes details collapse when onSlShow & onSlHide are defined. Find a workaround or file a bug report.
  const [groupViewOpen, setGroupViewOpen] = useState(true);

  return (
    <>
      <Navbar searchTerm={searchTerm} setSearchTerm={handleSetSearchTerm} isLoading={isLoading} />
      <Container>
        {(searchResult?.grouped.length || 0) > 0 && (
          <SlDetails
            className="sl-details w-full"
            open={groupViewOpen}
            // onSlShow={() => setGroupViewOpen(true)}
            // onSlHide={() => setGroupViewOpen(false)}
          >
            <SlIcon name="plus-square" slot="expand-icon" />
            <SlIcon name="dash-square" slot="collapse-icon" />
            <span slot="summary">
              <div className="flex flex-row flex-wrap -space-x-2 pr-4">
                {searchResult?.grouped.map((v, _index) => {
                  return (
                    <img
                      src={unitImgUrl(v.unit.id)}
                      className="w-8 h-8 flex-shrink-0 rounded-full border-white dark:border-zinc-400 border-2 bg-zinc-300 dark:bg-zinc-700 shadow-sm"
                    />
                  );
                })}
              </div>

              {/* Found: {isGroupedView ? searchResult?.grouped.length : searchResult?.units.length} */}
            </span>
            <div className="flex flex-col gap-2">
              <ButtonGroup isGroupedView={isGroupedView} setIsGroupedView={setIsGroupedView} />
              <UnitsPresentationFlex>
                {isGroupedView
                  ? searchResult?.grouped.map((v, _index) => (
                      <GroupedUnitPresentation key={v.unit.id} groupByUnitData={v} />
                    ))
                  : searchResult?.units.map((v, _index) => (
                      <UnitPresentation key={`${v.civ.key}-${v.unit.id}`} unitCivData={v} showCiv={true} />
                    ))}
              </UnitsPresentationFlex>
            </div>
          </SlDetails>
        )}

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
