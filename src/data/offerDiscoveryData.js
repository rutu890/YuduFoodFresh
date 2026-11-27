
export const offerTabs = ['All', 'Store', 'Offers', 'Gourmet'];

export const foodDeals = [
  {
    id: 'food_deal_1',
    name: 'Egg Chicken Roll',
    category: 'Store',
    originalPrice: 99,
    dealPrice: 79,
    discountLabel: '20% OFF',
    icon: 'fast-food-outline',
    restaurant: "Delhi's Rolls",
  },
  {
    id: 'food_deal_2',
    name: 'Chicken Biryani',
    category: 'Gourmet',
    originalPrice: 170,
    dealPrice: 149,
    discountLabel: 'SPECIAL PRICE',
    icon: 'restaurant-outline',
    restaurant: 'MR Golden',
  },
  {
    id: 'food_deal_3',
    name: 'Classic Vada Pav',
    category: 'Store',
    originalPrice: 32,
    dealPrice: 25,
    discountLabel: 'SAVE ₹7',
    icon: 'fast-food-outline',
    restaurant: 'Goli Vada Pav',
  },
  {
    id: 'food_deal_4',
    name: 'Margherita Pizza',
    category: 'Offers',
    originalPrice: 249,
    dealPrice: 199,
    discountLabel: '20% OFF',
    icon: 'pizza-outline',
    restaurant: 'Pizza Corner',
  },
];

export const brandDeals = [
  {
    id: 'brand_1',
    name: 'Pizza specials',
    description: 'Menu starting at ₹99',
    discount: 'UP TO 30% OFF',
    category: 'Gourmet',
    icon: 'pizza-outline',
  },
  {
    id: 'brand_2',
    name: 'Burger festival',
    description: 'Combo meals from ₹149',
    discount: 'SAVE ₹80',
    category: 'Offers',
    icon: 'fast-food-outline',
  },
  {
    id: 'brand_3',
    name: 'Biryani treats',
    description: 'Special meals from ₹129',
    discount: 'FLAT ₹50 OFF',
    category: 'Gourmet',
    icon: 'restaurant-outline',
  },
];

export const promotionalBanners = [
  {
    id: 'banner_1',
    eyebrow: 'WEEKEND SPECIAL',
    title: 'YUDU Food Fest',
    subtitle: 'Discover delicious deals around you.',
    background: 'orange',
  },
  {
    id: 'banner_2',
    eyebrow: 'MORE SAVINGS',
    title: 'Good food, great prices',
    subtitle: 'Explore handpicked meals and combos.',
    background: 'teal',
  },
];

export const couponOffers = [
  {
    id: 'coupon_1',
    code: 'WELCOME50',
    title: 'Flat 50% OFF',
    description: 'On your first eligible order',
    minOrder: 199,
    discountType: 'percentage',
    discountValue: 50,
    maxDiscount: 100,
    expiresAt: '2026-12-31T23:59:59',
  },
  {
    id: 'coupon_2',
    code: 'YUDU20',
    title: '20% OFF',
    description: 'On selected restaurant orders',
    minOrder: 299,
    discountType: 'percentage',
    discountValue: 20,
    maxDiscount: 150,
    expiresAt: '2026-12-15T23:59:59',
  },
  {
    id: 'coupon_3',
    code: 'FREEDEL',
    title: 'Free Delivery',
    description: 'On orders above ₹299',
    minOrder: 299,
    discountType: 'freeDelivery',
    discountValue: 0,
    maxDiscount: 25,
    expiresAt: '2026-12-05T23:59:59',
  },
];
