import { Page, expect } from '@playwright/test';
import { gotoApp } from '../support/demoSite';

export class ProductsPage {
  constructor(private readonly page: Page) {}

  async goto() {
    await gotoApp(this.page, '/products');
  }

  async search(term: string) {
    await this.page.locator('#search_product').fill(term);
    await this.page.locator('#submit_search').click();
    await expect(this.page).toHaveURL(new RegExp(`search=${term}`));
    await expect(
      this.page.getByRole('heading', { name: /under heavy load/i }),
    ).toHaveCount(0);
  }

  searchedProductsHeading() {
    // Prefer role/name; class-only heading can be missing when the layout shifts.
    return this.page.getByRole('heading', { name: /Searched Products/i });
  }

  productNames() {
    return this.page.locator('.features_items .productinfo p');
  }

  productCards() {
    return this.page.locator('.features_items .product-image-wrapper');
  }

  async openBrand(brand: string) {
    await gotoApp(this.page, `/brand_products/${encodeURIComponent(brand)}`);
  }

  async addProductToCartById(productId: number) {
    await this.page.locator(`a.add-to-cart[data-product-id="${productId}"]`).first().click();
    await this.page.locator('#cartModal').waitFor({ state: 'visible' });
  }

  async viewCartFromModal() {
    await this.page.locator('#cartModal a[href="/view_cart"]').click();
  }

  async continueShoppingFromModal() {
    await this.page.locator('#cartModal').getByRole('button', { name: 'Continue Shopping' }).click();
  }
}
