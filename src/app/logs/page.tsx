"use client";

import React from "react";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { LogTable } from "@/components/log-table";
import { Button } from "@/components/ui/button";
import { useStorage } from "@/lib/storage-context";

export default function LogsPage() {
  const { logs, deleteLog } = useStorage();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Daily Logs"
        description="Browse, filter, and review historical health and habit entries."
      >
        <Link href="/logs/new">
          <Button variant="default" size="sm" className="gap-2">
            <PlusCircle className="size-4" />
            <span>New Log Entry</span>
          </Button>
        </Link>
      </PageHeader>

      <LogTable logs={logs} onDeleteLog={deleteLog} showFilters={true} />
    </div>
  );
}
