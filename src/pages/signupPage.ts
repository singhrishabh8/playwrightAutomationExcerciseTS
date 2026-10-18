import { Page } from '@playwright/test';
import type { TestUser } from '../data/userFactory';

/** Second step of UI registration ("Enter Account Information"). */
export class SignupPage {
  constructor(private readonly page: Page) {}

  async completeAccountInformation(user: TestUser) {
    await this.page.getByRole('radio', { name: 'Mr.' }).check();
    await this.page.locator('[data-qa="password"]').fill(user.password);
    await this.page.locator('[data-qa="days"]').selectOption(user.birth_date);
    // UI month select uses numeric values ("1" = January), not month names.
    await this.page.locator('[data-qa="months"]').selectOption('1');
    await this.page.locator('[data-qa="years"]').selectOption(user.birth_year);
    await this.page.locator('[data-qa="first_name"]').fill(user.firstname);
    await this.page.locator('[data-qa="last_name"]').fill(user.lastname);
    await this.page.locator('[data-qa="company"]').fill(user.company);
    await this.page.locator('[data-qa="address"]').fill(user.address1);
    await this.page.locator('[data-qa="address2"]').fill(user.address2);
    await this.page.locator('[data-qa="country"]').selectOption(user.country);
    await this.page.locator('[data-qa="state"]').fill(user.state);
    await this.page.locator('[data-qa="city"]').fill(user.city);
    await this.page.locator('[data-qa="zipcode"]').fill(user.zipcode);
    await this.page.locator('[data-qa="mobile_number"]').fill(user.mobile_number);
    await this.page.locator('[data-qa="create-account"]').click();
  }

  accountCreatedHeading() {
    return this.page.locator('[data-qa="account-created"]');
  }

  async continueAfterAccountCreated() {
    await this.page.locator('[data-qa="continue-button"]').click();
  }
}
