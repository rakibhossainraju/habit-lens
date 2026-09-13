"use client";

import React, { useState } from "react";
import Link from "next/link";
import { LogEntry } from "@/lib/types";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "./ui/table";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Search, Eye, Trash2, Calendar, Moon } from "lucide-react";
import { EmptyState } from "./empty-state";

interface LogTableProps {
  logs: LogEntry[];
  onDeleteLog?: (id: string) => void;
  showFilters?: boolean;
}

export function LogTable({ logs, onDeleteLog, showFilters = true }: LogTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredLogs = logs.filter((log) => {
    const term = searchTerm.toLowerCase();
    const dateStr = log.date.toLowerCase();
    const notesStr = (log.notes || "").toLowerCase();
    const customStr = (log.customFields || [])
      .map((cf) => `${cf.key}:${cf.value}`)
      .join(" ")
      .toLowerCase();

    return dateStr.includes(term) || notesStr.includes(term) || customStr.includes(term);
  });

  const handleDelete = (id: string) => {
    if (onDeleteLog) {
      onDeleteLog(id);
    }
    setDeletingId(null);
  };

  return (
    <div className="space-y-4">
      {showFilters && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Filter logs by date, notes, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 text-xs"
            />
          </div>
          <div className="text-xs font-mono text-muted-foreground self-end sm:self-center">
            Showing {filteredLogs.length} of {logs.length} entries
          </div>
        </div>
      )}

      {filteredLogs.length === 0 ? (
        <EmptyState
          title="No logs found"
          description={
            searchTerm
              ? `No daily entries match "${searchTerm}". Try adjusting your search query.`
              : "No historical logs recorded yet. Begin by logging today's entry."
          }
          actionLabel={searchTerm ? "Clear Filter" : "Log Today's Entry"}
          onAction={searchTerm ? () => setSearchTerm("") : undefined}
          actionHref={searchTerm ? undefined : "/logs/new"}
        />
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-hidden transition-colors">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[140px]">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="size-3.5" />
                    <span>Date</span>
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-1.5">
                    <Moon className="size-3.5" />
                    <span>Sleep</span>
                  </div>
                </TableHead>
                <TableHead>Morning Energy</TableHead>
                <TableHead>Afternoon Energy</TableHead>
                <TableHead>Evening Energy</TableHead>
                <TableHead className="hidden lg:table-cell">Custom Fields</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  {/* Date */}
                  <TableCell className="font-mono text-sm font-medium text-foreground">
                    <Link
                      href={`/logs/${log.id}`}
                      className="hover:underline hover:text-primary transition-colors"
                    >
                      {new Date(log.date).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </Link>
                  </TableCell>

                  {/* Sleep Duration */}
                  <TableCell className="font-mono text-sm">
                    <span className="font-semibold text-foreground">
                      {log.sleepDuration}
                    </span>{" "}
                    <span className="text-xs text-muted-foreground">hrs</span>
                    <div className="text-[10px] text-muted-foreground font-mono">
                      {log.sleepTime} – {log.wakeTime}
                    </div>
                  </TableCell>

                  {/* Morning Energy */}
                  <TableCell className="font-mono text-sm">
                    <span className="bg-secondary/70 text-secondary-foreground px-2 py-0.5 rounded text-xs font-semibold">
                      {log.morningEnergy}/10
                    </span>
                  </TableCell>

                  {/* Afternoon Energy */}
                  <TableCell className="font-mono text-sm">
                    <span className="bg-secondary/70 text-secondary-foreground px-2 py-0.5 rounded text-xs font-semibold">
                      {log.afternoonEnergy}/10
                    </span>
                  </TableCell>

                  {/* Evening Energy */}
                  <TableCell className="font-mono text-sm">
                    <span className="bg-secondary/70 text-secondary-foreground px-2 py-0.5 rounded text-xs font-semibold">
                      {log.eveningEnergy}/10
                    </span>
                  </TableCell>

                  {/* Custom Fields Tags */}
                  <TableCell className="hidden lg:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {(log.customFields || []).slice(0, 2).map((cf) => (
                        <Badge key={cf.key} variant="muted" className="text-[10px] font-mono">
                          {cf.key}: {cf.value}
                        </Badge>
                      ))}
                      {(log.customFields || []).length > 2 && (
                        <span className="text-[10px] text-muted-foreground font-mono">
                          +{(log.customFields || []).length - 2} more
                        </span>
                      )}
                    </div>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/logs/${log.id}`}>
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          title="View Details"
                          aria-label="View Details"
                        >
                          <Eye className="size-3.5 text-muted-foreground hover:text-foreground" />
                        </Button>
                      </Link>

                      {deletingId === log.id ? (
                        <div className="flex items-center gap-1 bg-muted px-1.5 py-0.5 rounded border border-border">
                          <span className="text-[10px] text-muted-foreground font-mono">
                            Delete?
                          </span>
                          <button
                            onClick={() => handleDelete(log.id)}
                            className="text-xs font-bold text-destructive hover:underline"
                          >
                            Yes
                          </button>
                          <button
                            onClick={() => setDeletingId(null)}
                            className="text-xs text-muted-foreground hover:underline"
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => setDeletingId(log.id)}
                          title="Delete entry"
                          aria-label="Delete entry"
                        >
                          <Trash2 className="size-3.5 text-muted-foreground hover:text-destructive" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
