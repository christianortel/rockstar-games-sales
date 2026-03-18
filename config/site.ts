export const siteConfig = {
  name: "Rockstar Sales Universe",
  description:
    "An interactive release atlas for Rockstar Games, with title history, platform coverage, sales modeling, and transparent data provenance.",
  navigation: [
    { href: "/", label: "Catalog" },
    { href: "/dashboard", label: "Atlas" },
    { href: "/compare", label: "Compare" },
    { href: "/data-lab", label: "Data Lab" },
    { href: "/methodology", label: "Method" }
  ]
} as const;
