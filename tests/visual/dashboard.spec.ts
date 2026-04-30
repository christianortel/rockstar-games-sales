import { expect, test } from "@playwright/test";

async function expectNoHorizontalOverflow(page: import("@playwright/test").Page) {
  const hasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 4);
  expect(hasOverflow).toBe(false);
}

test.describe("dashboard interview surfaces", () => {
  test("dashboard overview renders source-first cockpit without layout overflow", async ({ page }) => {
    await page.goto("/dashboard");

    await expect(page.getByRole("heading", { name: /sales intelligence cockpit/i })).toBeVisible();
    await expect(page.getByText(/official data/i).first()).toBeVisible();
    await expect(page.getByRole("button", { name: /sources/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /model audit/i })).toBeVisible();
    await expectNoHorizontalOverflow(page);
  });

  test("dashboard source tab exposes audit context", async ({ page }) => {
    await page.goto("/dashboard?tab=sources");

    await expect(page.getByRole("button", { name: /sources/i })).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByText(/take-two investor presentation/i).first()).toBeVisible();
    await expect(page.getByText(/tier 1/i).first()).toBeVisible();
    await expectNoHorizontalOverflow(page);
  });

  test("dashboard model audit tab exposes versioned methodology", async ({ page }) => {
    await page.goto("/dashboard?tab=model-audit");

    await expect(page.getByRole("button", { name: /model audit/i })).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByText(/blend-model-v1\.2\.0/i)).toBeVisible();
    await expect(page.getByText(/known weaknesses/i).first()).toBeVisible();
    await expectNoHorizontalOverflow(page);
  });

  test("source review route renders read-only audit queue surface", async ({ page }) => {
    await page.goto("/admin/source-review");

    await expect(page.getByRole("heading", { name: /source review/i })).toBeVisible();
    await expect(page.getByText(/data freshness/i).first()).toBeVisible();
    await expect(page.getByText(/field provenance review/i).first()).toBeVisible();
    await expectNoHorizontalOverflow(page);
  });
});
