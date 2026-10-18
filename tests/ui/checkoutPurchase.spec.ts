import { test, expect } from '../support/fixtures';
import { ProductDetailsPage } from '../../src/pages/productDetailsPage';
import { ProductsPage } from '../../src/pages/productsPage';
import { CartPage } from '../../src/pages/cartPage';
import { CheckoutPage } from '../../src/pages/checkoutPage';
import { PaymentPage } from '../../src/pages/paymentPage';
import { KNOWN_PRODUCTS } from '../../src/data/products';
import { DUMMY_CARD } from '../../src/data/payment';

/**
 * Hybrid checkout: API-provisioned authenticated user buys known products.
 * Asserts cart math, address details from the account, and order confirmation.
 */
test.describe('Checkout purchase', () => {
  test('authenticated user completes cart, payment, and order confirmation', async ({
    page,
    authenticatedUser,
  }) => {
    const details = new ProductDetailsPage(page);
    const products = new ProductsPage(page);
    const cart = new CartPage(page);
    const checkout = new CheckoutPage(page);
    const payment = new PaymentPage(page);

    const { blueTop, menTshirt } = KNOWN_PRODUCTS;
    const blueTopQty = 2;
    const expectedBlueTopTotal = 500 * blueTopQty;
    const expectedGrandTotal = expectedBlueTopTotal + 400;

    await details.goto(blueTop.id);
    await expect(details.productName()).toHaveText(blueTop.name);
    await details.setQuantity(blueTopQty);
    await details.addToCart();
    await details.viewCartFromModal();

    await expect(cart.productRow(blueTop.id)).toContainText(blueTop.name);
    await expect(cart.rowQuantity(blueTop.id)).toContainText(String(blueTopQty));
    await expect(cart.rowPrice(blueTop.id)).toContainText(blueTop.price);
    await expect(cart.rowTotal(blueTop.id)).toContainText(`Rs. ${expectedBlueTopTotal}`);

    await products.goto();
    await products.addProductToCartById(menTshirt.id);
    await products.viewCartFromModal();

    await expect(cart.productRow(menTshirt.id)).toContainText(/Men\s*Tshirt/i);
    await expect(cart.rowQuantity(menTshirt.id)).toContainText('1');
    await expect(cart.rowTotal(menTshirt.id)).toContainText(menTshirt.price);

    await cart.proceedToCheckout();
    await expect(page).toHaveURL(/\/checkout/);

    await expect(checkout.deliveryAddress()).toContainText(authenticatedUser.firstname);
    await expect(checkout.deliveryAddress()).toContainText(authenticatedUser.lastname);
    await expect(checkout.deliveryAddress()).toContainText(authenticatedUser.address1);
    await expect(checkout.deliveryAddress()).toContainText(authenticatedUser.city);
    await expect(checkout.billingAddress()).toContainText(authenticatedUser.address1);
    await expect(checkout.orderReview()).toContainText(blueTop.name);
    await expect(checkout.orderReview()).toContainText(/Men\s*Tshirt/i);
    await expect(checkout.orderTotalAmount()).toContainText(`Rs. ${expectedGrandTotal}`);

    await checkout.placeOrder();

    await payment.payAndConfirm({
      nameOnCard: authenticatedUser.displayName,
      ...DUMMY_CARD,
    });

    await expect(page).toHaveURL(new RegExp(`/payment_done/${expectedGrandTotal}`));
    await expect(payment.orderPlacedHeading()).toHaveText(/ORDER PLACED!/i);
    await expect(page.getByRole('link', { name: /Download Invoice/i })).toBeVisible();
  });
});
