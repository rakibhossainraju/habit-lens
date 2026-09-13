"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  History,
  Lightbulb,
  BarChart3,
  Settings,
  PlusCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Daily Logs", href: "/logs", icon: History },
  { name: "Insights", href: "/insights", icon: Lightbulb },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
];

const bottomNavItems = [
  { name: "Settings", href: "/settings", icon: Settings },
];

interface SidebarProps {
  collapsed?: boolean;
}

export function Sidebar({ collapsed = false }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen border-r border-border bg-sidebar transition-all duration-200 ease-in-out flex flex-col",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-14 items-center justify-between px-4 border-b border-border">
        {/* Brand Logo */}
        <Link
          href="/dashboard"
          className="flex items-center gap-2.5 overflow-hidden"
        >
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground font-semibold text-sm">
            HL
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-semibold tracking-tight leading-none text-sidebar-foreground">
                Habit Lens
              </span>
              <span className="text-[10px] text-muted-foreground leading-tight">
                Self-reflection
              </span>
            </div>
          )}
        </Link>
      </div>

      {/* Quick Action Button */}
      <div className="p-3">
        <Link href="/logs/new">
          <Button
            variant="default"
            size={collapsed ? "icon" : "default"}
            className={cn(
              "w-full justify-center gap-2 font-medium shadow-none",
              collapsed && "size-10 p-0"
            )}
          >
            <PlusCircle className="size-4 shrink-0" />
            {!collapsed && <span>New Log Entry</span>}
          </Button>
        </Link>
      </div>

      {/* Main Nav */}
      <nav className="flex-1 space-y-1 px-3 py-2">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.name : undefined}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-accent text-accent-foreground font-medium"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                collapsed && "justify-center px-0"
              )}
            >
              <item.icon
                className={cn(
                  "size-4 shrink-0 transition-colors",
                  isActive ? "text-primary" : "group-hover:text-foreground"
                )}
              />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Nav */}
      <div className="p-3 border-t border-border mt-auto space-y-1">
        {bottomNavItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.name : undefined}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-accent text-accent-foreground font-medium"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                collapsed && "justify-center px-0"
              )}
            >
              <item.icon
                className={cn(
                  "size-4 shrink-0 transition-colors",
                  isActive ? "text-primary" : "group-hover:text-foreground"
                )}
              />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
