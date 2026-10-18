import { Page } from '@playwright/test';
import { gotoApp } from '../support/demoSite';

export class CartPage {
  constructor(private readonly page: Page) {}

  async goto() {
    await gotoApp(this.page, '/view_cart');
  }

  productRow(productId: number) {
    return this.page.locator(`#product-${productId}`);
  }

  rowQuantity(productId: number) {
    return this.productRow(productId).locator('.cart_quantity');
  }

  rowPrice(productId: number) {
    return this.productRow(productId).locator('.cart_price');
  }

  rowTotal(productId: number) {
    return this.productRow(productId).locator('.cart_total_price');
  }

  async proceedToCheckout() {
    await this.page.locator('a.check_out').click();
  }

  guestCheckoutModal() {
    return this.page.locator('#checkoutModal');
  }
}
