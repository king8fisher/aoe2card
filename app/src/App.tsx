import "@shoelace-style/shoelace/dist/themes/dark.css"
import "@shoelace-style/shoelace/dist/themes/light.css"
import { SlButton, SlDropdown, SlMenu, SlMenuItem } from "@shoelace-style/shoelace/dist/react"
import { useEffect, useMemo, useState } from "react"
import { getAllCivs, allUnits, imperialAgeUniqueUnit } from "../../data/model"
import { DarkModeButton } from "./DarkMode"
import { Container, ListItem, ListWrapper } from "./styles"

interface IUniqueUnite {
  key: string
  value: string
}

interface IVisibleUnits {
  key: string
  value: string
}

function App() {
  const [civ, setCiv] = useState("Aztecs")
  const allCivs = getAllCivs()

  useEffect(() => {
    document.body.classList.add("ready")
  })
  const visibleUnits = useMemo(() => allUnits(civ), [civ])
  const uniqueUnite: IUniqueUnite = useMemo(() => imperialAgeUniqueUnit(civ), [civ])

  return (
    <>
      <div className="px-2 py-2 bg-zinc-300 dark:bg-zinc-800">
        <div className="flex flex-row items-center justify-between max-w-3xl mx-auto">
          <a href="/">Aoe2 Card</a>
          <SlDropdown className="shadow-lg">
            <SlButton slot="trigger" caret>
              {civ}
            </SlButton>
            <SlMenu
              onSlSelect={(event) => {
                setCiv(event.detail.item.value)
              }}
            >
              {allCivs.map((value) => (
                <SlMenuItem key={value.key} value={value.key}>
                  {value.value}
                </SlMenuItem>
              ))}
            </SlMenu>
          </SlDropdown>
          <DarkModeButton />
        </div>
      </div>
      <Container>
        <ListWrapper>
          <ListItem key={uniqueUnite.key}>{uniqueUnite.value}</ListItem>
          {visibleUnits.map((visableUnit: IVisibleUnits) => (
            <ListItem key={visableUnit.key}>{visableUnit.value}</ListItem>
          ))}
        </ListWrapper>
      </Container>
    </>
  )
}

export default App
