"use client";

import React, { useState } from "react";
import { Settings, Sun, Moon, Monitor, Download, RefreshCw, User, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/components/theme-provider";
import { useStorage } from "@/lib/storage-context";

export default function SettingsPage() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { logs, resetToDefault } = useStorage();

  const [name, setName] = useState("Reflective Tracker");
  const [email, setEmail] = useState("user@habitlens.app");
  const [targetSleep, setTargetSleep] = useState("8.0");
  const [resetDone, setResetDone] = useState(false);

  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `habit-lens-export-${new Date().toISOString().split("T")[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleReset = () => {
    if (confirm("Reset all logs to initial mock data? Custom modifications will be reset.")) {
      resetToDefault();
      setResetDone(true);
      setTimeout(() => setResetDone(false), 3000);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <PageHeader
        title="Settings"
        description="Manage your profile, theme appearance, tracker configuration, and data exports."
      />

      {/* Section 1: Profile */}
      <Card>
        <CardHeader className="p-5 pb-3">
          <div className="flex items-center gap-2">
            <User className="size-4 text-muted-foreground" />
            <CardTitle className="text-base font-medium">Profile & Preferences</CardTitle>
          </div>
          <CardDescription className="text-xs text-muted-foreground">
            Personal identity information for your local journal environment
          </CardDescription>
        </CardHeader>
        <CardContent className="p-5 pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">Display Name</label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-xs font-sans"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">Email Address</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="text-xs font-sans"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">
              Preferred Sleep Target (hrs)
            </label>
            <Input
              type="number"
              step="0.5"
              value={targetSleep}
              onChange={(e) => setTargetSleep(e.target.value)}
              className="text-xs font-mono"
            />
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Appearance & Theme */}
      <Card>
        <CardHeader className="p-5 pb-3">
          <div className="flex items-center gap-2">
            <Sun className="size-4 text-muted-foreground" />
            <CardTitle className="text-base font-medium">Appearance & Theme</CardTitle>
          </div>
          <CardDescription className="text-xs text-muted-foreground">
            Customize the editorial serene visual environment (Current resolved: {resolvedTheme})
          </CardDescription>
        </CardHeader>
        <CardContent className="p-5 pt-2">
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: "light", label: "Light Theme", icon: Sun },
              { id: "dark", label: "Dark Theme", icon: Moon },
              { id: "system", label: "System Default", icon: Monitor },
            ].map((item) => {
              const isSelected = theme === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTheme(item.id as "light" | "dark" | "system")}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all text-xs font-mono gap-2 ${
                    isSelected
                      ? "bg-primary/10 border-primary text-primary font-semibold"
                      : "bg-card border-border text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <item.icon className="size-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Section 3: Data Export & Reset */}
      <Card>
        <CardHeader className="p-5 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-muted-foreground" />
            <CardTitle className="text-base font-medium">Data Ownership & Storage</CardTitle>
          </div>
          <CardDescription className="text-xs text-muted-foreground">
            Habit Lens keeps your data locally. Export your full history at any time.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-5 pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-medium text-foreground block">Export Historical Data</span>
            <span className="text-xs text-muted-foreground font-mono">
              {logs.length} entries stored locally in JSON format
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleExportData} className="gap-2 font-mono text-xs">
              <Download className="size-3.5" />
              <span>Export JSON</span>
            </Button>

            <Button
              variant="destructive"
              size="sm"
              onClick={handleReset}
              className="gap-2 font-mono text-xs"
            >
              <RefreshCw className="size-3.5" />
              <span>{resetDone ? "Reset Complete" : "Reset Data"}</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
