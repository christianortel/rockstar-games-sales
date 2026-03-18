"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export function SiteNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-white/8 bg-black/20 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-4 px-5 py-4 md:flex-row md:items-center md:justify-between md:px-8">
        <Link href="/" className="flex items-center gap-4">
          <div className="relative h-11 w-12 shrink-0 overflow-hidden">
            <Image
              alt="Official Rockstar Games logo"
              className="object-contain"
              fill
              sizes="48px"
              src="/images/logos/rockstar-rstar-official.svg"
              unoptimized
            />
          </div>
          <div>
            <p className="font-display text-lg uppercase tracking-[0.3em] text-white">Rockstar Sales Universe</p>
            <p className="text-[11px] uppercase tracking-[0.22em] text-white/42">
              Release atlas, sales model, and data lab for Rockstar's catalog
            </p>
          </div>
        </Link>
        <nav className="flex flex-wrap items-center gap-2">
          {siteConfig.navigation.map((item) => {
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                className={cn(
                  "rounded-full border px-4 py-2 text-xs uppercase tracking-[0.24em] transition",
                  active
                    ? "border-white/22 bg-white/10 text-white"
                    : "border-transparent bg-transparent text-white/60 hover:border-white/10 hover:bg-white/5 hover:text-white"
                )}
                href={item.href}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
