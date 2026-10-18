import { APIRequestContext } from '@playwright/test';
import { ApiClient } from './client';
import type { BrandRow, Product } from './types';

/** Product/brand practice APIs — preferred for direct API coverage and data lookup. */
export class ProductsApi {
  private readonly client: ApiClient;

  constructor(request: APIRequestContext) {
    this.client = new ApiClient(request);
  }

  getProductsList() {
    return this.client.getJson<{ products: Product[] }>('/api/productsList');
  }

  /** Documented negative: POST is not supported (responseCode 405). */
  postProductsList() {
    return this.client.postForm('/api/productsList', {});
  }

  getBrandsList() {
    return this.client.getJson<{ brands: BrandRow[] }>('/api/brandsList');
  }

  searchProduct(searchProduct: string) {
    return this.client.postForm<{ products: Product[] }>('/api/searchProduct', {
      search_product: searchProduct,
    });
  }

  /** Documented negative: missing search_product → responseCode 400. */
  searchProductWithoutParam() {
    return this.client.postForm('/api/searchProduct', {});
  }
}
