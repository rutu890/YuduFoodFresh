
import React, { useMemo, useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  StatusBar,
  useWindowDimensions,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Clipboard from 'expo-clipboard';

import { colors } from '../constants/colors';
import BottomTabBar from '../components/BottomTabBar';

// --------------------------------------------------
// FOOD IMAGES
// --------------------------------------------------

const foodImages = {
  biryani:
    'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=700',

  pizza:
    'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=700',

  burger:
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=700',

  dosa:
    'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=700',

  curry:
    'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=700',
};

// --------------------------------------------------
// OFFER DATA
// --------------------------------------------------

const tabs = ['All', 'Gourmet', 'Store', 'Coupons'];

const foodDeals = [
  {
    id: 'deal_1',
    name: 'Chicken Biryani',
    restaurant: 'MR Golden',
    category: 'Gourmet',
    image: foodImages.biryani,
    originalPrice: 170,
    dealPrice: 149,
    rating: '4.3',
    discount: '12% OFF',
  },
  {
    id: 'deal_2',
    name: 'Classic Pizza',
    restaurant: 'Pizza Corner',
    category: 'Gourmet',
    image: foodImages.pizza,
    originalPrice: 249,
    dealPrice: 199,
    rating: '4.5',
    discount: '20% OFF',
  },
  {
    id: 'deal_3',
    name: 'Chicken Burger',
    restaurant: 'Burger House',
    category: 'Gourmet',
    image: foodImages.burger,
    originalPrice: 149,
    dealPrice: 119,
    rating: '4.4',
    discount: 'SAVE ₹30',
  },
  {
    id: 'deal_4',
    name: 'Masala Dosa',
    restaurant: 'South Kitchen',
    category: 'Gourmet',
    image: foodImages.dosa,
    originalPrice: 99,
    dealPrice: 79,
    rating: '4.2',
    discount: '20% OFF',
  },
  {
    id: 'deal_5',
    name: 'Special Chicken Curry',
    restaurant: 'Spice Garden',
    category: 'Gourmet',
    image: foodImages.curry,
    originalPrice: 220,
    dealPrice: 179,
    rating: '4.6',
    discount: 'SAVE ₹41',
  },

];

const restaurantOffers = [
  {
    id: 'restaurant_1',
    restaurant: 'Spice Garden',
    title: 'Restaurant Special',
    description: 'Flat 20% OFF on your entire order',
    offer: '20% OFF',
    minimumOrder: 299,
    maximumDiscount: 100,
    category: 'Store',
    image: foodImages.biryani,
    validUntil: '31 Dec 2026',
    type: 'Restaurant-wide',
    gradient: [colors.teal, colors.tealDeep],
  },
  {
    id: 'restaurant_2',
    restaurant: 'Pizza Corner',
    title: 'Family Combo Deal',
    description: 'Special prices on selected family combos',
    offer: 'COMBO DEAL',
    minimumOrder: 399,
    maximumDiscount: 150,
    category: 'Store',
    image: foodImages.pizza,
    validUntil: '15 Dec 2026',
    type: 'Combo offer',
    gradient: [colors.orange, colors.orangeDeep],
  },
  {
    id: 'restaurant_3',
    restaurant: 'Burger House',
    title: 'Free Delivery',
    description: 'Free delivery on orders above ₹249',
    offer: 'FREE DELIVERY',
    minimumOrder: 249,
    maximumDiscount: 30,
    category: 'Store',
    image: foodImages.burger,
    validUntil: '20 Dec 2026',
    type: 'Delivery promotion',
    gradient: [colors.blue, colors.blueDeep],
  },
];

const brandDeals = [
  {
    id: 'brand_1',
    name: 'Pizza Specials',
    description: 'Selected pizzas at special prices',
    image: foodImages.pizza,
    offer: 'UP TO 30% OFF',
  },
  {
    id: 'brand_2',
    name: 'Burger Festival',
    description: 'Combo meals from ₹149',
    image: foodImages.burger,
    offer: 'SAVE ₹80',
  },
  {
    id: 'brand_3',
    name: 'Biryani Treats',
    description: 'Delicious meals from ₹129',
    image: foodImages.biryani,
    offer: 'FLAT ₹50 OFF',
  },
];

const trendingDeals = [
  {
    id: 'trend_1',
    name: 'Pizza specials',
    restaurant: 'Pizza Corner',
    image: foodImages.pizza,
    discount: '70% OFF',
    price: 'UPTO ₹140',
    rating: '4.0',
  },
  {
    id: 'trend_2',
    name: 'Burger combos',
    restaurant: 'Burger House',
    image: foodImages.burger,
    discount: 'ITEMS AT ₹99',
    price: 'LIMITED DEAL',
    rating: '4.5',
  },
  {
    id: 'trend_3',
    name: 'Biryani deals',
    restaurant: 'MR Golden',
    image: foodImages.biryani,
    discount: 'ITEMS AT ₹149',
    price: 'SPECIAL PRICE',
    rating: '4.4',
  },
  {
    id: 'trend_4',
    name: 'South Indian',
    restaurant: 'South Kitchen',
    image: foodImages.dosa,
    discount: '20% OFF',
    price: 'SAVE MORE',
    rating: '4.2',
  },
];

const couponOffers = [
  {
    id: 'coupon_1',
    code: 'WELCOME50',
    title: 'FLAT 50% OFF',
    description: 'On your first eligible order',
    minimum: 199,
    discount: '50%',
    maximum: 100,
    expiry: '31 Dec 2026',
    expiryDate: '2026-12-31T23:59:59',
    gradient: [colors.orange, colors.orangeDeep],
  },
  {
    id: 'coupon_2',
    code: 'YUDU20',
    title: '20% OFF',
    description: 'On selected restaurant orders',
    minimum: 299,
    discount: '20%',
    maximum: 150,
    expiry: '15 Dec 2026',
    expiryDate: '2026-12-15T23:59:59',
    gradient: [colors.teal, colors.tealDeep],
  },
  {
    id: 'coupon_3',
    code: 'FREEDEL',
    title: 'FREE DELIVERY',
    description: 'On eligible orders above ₹299',
    minimum: 299,
    discount: 'Delivery fee waived',
    maximum: 25,
    expiry: '5 Dec 2026',
    expiryDate: '2026-12-05T23:59:59',
    gradient: [colors.blue, colors.blueDeep],
  },
];

// --------------------------------------------------
// REUSABLE SECTION HEADER
// --------------------------------------------------

function SectionHeader({ title, action, onPress }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>

      {action ? (
        <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
          <Text style={styles.sectionAction}>{action} ›</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

// --------------------------------------------------
// FOOD DEAL CARD
// --------------------------------------------------

function FoodDealCard({ item, cardWidth, onPress }) {
  const scale = useRef(new Animated.Value(1)).current;

  return (
    <Animated.View
      style={{
        width: cardWidth,
        marginRight: 11,
        transform: [{ scale }],
      }}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onPress}
        onPressIn={() =>
          Animated.spring(scale, {
            toValue: 0.97,
            useNativeDriver: true,
          }).start()
        }
        onPressOut={() =>
          Animated.spring(scale, {
            toValue: 1,
            useNativeDriver: true,
          }).start()
        }
        style={styles.foodCard}
      >
        <View style={styles.foodImageWrapper}>
          <Image
            source={{ uri: item.image }}
            style={styles.foodImage}
            resizeMode="cover"
          />

          <View style={styles.discountBadge}>
            <Text style={styles.discountBadgeText}>{item.discount}</Text>
          </View>

          <View style={styles.addButton}>
            <Ionicons name="add" size={20} color={colors.white} />
          </View>
        </View>

        <Text numberOfLines={1} style={styles.foodName}>
          {item.name}
        </Text>

        <Text numberOfLines={1} style={styles.restaurantName}>
          {item.restaurant}
        </Text>

        <View style={styles.priceRow}>
          <Text style={styles.originalPrice}>₹{item.originalPrice}</Text>
          <Text style={styles.currentPrice}>₹{item.dealPrice}</Text>
        </View>

        <View style={styles.ratingRow}>
          <Ionicons name="star" size={11} color={colors.teal} />
          <Text style={styles.ratingText}>{item.rating}</Text>
          <Text style={styles.ratingCaption}> · Special deal</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

// --------------------------------------------------
// BRAND DEAL CARD
// --------------------------------------------------

function BrandDealCard({ item, cardWidth, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.brandCard, { width: cardWidth }]}
      activeOpacity={0.88}
      onPress={onPress}
    >
      <View style={styles.brandImageWrapper}>
        <Image
          source={{ uri: item.image }}
          style={styles.brandImage}
          resizeMode="cover"
        />

        <View style={styles.brandLogo}>
          <Ionicons name="sparkles" size={18} color={colors.orangeDeep} />
        </View>
      </View>

      <View style={styles.brandInfo}>
        <Text numberOfLines={1} style={styles.brandName}>
          {item.name}
        </Text>

        <Text numberOfLines={2} style={styles.brandDescription}>
          {item.description}
        </Text>

        <View style={styles.brandOfferBadge}>
          <Text style={styles.brandOfferText}>{item.offer}</Text>
        </View>

        <View style={styles.claimRow}>
          <Text style={styles.claimText}>Claim now</Text>
          <Ionicons
            name="arrow-forward"
            size={14}
            color={colors.orangeDeep}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}


function RestaurantOfferCard({ item, onPress }) {
  const scale = useRef(new Animated.Value(1)).current;

  return (
    <Animated.View
      style={{
        transform: [{ scale }],
        marginRight: 12,
        width: 245,
      }}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onPress}
        onPressIn={() =>
          Animated.spring(scale, {
            toValue: 0.97,
            useNativeDriver: true,
          }).start()
        }
        onPressOut={() =>
          Animated.spring(scale, {
            toValue: 1,
            useNativeDriver: true,
          }).start()
        }
        style={styles.restaurantOfferCard}
      >
        <Image
          source={{ uri: item.image }}
          style={styles.restaurantOfferImage}
        />

        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.82)']}
          style={styles.restaurantImageOverlay}
        >
          <Text style={styles.restaurantOfferTag}>
            RESTAURANT INITIATIVE
          </Text>
          <Text style={styles.restaurantOfferValue}>
            {item.offer}
          </Text>
        </LinearGradient>

        <View style={styles.restaurantOfferContent}>
          <Text style={styles.restaurantOfferTitle}>
            {item.title}
          </Text>

          <Text style={styles.restaurantOfferDescription}>
            {item.description}
          </Text>

          <View style={styles.restaurantOfferMeta}>
            <Text style={styles.restaurantOfferMinimum}>
              Min. order ₹{item.minimumOrder}
            </Text>

            <Text style={styles.restaurantOfferExpiry}>
              Till {item.validUntil}
            </Text>
          </View>

          <View style={styles.restaurantOfferFooter}>
            <Text style={styles.restaurantOfferName}>
              {item.restaurant}
            </Text>

            <Ionicons
              name="arrow-forward-circle"
              size={22}
              color={colors.orange}
            />
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}


// --------------------------------------------------
// TRENDING DEAL CARD
// --------------------------------------------------

function TrendingCard({ item, cardWidth, favorite, onFavorite, onPress }) {
  return (
    <View style={{ width: cardWidth, marginRight: 10 }}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onPress}
        style={styles.trendingImageWrapper}
      >
        <Image
          source={{ uri: item.image }}
          style={styles.trendingImage}
          resizeMode="cover"
        />

        <LinearGradient
          colors={['transparent', 'rgba(20,20,20,0.88)']}
          style={styles.trendingOverlay}
        >
          <Text style={styles.trendingDiscount}>{item.discount}</Text>
          <Text style={styles.trendingPrice}>{item.price}</Text>
        </LinearGradient>

        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={onFavorite}
          activeOpacity={0.75}
        >
          <Ionicons
            name={favorite ? 'heart' : 'heart-outline'}
            size={18}
            color={favorite ? colors.watermelon : colors.white}
          />
        </TouchableOpacity>
      </TouchableOpacity>

      <Text numberOfLines={1} style={styles.trendingName}>
        {item.name}
      </Text>

      <View style={styles.trendingRating}>
        <Ionicons name="star" size={12} color={colors.teal} />
        <Text style={styles.trendingRatingText}>
          {item.rating} · {item.restaurant}
        </Text>
      </View>
    </View>
  );
}

// --------------------------------------------------
// COUPON CARD
// --------------------------------------------------

function CouponCard({ item, onCopy, onUse }) {
  const expired = new Date(item.expiryDate).getTime() < Date.now();

  return (
    <LinearGradient
      colors={item.gradient}
      style={[styles.couponCard, expired && styles.expiredCard]}
    >
      <View style={styles.couponCircleOne} />
      <View style={styles.couponCircleTwo} />

      <View style={styles.couponTop}>
        <View style={styles.specialBadge}>
          <Ionicons name="pricetag" size={11} color={colors.orangeDeep} />
          <Text style={styles.specialBadgeText}>SPECIAL OFFER</Text>
        </View>

        <Text style={styles.expiryText}>
          {expired ? 'Expired' : `Valid until ${item.expiry}`}
        </Text>
      </View>

      <Text style={styles.couponTitle}>{item.title}</Text>
      <Text style={styles.couponDescription}>{item.description}</Text>

      <View style={styles.minimumBadge}>
        <Text style={styles.minimumText}>
          Minimum order ₹{item.minimum}
        </Text>
      </View>

      <View style={styles.couponBottom}>
        <TouchableOpacity
          style={styles.couponCodeButton}
          onPress={() => onCopy(item.code)}
          activeOpacity={0.8}
        >
          <Text style={styles.couponCodeText}>{item.code}</Text>
          <Ionicons name="copy-outline" size={16} color={colors.white} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.useOfferButton, expired && styles.expiredButton]}
          onPress={() => onUse(item)}
          disabled={expired}
          activeOpacity={0.8}
        >
          <Text style={styles.useOfferText}>
            {expired ? 'Expired' : 'Use offer'}
          </Text>
          {!expired && (
            <Ionicons
              name="arrow-forward"
              size={14}
              color={colors.orangeDeep}
            />
          )}
        </TouchableOpacity>
      </View>

      <Text style={styles.discountDetails}>
        {item.discount} savings · Maximum benefit ₹{item.maximum}
      </Text>
    </LinearGradient>
  );
}

