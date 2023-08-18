import '@shoelace-style/shoelace/dist/themes/dark.css';
import '@shoelace-style/shoelace/dist/themes/light.css';
// import { setBasePath } from '@shoelace-style/shoelace/dist/utilities/base-path.js';
import { SlButton, SlDropdown, SlMenu, SlMenuItem } from '@shoelace-style/shoelace/dist/react';
import { useEffect, useMemo, useState } from 'react';
import { allCivs, allUnits, imperialAgeUniqueUnit } from '../../data/model';
import { DarkModeButton } from './DarkMode';

function App() {
  // setBasePath('assets/shoelace');

  const [civ, setCiv] = useState('Aztecs');
  const allCivs_ = allCivs()

  useEffect(() => {
    document.body.classList.add('ready');
  })
  const visibleUnits = useMemo(() => allUnits(civ), [civ]);
  const imerialUnit = useMemo(() => imperialAgeUniqueUnit(civ), [civ]);

  return (
    <>
      <div className="py-2 bg-zinc-300 dark:bg-zinc-800">
        <div className="flex flex-row items-center justify-between max-w-3xl mx-auto">
          <a href="/">Aoe2 Card</a>
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
          <DarkModeButton />
        </div>

      </div>
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-row flex-wrap gap-1 mt-1">
          <span key={imerialUnit.key} className="p-2 bg-blue-400 dark:bg-blue-700 rounded-md">{imerialUnit.value}</span>
          {visibleUnits.map((v: string) => (
            <span key={v.key} className="p-2 bg-zinc-400 dark:bg-zinc-700 rounded-md">{v.value}</span>
          ))}
        </div>
      </div>
    </>
  )
}

export default App
