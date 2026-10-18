import { test, expect } from '../support/fixtures';
import { KNOWN_PRODUCTS, SEARCH_TERM_TOP } from '../../src/data/products';

/**
 * Direct API coverage for catalogue/search contracts observed in Phase 1.
 */
test.describe('Products API', () => {
  test('lists products and supports search with negative contract', async ({
    productsApi,
  }) => {
    const catalogue = await productsApi.getProductsList();
    expect(catalogue.responseCode).toBe(200);
    expect(catalogue.products.length).toBeGreaterThan(0);
    expect(
      catalogue.products.find((p) => p.id === KNOWN_PRODUCTS.blueTop.id),
    ).toEqual(
      expect.objectContaining({
        name: KNOWN_PRODUCTS.blueTop.name,
        price: KNOWN_PRODUCTS.blueTop.price,
        brand: KNOWN_PRODUCTS.blueTop.brand,
      }),
    );

    const search = await productsApi.searchProduct(SEARCH_TERM_TOP);
    expect(search.responseCode).toBe(200);
    expect(search.products.length).toBeGreaterThan(0);
    // Search is broader than exact name substring (e.g. related shirts); assert known hit.
    expect(search.products.some((p) => p.id === KNOWN_PRODUCTS.blueTop.id)).toBe(true);
    expect(
      search.products.some((p) => p.name.toLowerCase().includes(SEARCH_TERM_TOP)),
    ).toBe(true);

    const missingParam = await productsApi.searchProductWithoutParam();
    expect(missingParam.responseCode).toBe(400);
    expect(missingParam.message).toMatch(/search_product parameter is missing/i);

    const unsupportedPost = await productsApi.postProductsList();
    expect(unsupportedPost.responseCode).toBe(405);
    expect(unsupportedPost.message).toMatch(/not supported/i);
  });
});
