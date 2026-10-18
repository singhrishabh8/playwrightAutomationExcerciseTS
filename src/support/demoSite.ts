import { Page, expect } from '@playwright/test';

/**
 * automationexercise.com periodically returns a "heavy load (queue full)" HTML page.
 * One immediate re-navigation is a targeted recovery for that known degraded response,
 * not a general flake-retry strategy.
 */
export async function gotoApp(page: Page, path: string): Promise<void> {
  const target = path.startsWith('http') ? path : path;
  await page.goto(target, { waitUntil: 'domcontentloaded' });

  if (await isHeavyLoadPage(page)) {
    await page.goto(target, { waitUntil: 'domcontentloaded' });
  }

  await expect(
    page.getByRole('heading', { name: /under heavy load/i }),
    `Demo site overloaded for ${target}`,
  ).toHaveCount(0);
}

export async function isHeavyLoadPage(page: Page): Promise<boolean> {
  return page
    .getByRole('heading', { name: /under heavy load/i })
    .isVisible()
    .catch(() => false);
}

/** Google ad vignettes intercept clicks on this demo site (e.g. checkout → payment). */
export async function dismissGoogleVignetteIfPresent(page: Page): Promise<void> {
  await page.evaluate(() => {
    document.getElementById('google_vignette')?.remove();
    document.querySelectorAll('iframe[id^="aswift"], iframe[name^="aswift"]').forEach((el) => el.remove());
  });
}
