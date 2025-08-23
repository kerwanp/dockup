import "@/app/global.css";
import { RootProvider } from "fumadocs-ui/provider";
import { cn } from "lib/cn";
import { Inter, Kode_Mono } from "next/font/google";
import type { ReactNode } from "react";

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const mono = Kode_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={sans.className} suppressHydrationWarning>
      <body
        className={cn(
          "flex flex-col min-h-screen",
          sans.variable,
          mono.variable,
        )}
      >
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
