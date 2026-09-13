"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { InsightCard } from "@/components/insight-card";
import { useStorage } from "@/lib/storage-context";
import { EmptyState } from "@/components/empty-state";

export default function InsightsPage() {
  const { insights } = useStorage();
  const [filterConfidence, setFilterConfidence] = useState<string>("All");

  const filtered = insights.filter((i) => {
    if (filterConfidence === "All") return true;
    return i.confidence.toLowerCase() === filterConfidence.toLowerCase();
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Insights"
        description="Rule-based pattern observations discovered from analyzing your daily habit entries over time."
      />

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
        <div className="flex items-center gap-1.5 bg-muted/60 p-1 rounded-lg border border-border">
          {["All", "High", "Medium", "Low"].map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => setFilterConfidence(level)}
              className={`px-3 py-1 text-xs font-mono rounded-md transition-colors ${
                filterConfidence === level
                  ? "bg-card text-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {level === "All" ? "All Confidence" : `${level} Confidence`}
            </button>
          ))}
        </div>

        <span className="text-xs font-mono text-muted-foreground">
          Showing {filtered.length} of {insights.length} rule observations
        </span>
      </div>

      {/* Insights Cards Grid */}
      {filtered.length === 0 ? (
        <EmptyState
          title="No insights match this filter"
          description="Try selecting 'All Confidence' to view all rule-based observations."
          actionLabel="Show All Insights"
          onAction={() => setFilterConfidence("All")}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((insight) => (
            <InsightCard key={insight.id} insight={insight} />
          ))}
        </div>
      )}
    </div>
  );
}
