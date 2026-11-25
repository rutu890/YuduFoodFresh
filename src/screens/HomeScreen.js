
import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Animated,
  FlatList,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import FoodImage from '../components/FoodImage';
import FilterModal from '../components/FilterModal';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../constants/colors';
import BottomTabBar from '../components/BottomTabBar';
import { useFocusEffect } from '@react-navigation/native';
import { getActiveAddress } from '../utils/addressStorage';


const foodImages = {
  biryani:
    'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=700',

  pizza: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=700',
  burger: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=700',
  dosa: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=700',
  curry: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=700',
};

const categories = [
  { name: 'Biryani', image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=700' },
  { name: 'Pizza', image: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=300' },
  { name: 'Burgers', image: foodImages.burger },
  { name: 'Dosa', image: foodImages.dosa },
  { name: 'Curries', image: foodImages.curry },
  { name: 'Desserts', image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=300' },
];

const restaurants = [
  {
    id: '1',
    name: 'Nizam Dum House',
    cuisine: 'Biryani · Mughlai',
    price: '₹350 for two',
    rating: '4.5',
    time: '30–35 min',
    offer: '50% OFF',
    image: foodImages.biryani,
  },
  {
    id: '2',
    name: 'Fire & Crust',
    cuisine: 'Pizza · Italian',
    price: '₹450 for two',
    rating: '4.4',
    time: '25–30 min',
    offer: '20% OFF',
    image: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=700',
  },
];

const trending = [
  {
    id: '1',
    name: 'Dum Biryani',
    restaurant: 'Nizam Dum House',
    price: '₹329',
    image: foodImages.biryani,
  },
  {
    id: '2',
    name: 'Masala Dosa',
    restaurant: 'Tiffin Tales',
    price: '₹119',
    image: foodImages.dosa,
  },
];

function SectionHeading({ title, onSeeAll }) {
  return (
    <View style={styles.sectionHeading}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <TouchableOpacity onPress={onSeeAll} activeOpacity={0.7}>
        <Text style={styles.seeAll}>See all</Text>
      </TouchableOpacity>
    </View>
  );
}

function SearchBar({ placeholder, onFilterPress }) {
  return (
    <View style={styles.searchBar}>
      <Text style={styles.searchIcon}>⌕</Text>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#9A94AD"
        style={styles.searchInput}
        returnKeyType="search"
      />
      <TouchableOpacity
        style={styles.filterButton}
        onPress={onFilterPress}
        activeOpacity={0.75}
      >
        <Text style={styles.filterIcon}>☷</Text>
      </TouchableOpacity>
    </View>
  );
}

function RestaurantCard({ item, onFavourite }) {
  const [favourite, setFavourite] = useState(false);

  const toggleFavourite = () => {
    setFavourite((previous) => !previous);
    onFavourite(!favourite, item.name);
  };

  return (
    <View style={styles.restaurantCard}>
      <View style={styles.restaurantImageWrap}>
        <FoodImage
          uri={item.image}
          style={styles.restaurantImage}
          contentFit="cover"
        />
        <View style={styles.offerPill}>
          <Text style={styles.offerText}>✦ {item.offer}</Text>
        </View>
        <TouchableOpacity
          style={styles.heartButton}
          onPress={toggleFavourite}
          activeOpacity={0.7}
        >
          <Text style={[styles.heart, favourite && styles.heartActive]}>
            {favourite ? '♥' : '♡'}
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.restaurantName}>{item.name}</Text>
      <Text style={styles.restaurantCuisine}>
        {item.cuisine} · {item.price}
      </Text>
      <View style={styles.restaurantMeta}>
        <Text style={styles.rating}>★ {item.rating}</Text>
        <Text style={styles.metaText}>◷ {item.time}</Text>
      </View>
    </View>
  );
}

function SkeletonCard() {
  const opacity = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.85,
          duration: 650,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.35,
          duration: 650,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [opacity]);

  return (
    <Animated.View style={[styles.skeletonCard, { opacity }]}>
      <View style={styles.skeletonImage} />
      <View style={styles.skeletonLine} />
      <View style={styles.skeletonSmallLine} />
    </Animated.View>
  );
}

export default function HomeScreen({ navigation, route }) {
  const location = route.params?.location;

  const [savedActiveAddress, setSavedActiveAddress] = useState(null);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const loadActiveAddress = async () => {
        const saved = await getActiveAddress();

        if (isActive) {
          setSavedActiveAddress(saved);
        }
      };

      loadActiveAddress();

      return () => {
        isActive = false;
      };
    }, [])
  );

  // Home screen state
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);
  const [filters, setFilters] = useState({});

  // Animations
  const entrance = useRef(new Animated.Value(0)).current;
  const bannerFloat = useRef(new Animated.Value(0)).current;
  const toastOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1100);

    Animated.timing(entrance, {
      toValue: 1,
      duration: 650,
      useNativeDriver: true,
    }).start();

    const float = Animated.loop(
      Animated.sequence([
        Animated.timing(bannerFloat, {
          toValue: -4,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.timing(bannerFloat, {
          toValue: 0,
          duration: 1800,
          useNativeDriver: true,
        }),
      ])
    );
    float.start();

    return () => {
      clearTimeout(timer);
      float.stop();
    };
  }, [entrance, bannerFloat]);

  const showToast = (message) => {
    setToast(message);
    toastOpacity.setValue(0);

    Animated.sequence([
      Animated.timing(toastOpacity, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.delay(1500),
      Animated.timing(toastOpacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleFavourite = (isFavourite, name) => {
    showToast(isFavourite ? `${name} added to favourites` : 'Removed from favourites');
  };

  const address =
    savedActiveAddress?.formattedAddress ||
    [
      savedActiveAddress?.houseNumber,
      savedActiveAddress?.street,
      savedActiveAddress?.area,
      savedActiveAddress?.city,
      savedActiveAddress?.postalCode,
    ]
      .filter(Boolean)
      .join(', ') ||
    location?.formattedAddress ||
    'Add delivery address';

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View
          style={{
            opacity: entrance,
            transform: [{
              translateY: entrance.interpolate({
                inputRange: [0, 1],
                outputRange: [18, 0],
              }),
            }],
          }}
        >
          <View style={styles.topHeader}>
            <TouchableOpacity
              style={styles.locationArea}
              onPress={() => navigation.navigate('ManageAddresses')}
              activeOpacity={0.7}
            >
              <View style={styles.locationIconWrap}>
                <Text style={styles.locationPin}>⌖</Text>
              </View>
              <View style={styles.locationTextWrap}>
                <Text style={styles.deliverTo}>Deliver to</Text>
                <Text numberOfLines={1} style={styles.addressText}>
                  {address}⌄
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.notificationButton}
              activeOpacity={0.75}
              onPress={() => navigation.navigate('Notifications')}
            >
              <Ionicons
                name="notifications-outline"
                size={22}
                color={colors.ink}
              />

              <View style={styles.notificationBadge} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.profileCircle}>
              <Text style={styles.profileText}>YU</Text>
            </TouchableOpacity>
          </View>

          <SearchBar
            placeholder="Search for dishes or restaurants"
            onFilterPress={() => setFilterVisible(true)}
          />
          <FlatList
            horizontal
            data={categories}
            keyExtractor={(item) => item.name}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryList}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.categoryItem}
                activeOpacity={0.75}
                onPress={() => navigation.navigate('Restaurants', {
                  category: item.name,
                })}
              >
                <View style={styles.categoryImageBorder}>
                  <FoodImage
                    uri={item.image}
                    style={styles.categoryImage}
                  />
                </View>
                <Text style={styles.categoryName}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />

          <Animated.View style={{ transform: [{ translateY: bannerFloat }] }}>
            <LinearGradient
              colors={['#E94B18', '#C93B1D']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.promoBanner}
            >
              <View style={styles.promoContent}>
                <Text style={styles.promoTitle}>Flat 50% OFF</Text>
                <Text style={styles.promoDescription}>
                  up to ₹100 on your first order
                </Text>
                <TouchableOpacity
                  style={styles.orderButton}
                  activeOpacity={0.8}
                  onPress={() => navigation.navigate('Offers')}
                >
                  <Text style={styles.orderButtonText}>Order now</Text>
                </TouchableOpacity>
              </View>
              <FoodImage
                uri={foodImages.biryani}
                style={styles.promoImage}
              />
            </LinearGradient>
          </Animated.View>

          <SectionHeading
            title="Popular & recommended"
            onSeeAll={() => navigation.navigate('Restaurants')}
          />

          {loading ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <SkeletonCard />
              <SkeletonCard />
            </ScrollView>
          ) : (
            <FlatList
              horizontal
              data={restaurants}
              keyExtractor={(item) => item.id}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.restaurantList}
              renderItem={({ item }) => (
                <RestaurantCard item={item} onFavourite={handleFavourite} />
              )}
            />
          )}

          <SectionHeading
            title="Trending now"
            onSeeAll={() => navigation.navigate('Restaurants')}
          />

          <FlatList
            horizontal
            data={trending}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.trendingList}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.trendingCard}
                activeOpacity={0.8}
                onPress={() => showToast(`${item.name} selected`)}
              >
                <Image source={{ uri: item.image }} style={styles.trendingImage} />
                <View style={styles.trendingInfo}>
                  <Text style={styles.trendingName}>{item.name}</Text>
                  <Text style={styles.trendingRestaurant}>{item.restaurant}</Text>
                  <Text style={styles.trendingPrice}>{item.price}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </Animated.View>
      </ScrollView>

      {toast ? (
        <Animated.View style={[styles.toast, { opacity: toastOpacity }]}>
          <Text style={styles.toastText}>✓  {toast}</Text>
        </Animated.View>
      ) : null}
      <FilterModal
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        initialFilters={filters}
        onApply={(newFilters) => {
          setFilters(newFilters);
          showToast('Filters applied');
        }}
      />
      <BottomTabBar navigation={navigation} active="Home" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  scrollContent: { paddingHorizontal: 18, paddingTop: 48, paddingBottom: 22 },

  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    gap: 10,
  },
  locationArea: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 9 },
  locationIconWrap: {
    width: 35, height: 35, borderRadius: 18,
    backgroundColor: '#F1E9FF', alignItems: 'center', justifyContent: 'center',
  },
  locationPin: { color: '#008C89', fontSize: 24 },
  locationTextWrap: { flex: 1 },
  deliverTo: { color: '#9991AD', fontSize: 10 },
  addressText: { color: '#241B3D', fontSize: 13, fontWeight: '800' },
  headerIcon: {
    width: 37, height: 37, borderRadius: 20, backgroundColor: colors.white,
    alignItems: 'center', justifyContent: 'center', elevation: 3,
  },
  headerIconText: { fontSize: 22, color: '#241B3D' },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 22,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    position: 'relative',
  },

  notificationBadge: {
    position: 'absolute',
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: colors.orange,
    top: 7,
    right: 8,
    borderWidth: 1,
    borderColor: colors.white,
  },



  notificationBadge: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 5,
    backgroundColor: colors.orange,
    top: 7,
    right: 8,
    borderWidth: 1,
    borderColor: colors.white,
  },
  profileCircle: {
    width: 37, height: 37, borderRadius: 20, borderWidth: 1.5,
    borderColor: colors.orange, backgroundColor: '#FFF2E9',
    alignItems: 'center', justifyContent: 'center',
  },
  profileText: { color: colors.orangeDeep, fontSize: 11, fontWeight: '900' },

  searchBar: {
    height: 46, borderRadius: 15, borderWidth: 1,
    borderColor: '#E8E1F2', flexDirection: 'row',
    alignItems: 'center', paddingLeft: 13, paddingRight: 5,
    marginBottom: 14,
  },
  searchIcon: { fontSize: 24, color: '#9991AD' },
  searchInput: { flex: 1, paddingHorizontal: 8, fontSize: 12, color: colors.ink },
  filterButton: {
    width: 34, height: 34, borderRadius: 11,
    backgroundColor: '#008C89', alignItems: 'center', justifyContent: 'center',
  },
  filterIcon: { color: colors.white, fontSize: 22 },

  categoryList: { paddingBottom: 12, gap: 15 },
  categoryItem: { alignItems: 'center', width: 59 },
  categoryImageBorder: {
    width: 51, height: 51, borderRadius: 27,
    borderWidth: 2, borderColor: '#008C89', padding: 2,
  },
  categoryImage: { width: '100%', height: '100%', borderRadius: 25 },
  categoryName: { marginTop: 5, fontSize: 10, color: '#51486A', fontWeight: '600' },

  promoBanner: {
    height: 112, borderRadius: 19, overflow: 'hidden',
    flexDirection: 'row', alignItems: 'center', paddingLeft: 17,
    marginBottom: 19,
  },
  promoContent: { flex: 1, zIndex: 2 },
  promoTitle: { color: colors.white, fontSize: 22, fontWeight: '900' },
  promoDescription: { color: colors.white, fontSize: 10, marginTop: 2 },
  orderButton: {
    backgroundColor: colors.white, borderRadius: 15,
    paddingHorizontal: 15, paddingVertical: 6, alignSelf: 'flex-start',
    marginTop: 8,
  },
  orderButtonText: { color: '#008C89', fontSize: 10, fontWeight: '900' },
  promoImage: {
    width: 118, height: 118, borderRadius: 60,
    borderWidth: 3, borderColor: colors.white, marginRight: 9,
  },

  sectionHeading: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: 10, marginTop: 1,
  },
  sectionTitle: { color: '#241B3D', fontSize: 17, fontWeight: '900' },
  seeAll: { color: '#008C89', fontSize: 11, fontWeight: '700' },

  restaurantList: { gap: 12, paddingBottom: 16 },
  restaurantCard: { width: 225 },
  restaurantImageWrap: {
    height: 130, borderRadius: 16, overflow: 'hidden',
    backgroundColor: colors.soft,
  },
  restaurantImage: { width: '100%', height: '100%' },
  offerPill: {
    position: 'absolute', left: 8, bottom: 8,
    backgroundColor: colors.white, borderRadius: 12, paddingHorizontal: 8, paddingVertical: 4,
  },
  offerText: { color: '#008C89', fontSize: 10, fontWeight: '900' },
  heartButton: {
    position: 'absolute', right: 8, top: 8,
    width: 31, height: 31, borderRadius: 17,
    backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center',
  },
  heart: { color: '#241B3D', fontSize: 23, lineHeight: 26 },
  heartActive: { color: '#E94768' },
  restaurantName: { color: '#241B3D', fontSize: 13, fontWeight: '800', marginTop: 8 },
  restaurantCuisine: { color: '#77718A', fontSize: 10, marginTop: 3 },
  restaurantMeta: { flexDirection: 'row', gap: 8, marginTop: 5, alignItems: 'center' },
  rating: { color: '#F29B22', fontSize: 11, fontWeight: '800' },
  metaText: { color: '#77718A', fontSize: 10 },

  trendingList: { gap: 10, paddingBottom: 10 },
  trendingCard: {
    width: 190, height: 70, borderRadius: 15, borderWidth: 1,
    borderColor: '#EAE4F3', padding: 7, flexDirection: 'row',
    alignItems: 'center', gap: 8, backgroundColor: colors.white,
  },
  trendingImage: { width: 54, height: 54, borderRadius: 11 },
  trendingInfo: { flex: 1 },
  trendingName: { color: '#241B3D', fontSize: 11, fontWeight: '800' },
  trendingRestaurant: { color: '#918AA5', fontSize: 9, marginTop: 2 },
  trendingPrice: { color: '#008C89', fontSize: 10, fontWeight: '900', marginTop: 3 },

  skeletonCard: { width: 225, marginRight: 12, paddingBottom: 15 },
  skeletonImage: { height: 130, borderRadius: 16, backgroundColor: '#EAE6EF' },
  skeletonLine: { height: 11, width: '65%', borderRadius: 6, backgroundColor: '#EAE6EF', marginTop: 9 },
  skeletonSmallLine: { height: 8, width: '45%', borderRadius: 6, backgroundColor: '#EAE6EF', marginTop: 7 },
  toast: {
    position: 'absolute', bottom: 90, alignSelf: 'center',
    backgroundColor: '#29213E', paddingHorizontal: 17, paddingVertical: 11,
    borderRadius: 22, elevation: 8,
  },
  toastText: { color: colors.white, fontSize: 12, fontWeight: '700' },
});