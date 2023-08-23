import { useEffect } from "react";

const localStorageKey = "theme";

export function DarkModeButton() {
  useEffect(() => {
    return setupThemeToggle();
  });
  return (
    <>
      <button
        id="dark-theme-toggle"
        type="button"
        className="text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg text-sm p-2"
      >
        <svg
          id="dark-theme-toggle-dark-icon"
          className="w-5 h-5 text-transparent hidden"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
        </svg>

        <svg
          id="dark-theme-toggle-light-icon"
          className="w-5 h-5 text-transparent"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
            fillRule="evenodd"
            clipRule="evenodd"
          ></path>
        </svg>
      </button>
    </>
  );
}

const isDark = () => {
  if (localStorage.getItem(localStorageKey) === "dark") return true;
  if (localStorage.getItem(localStorageKey) === "light") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
};

const setupThemeToggle = () => {
  const toggleVisibility = (dark: boolean) => {
    const themeToggleDarkIcon = document.getElementById("dark-theme-toggle-dark-icon");
    const themeToggleLightIcon = document.getElementById("dark-theme-toggle-light-icon");
    if (themeToggleDarkIcon == null || themeToggleLightIcon == null) return;
    const show = dark ? themeToggleDarkIcon : themeToggleLightIcon;
    const hide = dark ? themeToggleLightIcon : themeToggleDarkIcon;
    show.classList.remove("hidden", "text-transparent");
    hide.classList.add("hidden", "text-transparent");
    if (dark) {
      document.documentElement.classList.add("dark");
      document.body.classList.add("sl-theme-dark");
      document.body.classList.remove("sl-theme-light");
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.add("sl-theme-light");
      document.body.classList.remove("sl-theme-dark");
    }
    try {
      localStorage.setItem(localStorageKey, dark ? "dark" : "light");
    } catch (_err) {}
  };
  toggleVisibility(isDark());
  document.getElementById("dark-theme-toggle")?.addEventListener("click", newFunction);
  return () => {
    document.getElementById("dark-theme-toggle")?.removeEventListener("click", newFunction);
  };
  function newFunction(this: HTMLElement, _ev: MouseEvent): void {
    toggleVisibility(!isDark());
  }
};
