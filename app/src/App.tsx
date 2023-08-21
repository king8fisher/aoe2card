import { SlButton, SlDropdown, SlMenu, SlMenuItem } from "@shoelace-style/shoelace/dist/react";
import "@shoelace-style/shoelace/dist/themes/dark.css";
import "@shoelace-style/shoelace/dist/themes/light.css";
import { useEffect, useMemo, useState } from "react";
import { IUnitCivData, allCivUnits, allCivs, searchUnits } from "../../data/model";
import Navbar from "./components/molecules/Navbar";
import { createDebouncer } from "./helpers/tools";
import { Container, FlexWrap, UnitDisplayLine, UnitDisplayLineItemsCentered, UnitsPresentationFlex } from "./styles";

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

  const searchDebouncer = createDebouncer();
  const { destroyDebouncer, runDebouncer } = searchDebouncer || {};
  useEffect(() => {
    return () => {
      destroyDebouncer();
    };
  });

  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState<IUnitCivData[]>();
  const unitsByCiv: IUnitCivData[] = useMemo(() => {
    return allCivUnits(selectedCivKey);
  }, [selectedCivKey]);

  useMemo(() => {
    const result = searchUnits(search);
    setSearchResult(result);
  }, [search]);

  return (
    <>
      <Navbar search={search} setSearch={setSearch} runDebouncer={runDebouncer} />
      <Container>
        <UnitsPresentationFlex>
          {searchResult?.map((v, _index) => (
            <UnitPresentation key={`${v.civ.key}-${v.unit.id}`} unitCivData={v} showCivName={true} />
          ))}
        </UnitsPresentationFlex>
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
      </Container>

      <Container>
        <UnitsPresentationFlex>
          {unitsByCiv?.map((v, _index) => (
            <UnitPresentation key={`${v.civ.key}-${v.unit.id}`} unitCivData={v} showCivName={false} />
          ))}
        </UnitsPresentationFlex>
      </Container>
    </>
  );
}

function civImgUrl(civKey: string) {
  return `https://aoe2techtree.net/img/Civs/${civKey.toLowerCase()}.png`;
}

function UnitPresentation({ unitCivData, showCivName }: { unitCivData: IUnitCivData; showCivName: boolean }) {
  return (
    <>
      <div
        className={[
          "flex flex-col rounded-md p-1",
          unitCivData.unit.isImperialAgeUniqueUnit ? "bg-blue-400 dark:bg-blue-700" : "bg-zinc-300 dark:bg-zinc-700",
        ].join(" ")}
      >
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
        <UnitDisplayLine className="text-xs opacity-80 mt-1">
          <CostPresentation unitCivData={unitCivData} />
        </UnitDisplayLine>
      </div>
    </>
  );
}

function CostPresentation({ unitCivData }: { unitCivData: IUnitCivData }) {
  const shouldShowFoodCost = unitCivData.unitStats.cost.food > 0;
  const shouldShowWoodCost = unitCivData.unitStats.cost.wood > 0;
  const shouldShowGoldCost = unitCivData.unitStats.cost.gold > 0;
  const shouldShowStoneCost = unitCivData.unitStats.cost.stone > 0;
  return (
    <FlexWrap>
      {shouldShowFoodCost && <SingleCostPresenter type="f" amount={unitCivData.unitStats.cost.food} />}
      {shouldShowWoodCost && <SingleCostPresenter type="w" amount={unitCivData.unitStats.cost.wood} />}
      {shouldShowGoldCost && <SingleCostPresenter type="g" amount={unitCivData.unitStats.cost.gold} />}
      {shouldShowStoneCost && <SingleCostPresenter type="s" amount={unitCivData.unitStats.cost.stone} />}
    </FlexWrap>
  );
}

function SingleCostPresenter({ type, amount }: { type: string; amount: number }) {
  return (
    <span className={amount == 0 ? "opacity-30" : ""}>
      {type}
      {amount}
    </span>
  );
}

export default App;
