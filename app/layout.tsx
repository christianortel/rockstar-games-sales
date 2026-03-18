import type { Metadata } from "next";
import { ReactNode } from "react";

import { SiteNav } from "@/components/layout/site-nav";
import { siteConfig } from "@/config/site";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`
  },
  description: siteConfig.description,
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description
  }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <div className="relative min-h-screen overflow-hidden bg-[#050505]">
          <div className="absolute inset-0 panel-grid opacity-[0.06]" />
          <SiteNav />
          <main className="relative mx-auto w-full max-w-[1440px] px-5 pb-16 pt-6 md:px-8 md:pt-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
