import "@/app/global.css";
import { baseUrl, createMetadata } from "@/lib/metadata";
import { RootProvider } from "fumadocs-ui/provider";
import { cn } from "lib/cn";
import { Inter, Kode_Mono } from "next/font/google";
import type { ReactNode } from "react";

export const metadata = createMetadata({
  title: {
    template: "Dockup - %s",
    default: "Dockup - Local environments made easy",
  },
  description: "The CLI tool for managing local environments.",
  metadataBase: baseUrl,
});

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
