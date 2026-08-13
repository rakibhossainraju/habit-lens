"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./ui/card";
import { LogEntry } from "@/lib/types";
import { cn } from "@/lib/utils";

interface DataSeries {
  key: keyof LogEntry | ((entry: LogEntry) => number);
  label: string;
  colorVar: string; // e.g. "var(--chart-1)"
  unit?: string;
  dashed?: boolean;
}

interface TrendChartCardProps {
  title: string;
  description?: string;
  entries: LogEntry[];
  series: DataSeries[];
  type?: "line" | "bar";
  maxVal?: number; // e.g. 10 for energy, 12 for sleep
  className?: string;
}

export function TrendChartCard({
  title,
  description,
  entries,
  series,
  type = "line",
  maxVal = 10,
  className,
}: TrendChartCardProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Take up to 14 entries and reverse for chronological order left-to-right
  const chronological = React.useMemo(() => {
    return [...entries].slice(0, 14).reverse();
  }, [entries]);

  const svgHeight = 180;
  const svgWidth = 600;
  const paddingX = 40;
  const paddingTop = 20;
  const paddingBottom = 30;
  const usableWidth = svgWidth - paddingX * 2;
  const usableHeight = svgHeight - paddingTop - paddingBottom;

  const getVal = (entry: LogEntry, s: DataSeries): number => {
    if (typeof s.key === "function") {
      return s.key(entry);
    }
    return (entry[s.key] as number) || 0;
  };

  // Compute positions
  const getX = (index: number) => {
    if (chronological.length <= 1) return svgWidth / 2;
    return paddingX + (index / (chronological.length - 1)) * usableWidth;
  };

  const getY = (val: number) => {
    const clamped = Math.max(0, Math.min(val, maxVal));
    // Honest zero baseline
    return svgHeight - paddingBottom - (clamped / maxVal) * usableHeight;
  };

  return (
    <Card className={cn("overflow-hidden transition-colors", className)}>
      <CardHeader className="p-5 pb-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <CardTitle className="text-base font-medium text-foreground">{title}</CardTitle>
          {description && (
            <CardDescription className="text-xs text-muted-foreground mt-0.5">
              {description}
            </CardDescription>
          )}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          {series.map((s) => (
            <div key={s.label} className="flex items-center gap-1.5 font-mono text-muted-foreground">
              <span
                className="size-2.5 rounded-full inline-block"
                style={{ backgroundColor: s.colorVar }}
              />
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </CardHeader>

      <CardContent className="p-5 pt-2">
        <div className="relative w-full overflow-x-auto">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-auto min-w-[500px] select-none"
          >
            {/* Grid lines (0, 25%, 50%, 75%, 100%) */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
              const val = Math.round(maxVal * ratio);
              const y = svgHeight - paddingBottom - ratio * usableHeight;
              return (
                <g key={ratio}>
                  <line
                    x1={paddingX}
                    y1={y}
                    x2={svgWidth - paddingX}
                    y2={y}
                    stroke="var(--border)"
                    strokeDasharray="2,2"
                    strokeWidth={1}
                  />
                  <text
                    x={paddingX - 8}
                    y={y + 3}
                    className="font-mono text-[10px] fill-muted-foreground"
                    textAnchor="end"
                  >
                    {val}
                  </text>
                </g>
              );
            })}

            {/* Render Bars if type === "bar" */}
            {type === "bar" &&
              chronological.map((entry, idx) => {
                const barGroupWidth = usableWidth / chronological.length;
                const groupX = paddingX + idx * barGroupWidth;
                const numSeries = series.length;
                const singleBarWidth = Math.max(4, (barGroupWidth * 0.7) / numSeries);

                return (
                  <g key={entry.id}>
                    {series.map((s, sIdx) => {
                      const val = getVal(entry, s);
                      const y = getY(val);
                      const h = svgHeight - paddingBottom - y;
                      const x = groupX + (barGroupWidth - singleBarWidth * numSeries) / 2 + sIdx * singleBarWidth;

                      return (
                        <rect
                          key={s.label}
                          x={x}
                          y={y}
                          width={singleBarWidth - 1}
                          height={h}
                          fill={s.colorVar}
                          rx={2}
                          className="opacity-85 hover:opacity-100 transition-opacity"
                        />
                      );
                    })}
                  </g>
                );
              })}

            {/* Render Line charts if type === "line" */}
            {type === "line" &&
              series.map((s) => {
                const points = chronological
                  .map((entry, idx) => `${getX(idx)},${getY(getVal(entry, s))}`)
                  .join(" ");

                return (
                  <g key={s.label}>
                    <polyline
                      fill="none"
                      stroke={s.colorVar}
                      strokeWidth={2}
                      strokeDasharray={s.dashed ? "4,4" : undefined}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={points}
                    />
                    {chronological.map((entry, idx) => {
                      const val = getVal(entry, s);
                      const x = getX(idx);
                      const y = getY(val);
                      return (
                        <circle
                          key={entry.id}
                          cx={x}
                          cy={y}
                          r={hoveredIdx === idx ? 4 : 2.5}
                          fill="var(--card)"
                          stroke={s.colorVar}
                          strokeWidth={2}
                          className="transition-all"
                        />
                      );
                    })}
                  </g>
                );
              })}

            {/* Hover overlay & X axis Labels */}
            {chronological.map((entry, idx) => {
              const x = getX(idx);
              const formattedDate = new Date(entry.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              });

              return (
                <g
                  key={entry.id}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                >
                  {/* Invisible hover bar */}
                  <rect
                    x={x - usableWidth / (chronological.length * 2)}
                    y={paddingTop}
                    width={usableWidth / chronological.length}
                    height={usableHeight}
                    fill="transparent"
                  />

                  {/* Vertical hover guide line */}
                  {hoveredIdx === idx && (
                    <line
                      x1={x}
                      y1={paddingTop}
                      x2={x}
                      y2={svgHeight - paddingBottom}
                      stroke="var(--muted-foreground)"
                      strokeWidth={1}
                      strokeDasharray="3,3"
                    />
                  )}

                  {/* X Axis Date Label */}
                  {idx % 2 === 0 && (
                    <text
                      x={x}
                      y={svgHeight - 8}
                      className="font-mono text-[10px] fill-muted-foreground"
                      textAnchor="middle"
                    >
                      {formattedDate}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Hover details summary bar */}
        {hoveredIdx !== null && chronological[hoveredIdx] && (
          <div className="mt-3 p-2.5 rounded-lg bg-muted/60 border border-border flex flex-wrap items-center justify-between text-xs font-mono">
            <span className="font-semibold text-foreground">
              {new Date(chronological[hoveredIdx].date).toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </span>
            <div className="flex items-center gap-4">
              {series.map((s) => (
                <div key={s.label} className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full" style={{ backgroundColor: s.colorVar }} />
                  <span className="text-muted-foreground">{s.label}:</span>
                  <span className="font-semibold text-foreground">
                    {getVal(chronological[hoveredIdx], s)} {s.unit || ""}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
