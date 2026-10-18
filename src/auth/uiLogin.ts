import { Page, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';

/**
 * Why UI login (not storageState by default):
 * The app uses a Django `sessionid` cookie. Per-test UI login after API user
 * creation keeps dependencies explicit and avoids shared mutable auth files.
 * If suite runtime becomes a problem, switch to storageState generated from
 * this same helper without changing page objects.
 */
export async function loginViaUi(
  page: Page,
  credentials: { email: string; password: string; displayName: string },
): Promise<void> {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(credentials.email, credentials.password);
  await expect(page.getByText(`Logged in as ${credentials.displayName}`)).toBeVisible();
}
