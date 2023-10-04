# aoe2card

Playground for a future app that digs into AOE2 data and presents it in a user friendly way.

Temporary link for the project using vercel:
https://aoe2card.vercel.app/

## Requirements

- [node v18.\*](https://nodejs.org/en)
  - It's possible to use `node v14.*`, but then `pnpm v7.*` is required.
- [pnpm](https://pnpm.io/installation)
- Optional (if `tsx` desired):
  - `pnpm install -g tsx` (Will tell if environment PATH lacks an entry, fix accordingly).
- Compile project for development:
  - `pnpm i` - install dependencies.
  - `pnpm dev` - start server in development mode.
- `pnpm install -g prettier` for:
  - `prettier -w .` (which can be run with `pnpm format` as well, being a task in `package.json`)

## VSCode Extensions

- [styled-components.vscode-styled-components](https://marketplace.visualstudio.com/items?itemName=styled-components.vscode-styled-components) for Styled Components

## Data Sources

- https://github.com/HSZemi/aoe2dat is the source for SiegeEngineers.
  - https://raw.githubusercontent.com/HSZemi/aoe2dat/master/data/units_buildings_techs.json
  - https://raw.githubusercontent.com/HSZemi/aoe2dat/master/data/units_buildings_techs.ror.json - apparently Return of Rome

SiegeEngineers combine/copy those:

- [aoe2techtree](https://aoe2techtree.net) project:
  - https://raw.githubusercontent.com/SiegeEngineers/aoe2techtree/master/data/data.json - processed data
- [halfon](https://halfon.aoe2.se/) project:
  - (https://raw.githubusercontent.com/SiegeEngineers/halfon/master/data/units_buildings_techs.de.json - seems to be equal to https://raw.githubusercontent.com/HSZemi/aoe2dat/master/data/units_buildings_techs.json)

## Assets Sources

* `\Steam\steamapps\common\AoE2DE\widgetui\textures\ingame\staticons\`

## Intricacies

- Sicilians. Several "same" units can be produced from different buildings: Castle & Donjon
  - Pikeman shows as 2 IDs: 358 & 1787.
  - Spearman shows as 2 IDs: 93 & 1786.
  - Halberdier shows as 2 IDs: 359 & 1788.
  - Serjeant shows as 2 IDs: 1660 & 1658.
    - Elite Serjeant shows as 2 IDs: 1659 & 1661.
- Huns. Castle upgrade "Marauders" "Enables you to create Tarkans at Stables".
- Goths. Castle upgrade "Anarchy" "Allows Huskarls to be created at the Barracks.".

## CHANGELOG

- `pnpm create vite aoe2-card-app-react-ts --template react-ts`
  - `cd ` into
  - `pnpm i`
  - `pnpm dev`
- Create `data` folder (which is now `src/data`).
  - Step in.
  - Pull current data from **SeigeEngineers** and **HSZemi**:
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
  - Format json files for uniformness in searches (`prettier -w .`).
- `tsx data/model.ts` to run the file in `node` for quick `console.log` outputs.

## From Vite Template

### React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

#### Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
   parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
   },
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list
