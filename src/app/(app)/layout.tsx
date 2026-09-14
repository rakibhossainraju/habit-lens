import { StorageProvider } from "@/lib/storage-context";
import { AppShell } from "@/components/app-shell";

export default function AppGroupLayout({ children }: { children: React.ReactNode }) {
  return (
    <StorageProvider>
      <AppShell>{children}</AppShell>
    </StorageProvider>
  );
}
