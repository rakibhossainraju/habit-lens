"use client";

import { useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

function applyTheme(dark: boolean) {
  document.documentElement.classList.toggle("dark", dark);
  localStorage.setItem("theme", dark ? "dark" : "light");
}

export function ThemeToggle({ className }: { className?: string }) {
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    applyTheme(saved === "dark" || (!saved && prefersDark));
  }, []);

  function toggle() {
    const isDark = document.documentElement.classList.contains("dark");
    applyTheme(!isDark);
  }

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={toggle}
      aria-label="Toggle theme"
      className={className}
    >
      <Moon className="size-4 dark:hidden" />
      <Sun className="size-4 hidden dark:block" />
    </Button>
  );
}
