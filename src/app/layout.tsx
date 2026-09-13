import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { StorageProvider } from "@/lib/storage-context";
import { AppShell } from "@/components/app-shell";
import { THEME_INIT_SCRIPT } from "@/lib/theme";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Habit Lens — Reflective Wellbeing & Habit Tracking",
  description: "Log daily activities, sleep, and diurnal energy to observe patterns in your wellbeing.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // `data-theme` and the `dark` class are both rewritten by the init script
    // before React hydrates, which is what `suppressHydrationWarning` covers.
    <html
      lang="en"
      data-theme="system"
      suppressHydrationWarning
      className={cn(
        "h-full antialiased",
        geistSans.variable,
        geistMono.variable,
        inter.variable
      )}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body
        suppressHydrationWarning
        className="min-h-full bg-background text-foreground font-sans"
      >
        <StorageProvider>
          <AppShell>{children}</AppShell>
        </StorageProvider>
      </body>
    </html>
  );
}
