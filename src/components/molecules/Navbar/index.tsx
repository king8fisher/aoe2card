import { SlIcon, SlInput, SlSpinner } from "@shoelace-style/shoelace/dist/react";
import { useCallback, useState } from "react";
import { Container } from "../../../styles";
import { DarkModeButton } from "../DarkMode";

type NavbarProps = {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  isLoading: boolean;
};

const Navbar = ({ searchTerm, setSearchTerm, isLoading }: NavbarProps): JSX.Element => {
  // TODO: Figure out how to override `any`

  const [focusedOnce, setFocusedOnce] = useState(false);

  const searchInput = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (inputElement: any) => {
      if (!focusedOnce) {
        if (inputElement) {
          if (inputElement.input) {
            inputElement.focus();
            setFocusedOnce(true);
          }
        }
      }
    },
    [focusedOnce]
  );

  return (
    <div className="py-2 bg-zinc-300 dark:bg-zinc-800">
      <Container className="flex flex-row gap-2 items-center justify-between">
        <a
          href="/"
          className="shrink-0 p-[0.4rem] rounded-md bg-gradient-to-b from-zinc-100/20 to-zinc-100/50 dark:from-zinc-900/20 dark:to-zinc-900/50"
        >
          <div className="flex flex-row flex-wrap gap-1 items-center">
            <img src="favicon.png" className="w-6 h-6 shrink-0" />
            <span className="text-center text-sm font-extralight leading-none hidden md:block opacity-40">
              Aoe2
              <br />
              Card
            </span>
          </div>
        </a>
        <div className="flex flex-row max-w-[500px] items-center gap-1">
          <SlInput
            clearable
            placeholder="Search"
            value={searchTerm}
            autoFocus
            onInput={(e) => {
              const searchValue = e?.currentTarget?.value;
              setSearchTerm(searchValue);
            }}
            onSlClear={() => {
              setSearchTerm("");
            }}
            ref={searchInput}
          >
            {isLoading ? <SlSpinner slot="prefix"></SlSpinner> : <SlIcon name="search" slot="prefix"></SlIcon>}
          </SlInput>
        </div>
        <DarkModeButton />
      </Container>
    </div>
  );
};

export default Navbar;
