import { StorageProvider } from "@/lib/storage-context";
import { AppShell } from "@/components/app-shell";
import { auth } from "@/auth";

export default function AppGroupLayout({ children }: { children: React.ReactNode }) {
  // Start the session promise on the server without awaiting it.
  // This allows the layout to remain non-blocking while React 19 streams
  // the promise down to client components that resolve it via `use()`.
  const sessionPromise = auth();

  return (
    <StorageProvider>
      <AppShell sessionPromise={sessionPromise}>{children}</AppShell>
    </StorageProvider>
  );
}
