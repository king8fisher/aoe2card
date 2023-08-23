import {
  SlButton,
  SlButtonGroup,
  SlDropdown,
  SlMenu,
  SlMenuItem,
  SlTooltip,
} from "@shoelace-style/shoelace/dist/react";
import "@shoelace-style/shoelace/dist/themes/dark.css";
import "@shoelace-style/shoelace/dist/themes/light.css";
import { useEffect, useMemo, useState } from "react";
import Navbar from "./components/molecules/Navbar";
import {
  Cost,
  IGroupByUnitData,
  IUnitCivData,
  IUnitData,
  UnitType,
  allCivUnits,
  allCivs,
  groupByUnitType,
  searchUnits,
} from "./data/model";
import { createPromiseDebouncer } from "./helpers/debouncers";
import { Container, FlexWrap, UnitDisplayLine, UnitDisplayLineItemsCentered, UnitsPresentationFlex } from "./styles";

const debouncer = new createPromiseDebouncer<IUnitCivData[]>();

function App() {
  const [selectedCivKey, setCiv] = useState("Aztecs");
  const civsList = allCivs();

  useEffect(() => {
    document.body.classList.add("ready");
  });

  // TODO: ref={searchInput} when shoelace fixes incompatibility with ref
  //
  // const searchInput = useCallback((inputElement: HTMLElement) => {
  //   if (inputElement) {
  //     inputElement.focus();
  //   }
  // }, []);

  const [groupedView, setGroupedView] = useState(true);
  const [civView, setCivView] = useState(false);

  useEffect(() => {
    return () => {
      debouncer.destroyDebouncer();
    };
  });

  interface ISearchResult {
    grouped: IGroupByUnitData[];
    units: IUnitCivData[];
  }

  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState<ISearchResult>();

  const unitsByCiv: IUnitCivData[] = useMemo(() => {
    return allCivUnits(selectedCivKey);
  }, [selectedCivKey]);

  useEffect(() => {
    debouncer.runDebounced({
      calc: () => {
        return searchUnits(search);
      },
      assign: (v) => {
        setSearchResult({
          grouped: groupByUnitType(v),
          units: v,
        });
      },
      delay: 300,
    });
  }, [search]);

  return (
    <>
      <Navbar search={search} setSearch={setSearch} />
      <Container>
        <SlButtonGroup className="mt-2">
          <SlButton size="small" variant={groupedView ? "primary" : "default"} onClick={(_) => setGroupedView(true)}>
            Grouped
          </SlButton>
          <SlButton size="small" variant={!groupedView ? "primary" : "default"} onClick={(_) => setGroupedView(false)}>
            Linear
          </SlButton>
        </SlButtonGroup>

        <SlButtonGroup className="mt-2 ml-2">
          <SlButton size="small" variant={civView ? "primary" : "default"} onClick={(_) => setCivView(!civView)}>
            Civ
          </SlButton>
        </SlButtonGroup>
        {groupedView ? (
          <UnitsPresentationFlex>
            {searchResult?.grouped.map((v, _index) => (
              <GroupedUnitPresentation key={`${v.unit.id}`} groupByUnitData={v} />
            ))}
          </UnitsPresentationFlex>
        ) : (
          <UnitsPresentationFlex>
            {searchResult?.units.map((v, _index) => (
              <UnitPresentation key={`${v.civ.key}-${v.unit.id}`} unitCivData={v} showCivName={true} />
            ))}
          </UnitsPresentationFlex>
        )}
      </Container>

      {civView ? (
        <Container>
          <SlDropdown className="shadow-lg">
            <SlButton slot="trigger" caret>
              <img slot="prefix" src={civImgUrl(selectedCivKey)} className="w-5 h-5 flex-shrink-0" />
              {selectedCivKey}
            </SlButton>
            <SlMenu
              onSlSelect={(event) => {
                setCiv(event.detail.item.value);
              }}
            >
              {civsList.map((value) => (
                <SlMenuItem key={value.key} value={value.key}>
                  {value.value}
                  <img slot="prefix" src={civImgUrl(value.key)} className="w-5 h-5 flex-shrink-0" />
                </SlMenuItem>
              ))}
            </SlMenu>
          </SlDropdown>
          <UnitsPresentationFlex>
            {unitsByCiv?.map((v, _index) => (
              <UnitPresentation key={`${v.civ.key}-${v.unit.id}`} unitCivData={v} showCivName={false} />
            ))}
          </UnitsPresentationFlex>
        </Container>
      ) : (
        <></>
      )}
    </>
  );
}

function civImgUrl(civKey: string) {
  return `https://aoe2techtree.net/img/Civs/${civKey.toLowerCase()}.png`;
}

