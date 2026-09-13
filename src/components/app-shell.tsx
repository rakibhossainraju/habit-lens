"use client";

import React, { Suspense, useState } from "react";
import { Sidebar } from "./sidebar";
import { TopNav } from "./top-nav";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Sidebar reads the current pathname to highlight the active link, which
          is per-request data on routes without generateStaticParams (e.g.
          /logs/[id]) — Suspense keeps that from blocking the static shell. */}
      <Suspense fallback={<div className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-sidebar" />}>
        <Sidebar collapsed={collapsed} />
      </Suspense>
      <div
        className={cn(
          "flex-1 flex flex-col transition-all duration-200 ease-in-out",
          collapsed ? "ml-16" : "ml-64"
        )}
      >
        <TopNav onToggleSidebar={() => setCollapsed(!collapsed)} />
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
