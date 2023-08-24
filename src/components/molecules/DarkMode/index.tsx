import { SlButton, SlDivider, SlDropdown, SlIcon, SlMenu, SlMenuItem } from "@shoelace-style/shoelace/dist/react";
import { useState } from "react";

export const DarkModeButton = () => {
  const [theme, setTheme] = useState(getTheme());

  // eslint-disable-next-line func-style
  function getTheme(): string {
    return localStorage.getItem("theme") || "auto";
  }

  // eslint-disable-next-line func-style
  function isDark(theme: string) {
    if (theme === "auto") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return theme === "dark";
  }

  // eslint-disable-next-line func-style
  function pushTheme(theme: string) {
    localStorage.setItem("theme", theme);

    // Toggle the dark mode class
    if (isDark(theme)) {
      document.documentElement.classList.add("dark");
      document.body.classList.add("sl-theme-dark");
      document.body.classList.remove("sl-theme-light");
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("sl-theme-dark");
      document.body.classList.add("sl-theme-light");
    }
  }

  const setAndPush = (theme: string) => {
    setTheme(theme);
    pushTheme(theme);
  };

  return (
    <div id="theme-selector" className="flex flex-row gap-0 items-center shrink-0">
      <SlButton
        id="theme-toggle"
        slot="trigger"
        size="medium"
        variant="text"
        onClick={() => {
          setAndPush(isDark(theme) ? "light" : "dark");
        }}
        className="pr-2"
      >
        <SlIcon className="only-light" name="sun-fill"></SlIcon>
        <SlIcon className="only-dark" name="moon-fill"></SlIcon>
      </SlButton>
      <SlDropdown id="theme-dropdown" placement="bottom-end" distance={0}>
        <SlButton slot="trigger" size="medium" variant="text" caret></SlButton>
        <SlMenu
          onSlSelect={(v) => {
            setAndPush(v.detail.item.value);
          }}
        >
          <SlMenuItem type="checkbox" value="light" checked={theme == "light"}>
            Light
          </SlMenuItem>
          <SlMenuItem type="checkbox" value="dark" checked={theme == "dark"}>
            Dark
          </SlMenuItem>
          <SlDivider className="border-t-2 border-opacity-30 border-zinc-400 dark:border-zinc-700"></SlDivider>
          <SlMenuItem type="checkbox" value="auto" checked={theme == "auto"}>
            System
          </SlMenuItem>
        </SlMenu>
      </SlDropdown>
    </div>
  );
};
