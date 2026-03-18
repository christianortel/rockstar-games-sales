"use client";

import Image from "next/image";

import { gameAssets } from "@/config/gameAssets";
import { getTheme } from "@/lib/themes/theme-utils";
import { cn } from "@/lib/utils";
import { Game } from "@/types/domain";

type CoverVariant = "catalog" | "feature";

function getPosterImage(game: Pick<Game, "id">) {
  return gameAssets[game.id]?.posterImage;
}

function getLogoImage(game: Pick<Game, "id" | "parentGameId">) {
  return gameAssets[game.id]?.logoImage ?? (game.parentGameId ? gameAssets[game.parentGameId]?.logoImage : undefined);
}

function chunkTitle(title: string, maxCharsPerLine: number, maxLines: number) {
  const titleParts = title
    .replace(/:\s+/g, ": ")
    .split(/(?:: )/)
    .flatMap((part) => part.split(/\s+/))
    .filter(Boolean);
  const lines: string[] = [];
  let currentLine = "";

  for (const word of titleParts) {
    const nextLine = currentLine ? `${currentLine} ${word}` : word;

    if (nextLine.length <= maxCharsPerLine || !currentLine) {
      currentLine = nextLine;
      continue;
    }

    lines.push(currentLine);
    currentLine = word;

    if (lines.length === maxLines - 1) break;
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  if (lines.length > maxLines) {
    return lines.slice(0, maxLines);
  }

  const consumedWordCount = lines.join(" ").split(/\s+/).filter(Boolean).length;
  if (consumedWordCount < titleParts.length && lines.length) {
    lines[lines.length - 1] = `${lines[lines.length - 1]}…`;
  }

  return lines;
}

export function GameCoverArt({
  game,
  className,
  imageClassName,
  sizes,
  variant = "catalog"
}: {
  game: Pick<Game, "franchise" | "id" | "kind" | "parentGameId" | "releaseYear" | "themeKey" | "title">;
  className?: string;
  imageClassName?: string;
  sizes: string;
  variant?: CoverVariant;
}) {
  const theme = getTheme(game.themeKey);
  const poster = getPosterImage(game);
  const logo = getLogoImage(game);
  const titleLines = chunkTitle(game.title, variant === "catalog" ? 12 : 16, variant === "catalog" ? 3 : 4);

  if (poster) {
    return (
      <div className={cn("relative h-full w-full overflow-hidden", className)}>
        <Image
          alt={game.title}
          className={cn("object-cover object-center", imageClassName)}
          fill
          sizes={sizes}
          src={poster}
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
      </div>
    );
  }

  return (
    <div
      className={cn("relative isolate h-full w-full overflow-hidden", className)}
      style={{
        background: `linear-gradient(160deg, ${theme.accentStrong}66 0%, rgba(10,10,12,0.88) 44%, ${theme.accent}22 100%)`
      }}
    >
      <div
        className="absolute inset-0 opacity-90"
        style={{
          backgroundImage: [
            `radial-gradient(circle at 20% 16%, ${theme.accent}66 0%, transparent 34%)`,
            "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 36%, transparent 66%, rgba(255,255,255,0.04) 100%)"
          ].join(", ")
        }}
      />
      <div
        className="absolute inset-y-0 right-0 w-[38%] opacity-45"
        style={{
          background: `linear-gradient(180deg, transparent 0%, ${theme.accentStrong}33 24%, transparent 100%)`
        }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.05)_0%,rgba(0,0,0,0.18)_100%)]" />
      <div className="absolute inset-y-3 left-3 w-px bg-white/12" />

      <div className={cn("relative flex h-full flex-col justify-between", variant === "catalog" ? "p-3" : "p-4")}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p
              className={cn(
                "truncate uppercase text-white/72",
                variant === "catalog" ? "text-[8px] tracking-[0.24em]" : "text-[10px] tracking-[0.28em]"
              )}
            >
              {game.franchise}
            </p>
            <p className={cn("mt-1 uppercase tracking-[0.22em] text-white/42", variant === "catalog" ? "text-[7px]" : "text-[9px]")}>
              {game.kind.replace(/_/g, " ")}
            </p>
          </div>
          <span
            className={cn(
              "shrink-0 rounded-full border border-white/12 bg-black/20 px-2 py-1 uppercase tracking-[0.18em] text-white/66",
              variant === "catalog" ? "text-[7px]" : "text-[9px]"
            )}
          >
            {game.releaseYear}
          </span>
        </div>

        <div className="mt-auto">
          {logo ? (
            <div className={cn("relative mb-3", variant === "catalog" ? "h-7" : "h-10")}>
              <Image
                alt={`${game.title} logo`}
                className="object-contain object-left brightness-0 invert"
                fill
                sizes={variant === "catalog" ? "84px" : sizes}
                src={logo}
                unoptimized
              />
            </div>
          ) : null}

          <div className="space-y-1">
            {titleLines.map((line) => (
              <p
                key={line}
                className={cn(
                  "font-display uppercase leading-none text-white",
                  variant === "catalog" ? "text-[0.95rem] tracking-[0.05em]" : "text-[1.45rem] tracking-[0.05em]"
                )}
              >
                {line}
              </p>
            ))}
          </div>

          <div className="mt-3 h-px bg-white/12" />
          <p
            className={cn(
              "mt-2 uppercase tracking-[0.28em] text-white/42",
              variant === "catalog" ? "text-[7px]" : "text-[9px]"
            )}
          >
            Rockstar Games
          </p>
        </div>
      </div>
    </div>
  );
}
