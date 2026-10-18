import { Page } from '@playwright/test';

export type CardDetails = {
  nameOnCard: string;
  cardNumber: string;
  cvc: string;
  expiryMonth: string;
  expiryYear: string;
};

export class PaymentPage {
  constructor(private readonly page: Page) {}

  async payAndConfirm(card: CardDetails) {
    await this.page.locator('[data-qa="name-on-card"]').fill(card.nameOnCard);
    await this.page.locator('[data-qa="card-number"]').fill(card.cardNumber);
    await this.page.locator('[data-qa="cvc"]').fill(card.cvc);
    await this.page.locator('[data-qa="expiry-month"]').fill(card.expiryMonth);
    await this.page.locator('[data-qa="expiry-year"]').fill(card.expiryYear);
    await this.page.locator('[data-qa="pay-button"]').click();
  }

  orderPlacedHeading() {
    return this.page.locator('[data-qa="order-placed"]');
  }
}