// --------------------------------------------------
// MAIN OFFERS SCREEN
// --------------------------------------------------

export default function OffersScreen({ navigation }) {
  const { width } = useWindowDimensions();

  const [activeTab, setActiveTab] = useState('All');
  const [favorites, setFavorites] = useState([]);
  const [bannerIndex, setBannerIndex] = useState(0);
  const [toast, setToast] = useState('');

  const toastOpacity = useRef(new Animated.Value(0)).current;
  const toastTimer = useRef(null);

  // Responsive widths:
  // On a 378px phone, food cards are approximately 145px.
  // On wider screens, the cards grow but remain controlled.



  const foodCardWidth = Math.min(
    170,
    Math.max(135, width * 0.39)
  );

  const brandCardWidth = Math.min(
    190,
    Math.max(150, width * 0.43)
  );

  const trendingCardWidth = Math.min(
    135,
    Math.max(100, width * 0.28)
  );

  // GOURMET: Individual food and meal deals
  const filteredFoodDeals = useMemo(() => {
    return activeTab === 'All' || activeTab === 'Gourmet'
      ? foodDeals
      : [];
  }, [activeTab]);

  // STORE: Restaurant-initiated promotions
  const filteredRestaurantOffers = useMemo(() => {
    return activeTab === 'All' || activeTab === 'Store'
      ? restaurantOffers
      : [];
  }, [activeTab]);

  // Gourmet brand promotions
  const filteredBrandDeals = useMemo(() => {
    return activeTab === 'All' || activeTab === 'Gourmet'
      ? brandDeals
      : [];
  }, [activeTab]);

  // Gourmet trending food deals
  const filteredTrending = useMemo(() => {
    return activeTab === 'All' || activeTab === 'Gourmet'
      ? trendingDeals
      : [];
  }, [activeTab]);

  // Coupons appear in All and Coupons
  const showCoupons =
    activeTab === 'All' || activeTab === 'Coupons';

  useEffect(() => {
    return () => {
      if (toastTimer.current) {
        clearTimeout(toastTimer.current);
      }
    };
  }, []);

  const showToast = (message) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);

    setToast(message);
    toastOpacity.setValue(0);

    Animated.timing(toastOpacity, {
      toValue: 1,
      duration: 180,
      useNativeDriver: true,
    }).start();

    toastTimer.current = setTimeout(() => {
      Animated.timing(toastOpacity, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }).start();
    }, 1800);
  };

  const handleCopy = async (code) => {
    try {
      await Clipboard.setStringAsync(code);
      showToast(`${code} copied successfully`);
    } catch (error) {
      showToast('Unable to copy coupon code');
    }
  };

  const handleUseOffer = (offer) => {
    if (new Date(offer.expiryDate).getTime() < Date.now()) {
      showToast('This coupon has expired');
      return;
    }

    navigation.navigate('Cart', {
      couponCode: offer.code,
    });
  };

  const toggleFavorite = (id) => {
    setFavorites((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id]
    );
  };

  const banners = [
    {
      eyebrow: 'WEEKEND SPECIAL',
      title: 'Good food. Great savings.',
      subtitle: 'Explore delicious deals around you.',
      colors: [colors.orange, colors.orangeDeep],
      icon: 'fast-food-outline',
    },
    {
      eyebrow: 'STORE SPECIAL',
      title: 'Little treats. Big savings.',
      subtitle: 'Discover your everyday favourites.',
      colors: [colors.teal, colors.tealDeep],
      icon: 'bag-handle-outline',
    },
  ];

  const activeBanner = banners[bannerIndex];

  const openRestaurants = () => {
    navigation.navigate('Restaurants');
  };

  return (
    <View style={styles.screen}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={colors.white}
      />

      {/* HEADER */}

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.75}
        >
          <Ionicons name="arrow-back" size={21} color={colors.ink} />
        </TouchableOpacity>

        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Offers & Coupons</Text>
          <Text style={styles.headerSubtitle}>
            Delicious deals, just for you
          </Text>
        </View>

        <View style={styles.giftIcon}>
          <Ionicons name="gift-outline" size={21} color={colors.orange} />
        </View>
      </View>


      <View style={styles.tabsContainer}>
        {tabs.map((tab) => {
          const selected = activeTab === tab;

          return (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              activeOpacity={0.8}
              style={[styles.tab, selected && styles.activeTab]}
            >
              <Ionicons
                name={
                  tab === 'All'
                    ? 'grid-outline'
                    : tab === 'Gourmet'
                      ? 'restaurant-outline'
                      : tab === 'Store'
                        ? 'storefront-outline'
                        : 'ticket-outline'
                }
                size={13}
                color={selected ? colors.orange : colors.muted}
              />

              <Text style={[styles.tabText, selected && styles.activeTabText]}>
                {tab.toUpperCase()}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* FEATURED GRAPHIC BANNER */}

        <TouchableOpacity
          activeOpacity={0.95}
          onPress={() =>
            setBannerIndex((previous) => (previous + 1) % banners.length)
          }
        >
          <LinearGradient
            colors={activeBanner.colors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroBanner}
          >
            <View style={styles.heroText}>
              <Text style={styles.heroEyebrow}>
                {activeBanner.eyebrow}
              </Text>

              <Text style={styles.heroTitle}>
                {activeBanner.title}
              </Text>

              <Text style={styles.heroSubtitle}>
                {activeBanner.subtitle}
              </Text>

              <View style={styles.heroButton}>
                <Text style={styles.heroButtonText}>Explore deals</Text>
                <Ionicons
                  name="arrow-forward"
                  size={13}
                  color={colors.orangeDeep}
                />
              </View>
            </View>

            <View style={styles.heroArtwork}>
              <Ionicons
                name={activeBanner.icon}
                size={52}
                color={colors.white}
              />
              <Ionicons
                name="sparkles"
                size={22}
                color={colors.mango}
                style={styles.heroSparkle}
              />
              <View style={styles.heroDecorCircle} />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.bannerIndicators}>
          {banners.map((banner, index) => (
            <TouchableOpacity
              key={banner.eyebrow}
              onPress={() => setBannerIndex(index)}
              style={[
                styles.bannerIndicator,
                index === bannerIndex && styles.bannerIndicatorActive,
              ]}
            />
          ))}
        </View>

        {/* FOOD DEALS */}


        {/* GOURMET FOOD DEALS */}

        {(activeTab === 'All' || activeTab === 'Gourmet') && (
          <>
            <SectionHeader
              title="Meals at ₹99 & more"
              action="View all"
              onPress={openRestaurants}
            />

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
            >
              {filteredFoodDeals.map((item) => (
                <FoodDealCard
                  key={item.id}
                  item={item}
                  cardWidth={foodCardWidth}
                  onPress={openRestaurants}
                />
              ))}
            </ScrollView>
          </>
        )}

        {/* PROMOTIONAL STRIP */}
        {activeTab === 'All' && (
          <>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={openRestaurants}
              style={styles.promoWrapper}
            >
              <LinearGradient
                colors={[colors.blue, colors.blueDeep]}
                style={styles.promoBanner}
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.promoEyebrow}>YUDU FOOD FEST</Text>
                  <Text style={styles.promoTitle}>
                    More flavours. More savings.
                  </Text>
                  <Text style={styles.promoSubtitle}>
                    Find your next favourite meal.
                  </Text>
                </View>

                <View style={styles.promoIcon}>
                  <Ionicons
                    name="fast-food"
                    size={39}
                    color={colors.white}
                  />
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </>
        )}

        {activeTab === 'All' || activeTab === 'Store' ? (
          <>
            <SectionHeader
              title="Restaurant specials"
              action="Explore"
              onPress={openRestaurants}
            />

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
            >
              {filteredRestaurantOffers.map((item) => (
                <RestaurantOfferCard
                  key={item.id}
                  item={item}
                  onPress={openRestaurants}
                />
              ))}
            </ScrollView>
          </>
        ) : null}

        {/* BRAND DEALS */}

        {/* BRAND DEALS */}

        {(activeTab === 'All' || activeTab === 'Gourmet') && (
          <>
            <SectionHeader
              title="Brands with top deals"
              action="See all"
              onPress={openRestaurants}
            />

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
            >
              {filteredBrandDeals.map((item) => (
                <BrandDealCard
                  key={item.id}
                  item={item}
                  cardWidth={brandCardWidth}
                  onPress={openRestaurants}
                />
              ))}
            </ScrollView>
          </>
        )}

        {/* TRENDING DEALS */}

        {/* TRENDING DEALS */}

        {(activeTab === 'All' || activeTab === 'Gourmet') && (
          <>
            <SectionHeader
              title="Try new deals"
              action="See all"
              onPress={openRestaurants}
            />

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
            >
              {filteredTrending.map((item) => (
                <TrendingCard
                  key={item.id}
                  item={item}
                  cardWidth={trendingCardWidth}
                  favorite={favorites.includes(item.id)}
                  onFavorite={() => toggleFavorite(item.id)}
                  onPress={openRestaurants}
                />
              ))}
            </ScrollView>
          </>
        )}



        {/* COUPONS */}

        {showCoupons && (
          <>
            <SectionHeader
              title="Coupons & extra savings"
            />

            {couponOffers.map((offer) => (
              <CouponCard
                key={offer.id}
                item={offer}
                onCopy={handleCopy}
                onUse={handleUseOffer}
              />
            ))}
          </>
        )}

        {showCoupons && (
          <View style={styles.bottomTip}>
            <Ionicons
              name="information-circle-outline"
              size={19}
              color={colors.teal}
            />

            <Text style={styles.bottomTipText}>
              Offers may have minimum order values, usage limits and
              restaurant-specific eligibility. Check the coupon details
              before applying.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* COPY SUCCESS TOAST */}

      {!!toast && (
        <Animated.View
          style={[
            styles.toast,
            {
              opacity: toastOpacity,
              transform: [
                {
                  translateY: toastOpacity.interpolate({
                    inputRange: [0, 1],
                    outputRange: [10, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <Ionicons
            name="checkmark-circle"
            size={19}
            color={colors.white}
          />
          <Text style={styles.toastText}>{toast}</Text>
        </Animated.View>
      )}

      <BottomTabBar navigation={navigation} active="Offers" />
    </View>
  );
}

// --------------------------------------------------
// STYLES
// --------------------------------------------------

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.white,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 45,
    paddingBottom: 13,
    backgroundColor: colors.white,
    gap: 11,
  },

  backButton: {
    width: 38,
    height: 38,
    borderRadius: 13,
    backgroundColor: colors.vanilla,
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.ink,
  },

  headerSubtitle: {
    fontSize: 10,
    color: colors.muted,
    marginTop: 3,
  },

  giftIcon: {
    width: 38,
    height: 38,
    borderRadius: 20,
    backgroundColor: colors.vanilla,
    alignItems: 'center',
    justifyContent: 'center',
  },

  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 10,
    justifyContent: 'space-around',
  },

  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 13,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },

  activeTab: {
    borderBottomColor: colors.orange,
  },

  tabText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.muted,
  },

  activeTabText: {
    color: colors.orangeDeep,
  },

  scrollContent: {
    paddingHorizontal: 15,
    paddingTop: 13,
    paddingBottom: 115,
  },

  heroBanner: {
    minHeight: 154,
    borderRadius: 19,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 17,
  },

  heroText: {
    flex: 1,
    zIndex: 2,
  },

  heroEyebrow: {
    fontSize: 9,
    fontWeight: '900',
    color: colors.mango,
    letterSpacing: 1.2,
  },

  heroTitle: {
    fontSize: 21,
    lineHeight: 26,
    fontWeight: '900',
    color: colors.white,
    marginTop: 7,
  },

  heroSubtitle: {
    fontSize: 10,
    color: colors.white,
    marginTop: 5,
  },

  heroButton: {
    alignSelf: 'flex-start',
    backgroundColor: colors.white,
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 11,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },

  heroButtonText: {
    fontSize: 9,
    fontWeight: '900',
    color: colors.orangeDeep,
  },

  heroArtwork: {
    width: 88,
    height: 88,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },

  heroSparkle: {
    position: 'absolute',
    top: 3,
    right: 4,
  },

  heroDecorCircle: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    borderRadius: 70,
  },

  bannerIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginVertical: 11,
  },

  bannerIndicator: {
    width: 7,
    height: 7,
    borderRadius: 5,
    backgroundColor: colors.border,
  },

  bannerIndicatorActive: {
    width: 21,
    backgroundColor: colors.orange,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 17,
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: colors.ink,
  },

  sectionAction: {
    color: colors.orangeDeep,
    fontSize: 11,
    fontWeight: '900',
  },

  horizontalList: {
    paddingBottom: 3,
  },

  foodCard: {
    backgroundColor: colors.white,
    borderRadius: 13,
    padding: 7,
    borderWidth: 1,
    borderColor: colors.border,
  },

  foodImageWrapper: {
    width: '100%',
    height: 112,
    borderRadius: 11,
    overflow: 'hidden',
    backgroundColor: colors.soft,
  },

  foodImage: {
    width: '100%',
    height: '100%',
  },

  discountBadge: {
    position: 'absolute',
    left: 5,
    top: 5,
    paddingHorizontal: 7,
    paddingVertical: 4,
    backgroundColor: colors.orange,
    borderRadius: 6,
  },

  discountBadgeText: {
    color: colors.white,
    fontSize: 8,
    fontWeight: '900',
  },

  addButton: {
    position: 'absolute',
    right: 6,
    bottom: 6,
    width: 27,
    height: 27,
    backgroundColor: colors.teal,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },

  foodName: {
    color: colors.ink,
    fontSize: 11,
    fontWeight: '900',
    marginTop: 8,
  },

  restaurantName: {
    color: colors.muted,
    fontSize: 9,
    marginTop: 3,
  },

  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginTop: 7,
  },

  originalPrice: {
    color: colors.muted,
    fontSize: 9,
    textDecorationLine: 'line-through',
  },

  currentPrice: {
    color: colors.orangeDeep,
    fontSize: 12,
    fontWeight: '900',
  },

  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },

  ratingText: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.teal,
    marginLeft: 3,
  },

  ratingCaption: {
    fontSize: 8,
    color: colors.muted,
  },

  promoWrapper: {
    marginTop: 19,
  },

  promoBanner: {
    borderRadius: 14,
    minHeight: 90,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },

  promoEyebrow: {
    color: colors.mango,
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1,
  },

  promoTitle: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '900',
    marginTop: 5,
  },

  promoSubtitle: {
    color: colors.white,
    fontSize: 9,
    marginTop: 4,
  },

  promoIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  brandCard: {
    backgroundColor: colors.white,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 7,
    marginRight: 11,
    overflow: 'hidden',
  },

  brandImageWrapper: {
    height: 112,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.soft,
  },

  brandImage: {
    width: '100%',
    height: '100%',
  },

  brandLogo: {
    position: 'absolute',
    bottom: -1,
    alignSelf: 'center',
    width: 34,
    height: 34,
    borderRadius: 18,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.cream,
  },

  brandInfo: {
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingTop: 13,
  },

  brandName: {
    fontSize: 11,
    color: colors.ink,
    fontWeight: '900',
    textAlign: 'center',
  },

  brandDescription: {
    fontSize: 9,
    color: colors.muted,
    marginTop: 4,
    textAlign: 'center',
    minHeight: 25,
  },

  brandOfferBadge: {
    backgroundColor: colors.vanilla,
    borderRadius: 7,
    paddingHorizontal: 7,
    paddingVertical: 5,
    marginTop: 5,
  },

  brandOfferText: {
    color: colors.orangeDeep,
    fontSize: 8,
    fontWeight: '900',
  },

  claimRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    borderTopWidth: 1,
    borderColor: colors.border,
    paddingTop: 9,
    marginTop: 9,
    width: '100%',
  },

  claimText: {
    color: colors.orangeDeep,
    fontSize: 10,
    fontWeight: '900',
  },

  trendingImageWrapper: {
    height: 118,
    width: '100%',
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: colors.soft,
  },

  trendingImage: {
    width: '100%',
    height: '100%',
  },

  trendingOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 8,
    paddingTop: 25,
  },

  trendingDiscount: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '900',
  },

  trendingPrice: {
    color: colors.white,
    fontSize: 8,
    marginTop: 3,
  },

  favoriteButton: {
    position: 'absolute',
    right: 6,
    top: 6,
    width: 27,
    height: 27,
    borderRadius: 15,
    backgroundColor: 'rgba(30,30,30,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  trendingName: {
    color: colors.ink,
    fontSize: 10,
    fontWeight: '900',
    marginTop: 7,
  },

  trendingRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },

  trendingRatingText: {
    color: colors.muted,
    fontSize: 8,
    marginLeft: 3,
  },

  couponCard: {
    minHeight: 184,
    borderRadius: 18,
    padding: 16,
    marginBottom: 13,
    overflow: 'hidden',
  },

  expiredCard: {
    opacity: 0.55,
  },

  couponCircleOne: {
    position: 'absolute',
    width: 155,
    height: 155,
    borderRadius: 80,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.3)',
    right: -45,
    top: -35,
  },

  couponCircleTwo: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
    right: 8,
    bottom: -55,
  },

  couponTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  specialBadge: {
    backgroundColor: colors.white,
    borderRadius: 15,
    paddingHorizontal: 9,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },

  specialBadgeText: {
    color: colors.orangeDeep,
    fontSize: 8,
    fontWeight: '900',
  },

  expiryText: {
    color: colors.white,
    fontSize: 8,
    fontWeight: '800',
  },

  couponTitle: {
    color: colors.white,
    fontSize: 23,
    fontWeight: '900',
    marginTop: 13,
  },

  couponDescription: {
    color: colors.white,
    fontSize: 10,
    marginTop: 3,
  },

  minimumBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8,
    paddingHorizontal: 9,
    paddingVertical: 5,
    marginTop: 9,
  },

  minimumText: {
    color: colors.white,
    fontSize: 9,
    fontWeight: '800',
  },

  couponBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 13,
  },

  couponCodeButton: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.7)',
    borderStyle: 'dashed',
    borderRadius: 9,
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },

  couponCodeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.7,
  },

  useOfferButton: {
    backgroundColor: colors.white,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 9,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },

  expiredButton: {
    opacity: 0.7,
  },

  useOfferText: {
    color: colors.orangeDeep,
    fontSize: 9,
    fontWeight: '900',
  },

  discountDetails: {
    color: colors.white,
    fontSize: 8,
    marginTop: 9,
  },

  bottomTip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    backgroundColor: colors.vanilla,
    borderRadius: 13,
    padding: 12,
    marginTop: 4,
  },

  bottomTipText: {
    flex: 1,
    color: colors.muted,
    fontSize: 9,
    lineHeight: 15,
  },

  emptyText: {
    color: colors.muted,
    fontSize: 11,
    paddingVertical: 20,
    textAlign: 'center',
  },

  toast: {
    position: 'absolute',
    bottom: 91,
    alignSelf: 'center',
    backgroundColor: colors.tealDeep,
    paddingHorizontal: 15,
    paddingVertical: 11,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    zIndex: 20,
    elevation: 8,
  },

  toastText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '800',
  },
  restaurantOfferCard: {
    backgroundColor: colors.white,
    borderRadius: 17,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },

  restaurantOfferImage: {
    width: '100%',
    height: 135,
    backgroundColor: colors.soft,
  },

  restaurantImageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 135,
    justifyContent: 'flex-end',
    padding: 12,
  },

  restaurantOfferTag: {
    color: colors.mango,
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.8,
  },

  restaurantOfferValue: {
    color: colors.white,
    fontSize: 20,
    fontWeight: '900',
    marginTop: 4,
  },

  restaurantOfferContent: {
    padding: 12,
  },

  restaurantOfferTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: colors.ink,
  },

  restaurantOfferDescription: {
    fontSize: 10,
    lineHeight: 15,
    color: colors.muted,
    marginTop: 5,
  },

  restaurantOfferMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },

  restaurantOfferMinimum: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.teal,
  },

  restaurantOfferExpiry: {
    fontSize: 9,
    color: colors.muted,
  },

  restaurantOfferFooter: {
    borderTopWidth: 1,
    borderColor: colors.border,
    marginTop: 10,
    paddingTop: 9,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  restaurantOfferName: {
    fontSize: 10,
    fontWeight: '900',
    color: colors.ink,
  },
});
