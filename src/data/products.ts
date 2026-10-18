/**
 * Stable catalogue anchors observed during Phase 1 exploration.
 * Prefer these over scraping the homepage when a test needs a known product.
 */
export const KNOWN_PRODUCTS = {
  blueTop: {
    id: 1,
    name: 'Blue Top',
    price: 'Rs. 500',
    brand: 'Polo',
    categoryPath: 'Women > Tops',
  },
  menTshirt: {
    id: 2,
    name: 'Men Tshirt',
    price: 'Rs. 400',
    brand: 'H&M',
    categoryPath: 'Men > Tshirts',
  },
} as const;

export const SEARCH_TERM_TOP = 'top';
