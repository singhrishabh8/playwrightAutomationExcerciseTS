import { test, expect } from '../support/fixtures';
import { ProductsPage } from '../../src/pages/productsPage';
import { SEARCH_TERM_TOP } from '../../src/data/products';

/**
 * Product discovery: UI search results should match the practice search API.
 */
test.describe('Product search', () => {
  test('UI search results align with /api/searchProduct', async ({
    page,
    productsApi,
  }) => {
    const apiSearch = await productsApi.searchProduct(SEARCH_TERM_TOP);
    expect(apiSearch.responseCode).toBe(200);
    expect(apiSearch.products.length).toBeGreaterThan(0);

    const productsPage = new ProductsPage(page);
    await productsPage.goto();
    await productsPage.search(SEARCH_TERM_TOP);

    await expect(productsPage.searchedProductsHeading()).toBeVisible();
    await expect(productsPage.productCards()).toHaveCount(apiSearch.products.length);

    const normalize = (name: string) => name.replace(/\s+/g, ' ').trim().toLowerCase();
    const uiNames = (await productsPage.productNames().allTextContents()).map(normalize);
    const apiNames = apiSearch.products.map((p) => normalize(p.name));

    expect(uiNames.sort()).toEqual(apiNames.sort());
    // UI search mirrors API; API matching is broader than name.substring("top").
    expect(uiNames.some((name) => name.includes(SEARCH_TERM_TOP))).toBe(true);
  });
});

