import { Page, expect } from '@playwright/test';

/** Account lifecycle confirmation screens (created / deleted). */
export class AccountPage {
  constructor(private readonly page: Page) {}

  accountDeletedHeading() {
    return this.page.locator('[data-qa="account-deleted"]');
  }

  async continue() {
    await this.page.locator('[data-qa="continue-button"]').click();
  }

  async deleteAccountFromNav() {
    await this.page.getByRole('link', { name: 'Delete Account' }).click();
  }

  async logout() {
    await this.page.getByRole('link', { name: 'Logout' }).click();
    // Prefer logged-out UI over a specific URL: /logout may linger before /login,
    // and overload pages break hard URL assertions.
    await expect(this.page.locator('[data-qa="login-button"]')).toBeVisible();
  }
}
