import { SlInput } from "@shoelace-style/shoelace/dist/react";
import { Container } from "../../../styles";
import { DarkModeButton } from "../DarkMode";

interface NavbarProps {
  search: string;
  setSearch: (value: string) => void;
  runDebouncer: (value: { fn: () => void; delay: number }) => void;
}

const Navbar = ({ search, setSearch, runDebouncer }: NavbarProps): JSX.Element => (
  <div className="px-2 py-2 bg-zinc-300 dark:bg-zinc-800">
    <Container className="flex flex-row items-center justify-between max-w-3xl mx-auto">
      <a href="/">Aoe2 Card</a>
      <div className="flex flex-row items-center gap-1">
        <SlInput
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
