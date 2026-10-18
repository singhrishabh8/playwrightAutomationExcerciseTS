import { test as base, expect } from '@playwright/test';
import { AccountApi } from '../../src/api/accountApi';
import { ProductsApi } from '../../src/api/productsApi';
import { loginViaUi } from '../../src/auth/uiLogin';
import { buildTestUser, type TestUser } from '../../src/data/userFactory';
import type { CreateAccountParams } from '../../src/api/types';

type AppFixtures = {
  accountApi: AccountApi;
  productsApi: ProductsApi;
  /**
   * Creates a unique user via API before the test and deletes it after.
   * Use for API assertions or as a prerequisite for UI login.
   */
  apiUser: TestUser;
  /** API-created user already logged in through the UI. */
  authenticatedUser: TestUser;
};

function toCreateParams(user: TestUser): CreateAccountParams {
  const { displayName: _displayName, ...params } = user;
  return params;
}

export const test = base.extend<AppFixtures>({
  // Abort common ad/tracker hosts so interstitial vignettes do not steal clicks.
  page: async ({ page }, use) => {
    await page.route(
      /googlesyndication|doubleclick|googleads|fundingchoices|adservice\.google|pagead\/|googletagservices/i,
      (route) => route.abort(),
    );
    await use(page);
  },

  accountApi: async ({ request }, use) => {
    await use(new AccountApi(request));
  },

  productsApi: async ({ request }, use) => {
    await use(new ProductsApi(request));
  },

  apiUser: async ({ accountApi }, use) => {
    const user = buildTestUser();
    const created = await accountApi.createAccount(toCreateParams(user));
    expect(created.responseCode).toBe(201);

    await use(user);

    const deleted = await accountApi.deleteAccount(user.email, user.password);
    expect(deleted.responseCode).toBe(200);
  },

  authenticatedUser: async ({ page, accountApi }, use) => {
    const user = buildTestUser();
    const created = await accountApi.createAccount(toCreateParams(user));
    expect(created.responseCode).toBe(201);
    await loginViaUi(page, user);

    await use(user);

    const deleted = await accountApi.deleteAccount(user.email, user.password);
    expect(deleted.responseCode).toBe(200);
  },
});

export { expect };
