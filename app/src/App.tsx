import { SlButton, SlDropdown, SlInput, SlMenu, SlMenuItem } from "@shoelace-style/shoelace/dist/react"
import "@shoelace-style/shoelace/dist/themes/dark.css"
import "@shoelace-style/shoelace/dist/themes/light.css"
import { useEffect, useMemo, useState } from "react"
import { IUnitCivData, allCivUnits, allCivs, searchUnits } from "../../data/model"
import { DarkModeButton } from "./DarkMode"
import { Debouncer } from "./debouncer"
import { Container, FlexWrap, UnitDisplayLine, UnitDisplayLineItemsCentered, UnitsPresentationFlex } from "./styles"

function App() {
  const [selectedCivKey, setCiv] = useState("Aztecs")
  const civsList = allCivs()

  useEffect(() => {
    document.body.classList.add("ready")
  })

  // TODO: ref={searchInput} when shoelace fixes incompatibility with ref
  //
  // const searchInput = useCallback((inputElement: HTMLElement) => {
  //   if (inputElement) {
  //     inputElement.focus();
  //   }
  // }, []);

  const searchDebouncer = new Debouncer();
  useEffect(() => {
    return () => { searchDebouncer.destroy() }
  })

  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState<IUnitCivData[]>();
  const unitsByCiv: IUnitCivData[] = useMemo(() => {
    return allCivUnits(selectedCivKey)
  }, [selectedCivKey])

  useMemo(() => {
    let result = searchUnits(search)
    setSearchResult(result);
  }, [search])

  return (
    <>
      <div className="px-2 py-2 bg-zinc-300 dark:bg-zinc-800">
        <Container className="flex flex-row items-center justify-between max-w-3xl mx-auto">
          <a href="/">Aoe2 Card</a>
          <div className="flex flex-row items-center gap-1">
            <SlInput clearable placeholder="Search" value={search} autoFocus
              onInput={(e) => {
                let v = e.currentTarget.value;
                searchDebouncer.run(() => { setSearch(v) }, 200)
              }}
              onSlClear={(_e) => {
                searchDebouncer.run(() => { setSearch('') }, 200)
              }}>

            </SlInput>
          </div>
          <DarkModeButton />
        </Container>

      </div >
      <Container>
        <UnitsPresentationFlex>
          {searchResult?.map((v, _index) => (
            <UnitPresentation unitCivData={v} showCivName={true} />
          ))}
        </UnitsPresentationFlex>
        <SlDropdown className="shadow-lg">
          <SlButton slot="trigger" caret>
            <img slot="prefix" src={civImgUrl(selectedCivKey)} className="w-5 h-5 flex-shrink-0" />
            {selectedCivKey}
          </SlButton>
          <SlMenu
            onSlSelect={(event) => {
              setCiv(event.detail.item.value)
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
            <UnitPresentation unitCivData={v} showCivName={false} />
          ))}
        </UnitsPresentationFlex>
      </Container>

    </>
  )
}

function civImgUrl(civKey: string) {
  return `https://aoe2techtree.net/img/Civs/${civKey.toLowerCase()}.png`
}

function UnitPresentation({ unitCivData, showCivName }: { unitCivData: IUnitCivData, showCivName: boolean }) {
  return (
    <>
      <div className={
        ["flex flex-col rounded-md p-1",
          unitCivData.unit.isImperialAgeUniqueUnit ? "bg-blue-400 dark:bg-blue-700" : "bg-zinc-300 dark:bg-zinc-700"
        ].join(" ")}>
        {showCivName ?
          <UnitDisplayLineItemsCentered>
            <img src={civImgUrl(unitCivData.civ.key)}
              className="w-7 h-7 flex-shrink-0 mt-[2px]" />
            <div className="leading-none">{unitCivData.civ.value}</div>
          </UnitDisplayLineItemsCentered>
          : <></>
        }
        <UnitDisplayLineItemsCentered>
          <img src={`https://aoe2techtree.net/img/Units/${unitCivData.unit.id}.png`}
            className="w-5 h-5 flex-shrink-0 mt-[2px] rounded-md opacity-50 ml-[4px]" />
          {unitCivData.unit.value}
          <span className="opacity-50 ml-1 text-xs">
            {unitCivData.unit.id}
          </span>
        </UnitDisplayLineItemsCentered>
        <UnitDisplayLine className="text-xs opacity-80 mt-1">
          <CostPresentation unitCivData={unitCivData} />
        </UnitDisplayLine>
      </div>
    </>
  )
}

function CostPresentation({ unitCivData }: { unitCivData: IUnitCivData }) {
  return (
    <FlexWrap>
      <SingleCostPresenter type="f" amount={unitCivData.unitStats.cost.food} />
      <SingleCostPresenter type="w" amount={unitCivData.unitStats.cost.wood} />
      <SingleCostPresenter type="g" amount={unitCivData.unitStats.cost.gold} />
      <SingleCostPresenter type="s" amount={unitCivData.unitStats.cost.stone} />
    </FlexWrap>
  )
}

function SingleCostPresenter({ type, amount }: { type: string, amount: number }) {
  return (
    <span className={amount == 0 ? "opacity-30" : ""}>{type}{amount}</span>
  )
}

export default App
