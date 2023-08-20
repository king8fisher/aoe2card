import { SlInput } from "@shoelace-style/shoelace/dist/react";
import { Container } from "../../../styles";
import { DarkModeButton } from "../DarkMode";

interface NavbarProps {
  search: string;
  setSearch: (value: string) => void;
  runDebouncer: (value: { fn: () => void; delay: number }) => void;
}

const Navbar = ({ search, setSearch, runDebouncer }: NavbarProps): JSX.Element => (
  <div className="py-2 bg-zinc-300 dark:bg-zinc-800">
    <Container className="flex flex-row gap-2 items-center justify-between">
      <a href="/" className="shrink-0 p-[0.4rem] rounded-md bg-gradient-to-b from-zinc-100/20 to-zinc-100/50 dark:from-zinc-900/20 dark:to-zinc-900/50">
        <div className="flex flex-row flex-wrap gap-1 items-center">
          <img src="favicon.png" className="w-6 h-6 shrink-0" />
          <span className="text-center text-sm font-extralight leading-none hidden md:block opacity-40">Aoe2<br/>Card</span>
        </div>
      </a>
      <div className="flex flex-row w-full max-w-[500px] items-center gap-1">
        <SlInput
          className="w-full"
          clearable
          placeholder="Search"
          value={search}
          autoFocus
          onInput={(e) => {
            const searchValue = e?.currentTarget?.value;
            runDebouncer({
              fn: () => {
                setSearch(searchValue);
              },
              delay: 200,
            });
          }}
          onSlClear={() => {
            runDebouncer({
              fn: () => {
                setSearch("");
              },
              delay: 200,
            });
          }}
        ></SlInput>
      </div>
      <DarkModeButton />
    </Container>
  </div>
);

export default Navbar;
