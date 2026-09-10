import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider} from "@/components/theme-provider";
import { StorageProvider } from "@/lib/storage-context";
import { AppShell } from "@/components/app-shell";
import { THEME_STORAGE_KEY } from "@/lib/theme";

// Runs synchronously while the browser parses <head>, before first paint.
// Resolves the theme the same way ThemeProvider does and applies it directly
// to the DOM, so there's no flash of the wrong theme while React hydrates.
const THEME_INIT_SCRIPT = `(function(){try{
  var stored = localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});
  var theme = (stored === "light" || stored === "dark" || stored === "system") ? stored : "system";
  var resolvedTheme = theme === "system"
    ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
    : theme;
  document.documentElement.classList.toggle("dark", resolvedTheme === "dark");
  window.__HL_THEME__ = { theme: theme, resolvedTheme: resolvedTheme };
} catch (e) {} })()`;

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
        <ThemeProvider>
          <StorageProvider>
            <AppShell>{children}</AppShell>
          </StorageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
