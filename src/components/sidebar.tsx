"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  History,
  Lightbulb,
  BarChart3,
  Settings,
  Target
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Logs", href: "/logs", icon: History },
  { name: "Insights", href: "/insights", icon: Lightbulb },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
];

const bottomNavItems = [
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-background transition-transform">
      <div className="flex h-full flex-col px-3 py-4">
        {/* Logo */}
        <Link
          href="/dashboard"
          className="mb-8 flex items-center gap-2 px-3 py-2"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Target className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight">Habit Lens</span>
        </Link>

        {/* Main Nav */}
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground"
                )}
              >
                <item.icon className={cn(
                  "h-4 w-4 transition-colors",
                  isActive ? "text-primary" : "group-hover:text-foreground"
                )} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Nav */}
        <div className="mt-auto pt-4 border-t">
          {bottomNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground"
                )}
              >
                <item.icon className={cn(
                  "h-4 w-4 transition-colors",
                  isActive ? "text-primary" : "group-hover:text-foreground"
                )} />
                {item.name}
              </Link>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
