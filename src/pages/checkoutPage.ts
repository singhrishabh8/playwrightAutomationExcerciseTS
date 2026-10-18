import { Page, expect } from '@playwright/test';
import { dismissGoogleVignetteIfPresent } from '../support/demoSite';

export class CheckoutPage {
  constructor(private readonly page: Page) {}

  deliveryAddress() {
    return this.page.locator('#address_delivery');
  }

  billingAddress() {
    return this.page.locator('#address_invoice');
  }

  orderReview() {
    return this.page.locator('#cart_info');
  }

  /** Grand total is rendered on checkout review, not on /view_cart. */
  orderTotalAmount() {
    return this.page.getByRole('row', { name: /Total Amount/ }).locator('.cart_total_price');
  }

  async placeOrder() {
    await dismissGoogleVignetteIfPresent(this.page);
    await this.page.locator('a[href="/payment"]').click();

    if (this.page.url().includes('google_vignette')) {
      await dismissGoogleVignetteIfPresent(this.page);
      await this.page.locator('a[href="/payment"]').click({ force: true });
    }

    await expect(this.page).toHaveURL(/\/payment/);
  }
}
