import type { CreateAccountParams } from '../api/types';

export type TestUser = CreateAccountParams & {
  /** Display name used in "Logged in as …" after UI signup/login. */
  displayName: string;
};

/**
 * Deterministic-enough users: unique email per call avoids collisions on the
 * shared demo site. Prefer API create/delete over manually curated accounts.
 */
export function buildTestUser(overrides: Partial<CreateAccountParams> = {}): TestUser {
  const stamp = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const firstname = overrides.firstname ?? 'Keychain';
  const lastname = overrides.lastname ?? 'Tester';
  const name = overrides.name ?? `${firstname} ${lastname}`;

  return {
    name,
    displayName: name,
    email: overrides.email ?? `qa.agent.${stamp}@example.com`,
    password: overrides.password ?? 'TestPass123!',
    title: overrides.title ?? 'Mr',
    birth_date: overrides.birth_date ?? '1',
    birth_month: overrides.birth_month ?? 'January',
    birth_year: overrides.birth_year ?? '1990',
    firstname,
    lastname,
    company: overrides.company ?? 'Keychain QA',
    address1: overrides.address1 ?? '123 Test Street',
    address2: overrides.address2 ?? 'Suite 1',
    country: overrides.country ?? 'India',
    zipcode: overrides.zipcode ?? '110001',
    state: overrides.state ?? 'Delhi',
    city: overrides.city ?? 'New Delhi',
    mobile_number: overrides.mobile_number ?? '9999999999',
  };
}
