// The theme is DOM state, not React state.
//
// Nothing here runs on the server, and nothing here belongs in a component:
// the preference lives in localStorage, the resolved appearance lives on
// <html>, and CSS does the rest. That keeps the server render theme-agnostic,
// which is the only way it can be — it has no access to localStorage or the
// OS colour scheme — and it means no component ever has to reconcile a
// server-rendered theme with the real one.
//
// Two attributes, two jobs:
//   .dark                 — the resolved appearance; selects the dark tokens.
//   data-theme="<pref>"   — the stored preference, including "system", which
//                           the settings picker highlights off.

export const THEME_STORAGE_KEY = "habit-lens-theme";

export type Theme = "light" | "dark" | "system";

const DARK_QUERY = "(prefers-color-scheme: dark)";

// Runs synchronously while the browser parses <head>, before the first paint,
// so the page never flashes the wrong theme. It also keeps "system" honest by
// re-applying when the OS preference changes.
export const THEME_INIT_SCRIPT = `(function(){try{
  var el = document.documentElement;
  var mq = window.matchMedia(${JSON.stringify(DARK_QUERY)});
  function apply(){
    var stored = localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});
    var theme = (stored === "light" || stored === "dark") ? stored : "system";
    el.dataset.theme = theme;
    el.classList.toggle("dark", theme === "dark" || (theme === "system" && mq.matches));
  }
  mq.addEventListener("change", apply);
  apply();
} catch (e) {} })()`;

/** The stored preference, read back off the DOM the init script already set. */
export function getTheme(): Theme {
  const theme = document.documentElement.dataset.theme;
  return theme === "light" || theme === "dark" ? theme : "system";
}

export function setTheme(theme: Theme) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // The preference just won't survive a reload.
  }
  const el = document.documentElement;
  el.dataset.theme = theme;
  el.classList.toggle(
    "dark",
    theme === "dark" || (theme === "system" && window.matchMedia(DARK_QUERY).matches),
  );
}

export function toggleTheme() {
  setTheme(document.documentElement.classList.contains("dark") ? "light" : "dark");
}
