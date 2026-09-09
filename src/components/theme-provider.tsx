"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useSyncExternalStore,
} from "react";

import { THEME_STORAGE_KEY } from "@/lib/theme";

type Theme = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";

// Populated by the blocking inline script in layout.tsx before React ever
// runs, so the very first client render already agrees with the DOM.
declare global {
  interface Window {
    __HL_THEME__?: { theme: Theme; resolvedTheme: ResolvedTheme };
  }
}

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: ResolvedTheme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function subscribeToSystemTheme(callback: () => void) {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}

function getSystemTheme(): ResolvedTheme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

// Used for the server render and for the client's first (pre-hydration)
// render. Reading the value the inline script already resolved means that
// first client render matches what's already on screen instead of guessing.
function getServerSystemTheme(): ResolvedTheme {
  return (typeof window !== "undefined" && window.__HL_THEME__?.resolvedTheme) || "light";
}

function readInitialTheme(): Theme {
  if (typeof window === "undefined") return "system";
  return window.__HL_THEME__?.theme ?? "system";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(readInitialTheme);
  const systemTheme = useSyncExternalStore(
    subscribeToSystemTheme,
    getSystemTheme,
    getServerSystemTheme,
  );
  const resolvedTheme = theme === "system" ? systemTheme : theme;

  useEffect(() => {
    document.documentElement.classList.toggle("dark", resolvedTheme === "dark");
  }, [resolvedTheme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem(THEME_STORAGE_KEY, newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
