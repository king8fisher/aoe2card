import Link from "next/link";
import { ThemeButton } from "~/src/components/molecules/ThemeButton";
import { Container } from "../../../styles";
import { Patch } from "../../atoms/Navbar/Patch";

import type { JSX } from "react";

const Navbar = (): JSX.Element => (
  <div className="py-0 bg-zinc-300 dark:bg-zinc-800">
    <Container className="flex flex-row items-center justify-between">
      <div className="flex flex-row gap-1 items-center" title={"AoE2 Card"}>
        <Link
          href="/"
          className="shrink-0 p-[0.4rem] rounded-md bg-gradient-to-b from-zinc-100/20 to-zinc-100/50 dark:from-zinc-900/20 dark:to-zinc-900/50"
        >
          <div className="flex flex-row flex-wrap gap-1 items-center">
            <img src="favicon.png" alt="" className="w-6 h-6 shrink-0" />
            <span className="text-center text-sm font-extralight leading-none hidden md:flex flex-col opacity-40">
              <span>AoE2</span>
              <span>Card</span>
            </span>
          </div>
        </Link>
        <Patch />
      </div>
      <ThemeButton />
    </Container>
  </div>
);

export default Navbar;
