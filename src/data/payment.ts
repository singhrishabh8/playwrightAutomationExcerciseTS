/** Dummy card accepted by the practice checkout (no real processor). */
export const DUMMY_CARD = {
  cardNumber: '4111111111111111',
  cvc: '123',
  expiryMonth: '12',
  expiryYear: '2030',
} as const;
