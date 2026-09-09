import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { StorageProvider } from "@/lib/storage-context";
import { AppShell } from "@/components/app-shell";

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
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "h-full antialiased dark",
        geistSans.variable,
        geistMono.variable,
        inter.variable
      )}
    >
      <body className="min-h-full bg-background text-foreground font-sans">
        <ThemeProvider>
          <StorageProvider>
            <AppShell>{children}</AppShell>
          </StorageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
