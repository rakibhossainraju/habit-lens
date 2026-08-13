"use client";

import React, { useState } from "react";
import { Search, Sun, Moon, PanelLeft, User } from "lucide-react";
import { useTheme } from "./theme-provider";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface TopNavProps {
  onToggleSidebar?: () => void;
}

export function TopNav({ onToggleSidebar }: TopNavProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/80 transition-colors">
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onToggleSidebar}
            aria-label="Toggle sidebar"
          >
            <PanelLeft className="size-4 text-muted-foreground" />
          </Button>
        )}

        {/* Search placeholder */}
        <div className="relative hidden md:block w-64">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search entries or insights..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 pr-10 text-xs h-8 bg-muted/40 border-border focus-visible:bg-background"
          />
          <kbd className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 select-none rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            ⌘K
          </kbd>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Theme Switcher */}
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={toggleTheme}
          aria-label={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
          title={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
        >
          {resolvedTheme === "dark" ? (
            <Sun className="size-4 text-accent-foreground" />
          ) : (
            <Moon className="size-4 text-muted-foreground" />
          )}
        </Button>

        {/* User Menu Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-border">
          <div className="flex size-7 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
            <User className="size-4" />
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-medium leading-none">Self Reflection</span>
            <span className="text-[10px] text-muted-foreground leading-tight">Habit Lens v1</span>
          </div>
        </div>
      </div>
    </header>
  );
}
