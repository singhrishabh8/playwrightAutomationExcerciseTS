import { test, expect } from '../support/fixtures';
import { buildTestUser } from '../../src/data/userFactory';
import type { CreateAccountParams } from '../../src/api/types';

function toCreateParams(
  user: ReturnType<typeof buildTestUser>,
): CreateAccountParams {
  const { displayName: _displayName, ...params } = user;
  return params;
}

/**
 * Direct API coverage for account lifecycle.
 * Setup/cleanup here is part of the behavior under test (not merely fixture wiring).
 */
test.describe('Account API lifecycle', () => {
  test('create, verify, fetch, reject bad credentials, and delete', async ({
    accountApi,
  }) => {
    const user = buildTestUser();
    const params = toCreateParams(user);

    const created = await accountApi.createAccount(params);
    expect(created.responseCode).toBe(201);
    expect(created.message).toBe('User created!');

    const duplicate = await accountApi.createAccount(params);
    expect(duplicate.responseCode).toBe(400);
    expect(duplicate.message).toMatch(/already exists/i);

    const verified = await accountApi.verifyLogin(user.email, user.password);
    expect(verified.responseCode).toBe(200);
    expect(verified.message).toBe('User exists!');

    const rejected = await accountApi.verifyLogin(user.email, 'WrongPassword!');
    expect(rejected.responseCode).toBe(404);
    expect(rejected.message).toBe('User not found!');

    const missingEmail = await accountApi.verifyLoginWithoutEmail(user.password);
    expect(missingEmail.responseCode).toBe(400);
    expect(missingEmail.message).toMatch(/email or password parameter is missing/i);

    const detail = await accountApi.getUserDetailByEmail(user.email);
    expect(detail.responseCode).toBe(200);
    expect(detail.user).toEqual(
      expect.objectContaining({
        email: user.email,
        name: user.name,
        first_name: user.firstname,
        last_name: user.lastname,
        country: user.country,
        city: user.city,
      }),
    );

    const deleted = await accountApi.deleteAccount(user.email, user.password);
    expect(deleted.responseCode).toBe(200);
    expect(deleted.message).toBe('Account deleted!');

    const verifyAfterDelete = await accountApi.verifyLogin(user.email, user.password);
    expect(verifyAfterDelete.responseCode).toBe(404);
  });
});
