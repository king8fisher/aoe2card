import { Container } from "../../../styles";
import { DarkModeButton } from "../DarkMode";

const Navbar = (): JSX.Element => (
  <div className="py-2 bg-zinc-300 dark:bg-zinc-800">
    <Container className="flex flex-row gap-4 items-center justify-between">
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
      <DarkModeButton />
    </Container>
  </div>
);

export default Navbar;