function GroupedUnitPresentation({ groupByUnitData }: { groupByUnitData: IGroupByUnitData }) {
  let commonCostKey = groupByUnitData.mostCommonUnitStats.cost.toKey();
  return (
    <>
      <div className={["flex flex-col rounded-md p-1", styleForUnit(groupByUnitData.unit)].join(" ")}>
        <UnitDisplayLineItemsCentered>
          <img
            src={`https://aoe2techtree.net/img/Units/${groupByUnitData.unit.id}.png`}
            className="w-5 h-5 flex-shrink-0 mt-[2px] rounded-md opacity-50 ml-[4px]"
          />
          {groupByUnitData.unit.value}
          <span className="opacity-50 ml-1 text-xs">{groupByUnitData.unit.id}</span>
        </UnitDisplayLineItemsCentered>
        <UnitDisplayLine className="text-xs mt-1">
          <CostPresentation cost={groupByUnitData.mostCommonUnitStats.cost} />
        </UnitDisplayLine>
        <div className="grid grid-cols-8 gap-1 p-1 mt-1">
          {groupByUnitData?.civs.map((c, _index) => (
            <SlTooltip>
              <div className="flex flex-col gap-1" slot="content">
                <span className="font-bold leading-6">{c.civ.value}</span>
                <span dangerouslySetInnerHTML={{ __html: c.civ.about }} />
              </div>
              <div className="flex flex-col items-center">
                <img src={civImgUrl(c.civ.key)} className="w-7 h-7" />
                {c.unitStats.cost.toKey() == commonCostKey ? (
                  <></>
                ) : (
                  // TODO: Doesn't seem to ever kick in
                  <UnitDisplayLine className="text-xs mt-1">
                    <CostPresentation cost={c.unitStats.cost} />
                  </UnitDisplayLine>
                )}
              </div>
            </SlTooltip>
          ))}
        </div>
      </div>
    </>
  );
}

function styleForUnit(unit: IUnitData) {
  return unit.unitType == UnitType.ImperialAgeUniqueUnit
    ? "bg-blue-400 dark:bg-blue-700"
    : unit.unitType == UnitType.CastleAgeUniqueUnit
    ? "bg-green-400 dark:bg-green-700"
    : "bg-zinc-300 dark:bg-zinc-700";
}

function UnitPresentation({ unitCivData, showCivName }: { unitCivData: IUnitCivData; showCivName: boolean }) {
  return (
    <>
      <div className={["flex flex-col rounded-md p-1", styleForUnit(unitCivData.unit)].join(" ")}>
        {showCivName ? (
          <UnitDisplayLineItemsCentered>
            <img src={civImgUrl(unitCivData.civ.key)} className="w-7 h-7 flex-shrink-0 mt-[2px]" />
            <div className="leading-none">{unitCivData.civ.value}</div>
          </UnitDisplayLineItemsCentered>
        ) : (
          <></>
        )}
        <UnitDisplayLineItemsCentered>
          <img
            src={`https://aoe2techtree.net/img/Units/${unitCivData.unit.id}.png`}
            className="w-5 h-5 flex-shrink-0 mt-[2px] rounded-md opacity-50 ml-[4px]"
          />
          {unitCivData.unit.value}
          <span className="opacity-50 ml-1 text-xs">{unitCivData.unit.id}</span>
        </UnitDisplayLineItemsCentered>
        <UnitDisplayLine className="text-xs mt-1">
          <CostPresentation cost={unitCivData.unitStats.cost} />
        </UnitDisplayLine>
      </div>
    </>
  );
}

function CostPresentation({ cost }: { cost: Cost }) {
  const shouldShowFoodCost = cost.food > 0;
  const shouldShowWoodCost = cost.wood > 0;
  const shouldShowGoldCost = cost.gold > 0;
  const shouldShowStoneCost = cost.stone > 0;
  return (
    <FlexWrap>
      {shouldShowFoodCost && <SingleCostPresenter type="food" amount={cost.food} />}
      {shouldShowWoodCost && <SingleCostPresenter type="wood" amount={cost.wood} />}
      {shouldShowGoldCost && <SingleCostPresenter type="gold" amount={cost.gold} />}
      {shouldShowStoneCost && <SingleCostPresenter type="stone" amount={cost.stone} />}
    </FlexWrap>
  );
}

function SingleCostPresenter({ type, amount }: { type: string; amount: number }) {
  return (
    <span className={["flex flex-col gap-0 items-center", amount == 0 ? "opacity-30" : ""].join(" ")} title={type}>
      <img src={`${type}.png`} className="w-5 h-5" />
      {amount}
    </span>
  );
}

export default App;
