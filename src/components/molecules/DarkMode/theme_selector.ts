export const themeSelector = () => {
  let theme = getTheme();

  // eslint-disable-next-line func-style
  function getTheme(): string {
    return localStorage.getItem("theme") || "auto";
  }

  // eslint-disable-next-line func-style
  function isDark() {
    if (theme === "auto") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return theme === "dark";
  }

  // eslint-disable-next-line func-style
  function setTheme(newTheme: string) {
    theme = newTheme;
    localStorage.setItem("theme", theme);

    updateChecked();

    // Toggle the dark mode class
    if (isDark()) {
      document.documentElement.classList.add("dark");
      document.body.classList.add("sl-theme-dark");
      document.body.classList.remove("sl-theme-light");
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("sl-theme-dark");
      document.body.classList.add("sl-theme-light");
    }
  }

  // eslint-disable-next-line func-style
  function updateChecked() {
    const menu = document.querySelector("#theme-selector sl-menu");
    if (!menu) return;
    [...menu.querySelectorAll("sl-menu-item")].map((item) => (item.checked = item.dataset["value"] === theme));
    // [...menu.querySelectorAll("sl-menu-item")].map((item) => (item.dataset["checked"] = (item.dataset["value"] === theme).toString()));
  }

  // Checked is not preserved when changing page, so update when opening dropdown
  document.addEventListener("sl-show", (event) => {
    const themeSelector = (event.target as HTMLElement).closest("#theme-selector");
    if (!themeSelector) return;
    updateChecked();
  });

  // Listen for selections
  document.addEventListener("sl-select", (event) => {
    const menu = (event.target as HTMLElement).closest("#theme-selector sl-menu");
    if (!menu) return;
    setTheme(event.detail.item.value);
  });

  // Update the theme when the preference changes
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => setTheme(theme));

  // Set the initial theme and sync the UI
  setTheme(theme);
};
