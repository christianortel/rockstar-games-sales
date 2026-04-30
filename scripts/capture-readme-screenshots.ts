import { mkdirSync } from "node:fs";
import path from "node:path";

import { chromium, Page } from "playwright";

const baseUrl = process.env.APP_BASE_URL ?? "http://127.0.0.1:3000";
const outputDir = path.join(process.cwd(), "docs", "screenshots");

const screenshotTargets = [
  {
    path: "/",
    fileName: "readme-homepage-hero.png",
    viewport: { width: 1440, height: 1050 }
  },
  {
    path: "/dashboard?tab=sources",
    fileName: "readme-dashboard-sources.png",
    viewport: { width: 1440, height: 1200 }
  },
  {
    path: "/compare?games=gta_v,red_dead_redemption_2",
    fileName: "readme-compare.png",
    viewport: { width: 1440, height: 1050 }
  },
  {
    path: "/data-lab",
    fileName: "readme-data-lab.png",
    viewport: { width: 1440, height: 1050 }
  }
];

async function preparePage(page: Page, targetPath: string) {
  await page.goto(new URL(targetPath, baseUrl).toString(), { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(500);
}

async function main() {
  mkdirSync(outputDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });

  try {
    for (const target of screenshotTargets) {
      const page = await browser.newPage({ viewport: target.viewport });
      await preparePage(page, target.path);
      const outputPath = path.join(outputDir, target.fileName);
      await page.screenshot({ path: outputPath, fullPage: false });
      await page.close();
      console.log(`captured ${target.path} -> ${outputPath}`);
    }
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
