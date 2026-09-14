import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import "./globals.css";
import { cn } from "@/lib/utils";
import { THEME_INIT_SCRIPT } from "@/lib/theme";
import { auth } from "@/auth";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // `auth()` reads the session cookie, which is request-time data, so this
  // layout — and every route under it — renders dynamically rather than
  // from a prerendered static shell. That's an accepted trade-off here:
  // Habit Lens has no public/static content, every route sits behind
  // src/proxy.ts, so there's no static shell worth preserving.
  const session = await auth();

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
        <SessionProvider session={session}>{children}</SessionProvider>
      </body>
    </html>
  );
}
