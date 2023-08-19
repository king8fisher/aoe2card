import '@shoelace-style/shoelace/dist/themes/dark.css';
import '@shoelace-style/shoelace/dist/themes/light.css';
// import { setBasePath } from '@shoelace-style/shoelace/dist/utilities/base-path.js';
import { SlButton, SlDropdown, SlInput, SlMenu, SlMenuItem } from '@shoelace-style/shoelace/dist/react';
import { useEffect, useMemo, useState } from 'react';
import { allCivs, allUnits, imperialAgeUniqueUnit, searchUnits, unitCivData, unitData } from '../../data/model';
import { DarkModeButton } from './DarkMode';
import { Debouncer } from './debouncer';

function App() {
  // setBasePath('assets/shoelace');

  const [civ, setCiv] = useState('Aztecs');
  const allCivs_ = allCivs()

  useEffect(() => {
    document.body.classList.add('ready');
  })
  const visibleUnits = useMemo(() => allUnits(civ), [civ]);
  const imerialUnit = useMemo(() => imperialAgeUniqueUnit(civ), [civ]);

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
  const [searchResult, setSearchResult] = useState<unitCivData[]>();

  useMemo(() => {
    let result = searchUnits(search)
    setSearchResult(result);
  }, [search])

  return (
    <>
      <div className="py-2 bg-zinc-300 dark:bg-zinc-800">
        <div className="flex flex-row items-center justify-between max-w-3xl mx-auto">
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
        </div>

      </div >
      <div className="max-w-3xl mx-auto">
        <div className="py-2 flex flex-row flex-wrap gap-1">
          {searchResult?.map((v, _index) => (
            <UnitPresentation unitCivData={v} />
          ))}
        </div>
        <SlDropdown className="shadow-lg">
          <SlButton slot="trigger" caret>
            {civ}
          </SlButton>
          <SlMenu onSlSelect={event => { setCiv(event.detail.item.value) }}>
            {allCivs_.map((value, _index) => (
              <SlMenuItem key={value.key} value={value.key}>{value.value}</SlMenuItem>
            ))}
          </SlMenu>
        </SlDropdown>

        <div className="flex flex-row flex-wrap gap-1 mt-1">
          <span key={imerialUnit.key} className="p-2 bg-blue-400 dark:bg-blue-700 rounded-md">
            {imerialUnit.value}
            <span className="opacity-50 ml-1 text-xs">{imerialUnit.key}</span>
          </span>
          {visibleUnits.map((v: unitData) => (
            <span key={v.key} className="p-2 bg-zinc-400 dark:bg-zinc-700 rounded-md">{v.value}</span>
          ))}
        </div>
      </div>
    </>
  )
}

interface UnitPresentationProps {
  unitCivData: unitCivData
}

function UnitPresentation(props: UnitPresentationProps) {
  let unitCivData: unitCivData = props.unitCivData
  return (
    <>
      <div className={
        ["flex flex-col space-y-0 rounded-md p-1",
          unitCivData.unit.isImperialAgeUniqueUnit ? "bg-blue-400 dark:bg-blue-700" : "bg-zinc-300 dark:bg-zinc-700"
        ].join(" ")}>
        <div className="flex flex-row gap-1 items-center">
          <img src={`https://aoe2techtree.net/img/Civs/${unitCivData.civ.value.toLowerCase()}.png`}
            className="w-6 h-6 ml-1 flex-shrink-0 mt-[2px]" />
          <div className="leading-none">{unitCivData.civ.value}</div>
        </div>
        <div className="px-1 leading-none">{unitCivData.unit.value}<span className="opacity-50 ml-1 text-xs">{unitCivData.unit.key}</span></div>
        <div className="px-1 leading-none text-xs opacity-30">
          <CostPresentation unitCivData={unitCivData} />
        </div>
      </div>
    </>
  )
}

function CostPresentation({ unitCivData }: { unitCivData: unitCivData }) {
  return (
    <div className="flex flex-row gap-1">
      <span>F{unitCivData.unitStats.cost.food}</span>
      <span>W{unitCivData.unitStats.cost.wood}</span>
      <span>G{unitCivData.unitStats.cost.gold}</span>
      <span>S{unitCivData.unitStats.cost.stone}</span>
    </div>
  )
}

export default App
