import { Page } from '@playwright/test';
import { gotoApp } from '../support/demoSite';

export class ProductDetailsPage {
  constructor(private readonly page: Page) {}

  async goto(productId: number) {
    await gotoApp(this.page, `/product_details/${productId}`);
  }

  productName() {
    return this.page.locator('.product-information h2');
  }

  async setQuantity(quantity: number) {
    await this.page.locator('#quantity').fill(String(quantity));
  }

  async addToCart() {
    await this.page.locator('button.cart').click();
    await this.page.locator('#cartModal').waitFor({ state: 'visible' });
  }

  async viewCartFromModal() {
    await this.page.locator('#cartModal a[href="/view_cart"]').click();
  }
}
