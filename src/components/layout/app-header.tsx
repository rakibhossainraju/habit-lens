"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center border-b bg-background/80 backdrop-blur-sm">
      <SidebarTrigger className="w-max px-4" />
      <Separator orientation="vertical" />
      <div className="flex-1" />
      <Separator orientation="vertical" />
      <ThemeToggle className="w-max p-4" />
    </header>
  );
}
