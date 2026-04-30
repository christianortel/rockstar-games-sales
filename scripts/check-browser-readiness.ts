import { chromium } from "@playwright/test";

const strict = process.argv.includes("--strict");

function isBlockedLaunch(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  return /EPERM|EACCES|spawn|Executable doesn't exist|browserType\.launch/i.test(message);
}

async function main() {
  try {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.setContent("<main><h1>browser ready</h1></main>");
    const title = await page.locator("h1").textContent();
    await browser.close();

    if (title !== "browser ready") {
      throw new Error("Chromium launched, but page smoke check did not return expected content.");
    }

    console.log("ok Chromium launches and can render a page.");
    console.log("Browser visual checks can run in this environment.");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    if (!isBlockedLaunch(error)) {
      console.error(message);
      process.exit(1);
    }

    console.warn("blocked Chromium cannot launch in this environment.");
    console.warn(message.split("\n").slice(0, 4).join("\n"));
    console.warn("Run this in CI or a local shell that allows browser child processes before final visual signoff.");

    if (strict) {
      process.exit(1);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
