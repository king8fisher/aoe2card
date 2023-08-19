# aoe2card

Playground for a future app that digs into AOE2 data and presents it in a user friendly way.

Temporary link for the project using github pages:
https://king8fisher.github.io/aoe2card/

## Requirements

- [node v18.\*](https://nodejs.org/en)
  - It's possible to use `node v14.*`, but then `pnpm v7.*` is required.
- [pnpm](https://pnpm.io/installation)
- Optional (if `tsx` desired):
  - `pnpm install -g tsx` (Will tell if environment PATH lacks an entry, fix accordingly).
- Compile project for development:
  - `cd app`
    - `pnpm i` - install dependencies.
    - `pnpm dev` - start server in development mode.

## VSCode Extensions

- [styled-components.vscode-styled-components](https://marketplace.visualstudio.com/items?itemName=styled-components.vscode-styled-components) for Styled Components

## Data Sources

- https://github.com/HSZemi/aoe2dat is the source for SiegeEngineers.
  - https://raw.githubusercontent.com/HSZemi/aoe2dat/master/data/units_buildings_techs.json
  - https://raw.githubusercontent.com/HSZemi/aoe2dat/master/data/units_buildings_techs.ror.json - apparently Return of Rome

SiegeEngineers combine/copy those:

- [aoe2techtree](https://aoe2techtree.net) projct:
  - https://raw.githubusercontent.com/SiegeEngineers/aoe2techtree/master/data/data.json - processed data
- [halfon](https://halfon.aoe2.se/) project:
  - (https://raw.githubusercontent.com/SiegeEngineers/halfon/master/data/units_buildings_techs.de.json - seems to be equal to https://raw.githubusercontent.com/HSZemi/aoe2dat/master/data/units_buildings_techs.json)

## CHANGELOG

- `pnpm create vite aoe2-card-app-react-ts --template react-ts`
  - `cd ` into
  - `pnpm i`
  - `pnpm dev`
- Create `data` folder
  - Pull current `data.json` into it from SeigeEngineers:
    ```powershell
    > iwr -outf data.json https://raw.githubusercontent.com/SiegeEngineers/aoe2techtree/master/data/data.json
    > iwr -outf strings.json https://raw.githubusercontent.com/SiegeEngineers/aoe2techtree/master/data/locales/en/strings.json
    > iwr -outf units_buildings_techs.json https://raw.githubusercontent.com/HSZemi/aoe2dat/master/data/units_buildings_techs.json
    ```
    ```console
    $ wget https://raw.githubusercontent.com/SiegeEngineers/aoe2techtree/master/data/data.json
    $ wget https://raw.githubusercontent.com/SiegeEngineers/aoe2techtree/master/data/locales/en/strings.json
    $ wget https://raw.githubusercontent.com/HSZemi/aoe2dat/master/data/units_buildings_techs.json
    ```
  - Format both files for uniformness in searches.
- `tsx data/model.ts` to run the file in `node` for quick console.log outputs.
