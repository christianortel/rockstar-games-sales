import { games, releases, sources } from "@/data/normalized/seed";

console.log(
  JSON.stringify(
    {
      games: games.length,
      releases: releases.length,
      sources: sources.length
    },
    null,
    2
  )
);
