import { test, expect } from '../support/fixtures';
import { LoginPage } from '../../src/pages/loginPage';
import { AccountPage } from '../../src/pages/accountPage';
import { loginViaUi } from '../../src/auth/uiLogin';

/**
 * UI authentication behavior: successful session, logout, and invalid credentials.
 * User is created/deleted via API so the test focuses on UI session semantics.
 */
test.describe('Authentication UI', () => {
  test('logs in, logs out, and rejects invalid credentials', async ({
    page,
    apiUser,
  }) => {
    const loginPage = new LoginPage(page);
    const accountPage = new AccountPage(page);

    await loginViaUi(page, apiUser);
    await expect(page.getByText(`Logged in as ${apiUser.displayName}`)).toBeVisible();
    await expect(page.getByRole('link', { name: 'Logout' })).toBeVisible();

    await accountPage.logout();
    await expect(page.getByRole('link', { name: /Signup \/ Login/i })).toBeVisible();
    await expect(page.getByText(`Logged in as ${apiUser.displayName}`)).toHaveCount(0);
    await expect(page.locator('[data-qa="login-button"]')).toBeVisible();

    await loginPage.login(apiUser.email, 'WrongPassword!');
    await expect(loginPage.incorrectCredentialsMessage()).toBeVisible();
    await expect(page).toHaveURL(/\/login/);
  });
});
