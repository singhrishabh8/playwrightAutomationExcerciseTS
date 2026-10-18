import { Page } from '@playwright/test';
import { gotoApp } from '../support/demoSite';

export class LoginPage {
  constructor(private readonly page: Page) {}

  async goto() {
    await gotoApp(this.page, '/login');
  }

  async login(email: string, password: string) {
    await this.page.locator('[data-qa="login-email"]').fill(email);
    await this.page.locator('[data-qa="login-password"]').fill(password);
    await this.page.locator('[data-qa="login-button"]').click();
  }

  async startSignup(name: string, email: string) {
    await this.page.locator('[data-qa="signup-name"]').fill(name);
    await this.page.locator('[data-qa="signup-email"]').fill(email);
    await this.page.locator('[data-qa="signup-button"]').click();
  }

  incorrectCredentialsMessage() {
    return this.page.getByText('Your email or password is incorrect!');
  }

  emailAlreadyExistsMessage() {
    return this.page.getByText('Email Address already exist!');
  }
}
