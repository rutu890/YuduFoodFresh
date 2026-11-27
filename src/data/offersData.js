
export const offers = [
  {
    id: 'offer_001',
    title: 'FLAT 50% OFF',
    subtitle: 'Get 50% off your first order',
    code: 'WELCOME50',
    type: 'percentage',
    discountValue: 50,
    maxDiscount: 100,
    minOrder: 199,
    expiresAt: '2026-12-31T23:59:59',
    description: 'Enjoy 50% off your first eligible order.',
    terms: [
      'Valid for first-time customers.',
      'Minimum order value ₹199.',
      'Maximum discount ₹100.',
      'Cannot be combined with another coupon.',
    ],
    gradient: ['#FF5A21', '#E94708'],
  },
  {
    id: 'offer_002',
    title: '20% OFF',
    subtitle: 'Save on selected restaurant orders',
    code: 'YUDU20',
    type: 'percentage',
    discountValue: 20,
    maxDiscount: 150,
    minOrder: 299,
    expiresAt: '2026-12-15T23:59:59',
    description: 'Get 20% off eligible restaurant orders.',
    terms: [
      'Minimum order value ₹299.',
      'Maximum discount ₹150.',
      'Valid on selected restaurants.',
      'Cannot be combined with another coupon.',
    ],
    gradient: ['#008C89', '#00A89B'],
  },
  {
    id: 'offer_003',
    title: 'FREE DELIVERY',
    subtitle: 'No delivery fee on orders above ₹299',
    code: 'FREEDEL',
    type: 'freeDelivery',
    discountValue: 25,
    maxDiscount: 25,
    minOrder: 299,
    expiresAt: '2026-12-05T23:59:59',
    description: 'Save the delivery fee on eligible orders.',
    terms: [
      'Minimum order value ₹299.',
      'Waives the delivery fee only.',
      'Taxes and other charges still apply.',
      'Cannot be combined with another coupon.',
    ],
    gradient: ['#0874B9', '#39BDF8'],
  },
];

export function getOfferByCode(code) {
  const normalizedCode = code?.trim().toUpperCase();

  return offers.find(
    (offer) => offer.code === normalizedCode
  );
}

export function validateCoupon(code, subtotal) {
  const normalizedCode = code?.trim().toUpperCase();

  if (!normalizedCode) {
    return {
      valid: false,
      message: 'Please enter a coupon code.',
    };
  }

  const offer = getOfferByCode(normalizedCode);

  if (!offer) {
    return {
      valid: false,
      message: 'Invalid coupon code. Please check and try again.',
    };
  }

  if (new Date(offer.expiresAt).getTime() < Date.now()) {
    return {
      valid: false,
      message: 'This coupon has expired.',
    };
  }

  if (subtotal < offer.minOrder) {
    return {
      valid: false,
      message: `Add items worth ₹${offer.minOrder - subtotal} more to use this coupon.`,
    };
  }

  return {
    valid: true,
    message: 'Coupon applied successfully!',
    offer,
  };
}

export function calculateCouponDiscount(offer, subtotal) {
  if (!offer || subtotal <= 0) return 0;

  if (offer.type === 'freeDelivery') {
    return 0;
  }

  if (offer.type === 'percentage') {
    return Math.min(
      (subtotal * offer.discountValue) / 100,
      offer.maxDiscount
    );
  }

  return 0;
}

export function getExpiryLabel(expiresAt) {
  const expiry = new Date(expiresAt);
  const now = new Date();

  if (expiry.getTime() < now.getTime()) {
    return 'Expired';
  }

  return `Valid until ${expiry.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })}`;
}
