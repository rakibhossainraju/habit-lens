import { Suspense } from "react";
import { LoadingState } from "@/components/loading-state";
import { LogDetailClient } from "./log-detail-client";

async function ResolvedLogDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <LogDetailClient id={id} />;
}

export default function LogDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<LoadingState rows={4} />}>
      <ResolvedLogDetail params={params} />
    </Suspense>
  );
}
