import { test, expect } from '../support/fixtures';
import { gotoApp } from '../../src/support/demoSite';

/**
 * Representative UI smoke for Phase 2 wiring validation.
 * Business-depth flows are intentionally deferred to Phase 3.
 */
test.describe('Home smoke', () => {
  test('home page exposes primary navigation', async ({ page }) => {
    await gotoApp(page, '/');

    await expect(page).toHaveTitle(/Automation Exercise/i);
    // Scope to primary nav — homepage also contains third-party "products" links.
    const nav = page.locator('.navbar-nav');
    await expect(nav.getByRole('link', { name: /Signup \/ Login/i })).toBeVisible();
    await expect(nav.getByRole('link', { name: /Products/i })).toBeVisible();
    await expect(nav.getByRole('link', { name: /Cart/i })).toBeVisible();
  });
});
