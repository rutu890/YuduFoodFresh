import React, { useMemo, useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppHeader from '../components/AppHeader';
import BottomTabBar from '../components/BottomTabBar';
import FilterModal from '../components/FilterModal';
import { restaurants } from '../data/catalog';
import { useShop } from '../context/ShopContext';
import { colors } from '../constants/colors';

const cuisines = ['All', 'Biryani', 'Pizza', 'South Indian', 'North Indian'];

export default function RestaurantsScreen({ navigation, route }) {
  const initialCategory = route?.params?.category;
  const [search, setSearch] = useState('');
  const [cuisine, setCuisine] = useState(initialCategory || 'All');
  const [sort, setSort] = useState('Relevance');
  const [price, setPrice] = useState('Any');
  const [vegOnly, setVegOnly] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  const { favorites, toggleFavorite, cart } = useShop();

  const cartCount = useMemo(() => {
    if (!cart || !Array.isArray(cart)) return 0;
    return cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  }, [cart]);

  useEffect(() => {
    if (route?.params?.category) {
      setCuisine(route.params.category);
    }
  }, [route?.params?.category]);

  const hasActiveFilters =
    cuisine !== 'All' ||
    sort !== 'Relevance' ||
    price !== 'Any' ||
    vegOnly ||
    search.trim().length > 0;

  const handleResetFilters = () => {
    setSearch('');
    setCuisine('All');
    setSort('Relevance');
    setPrice('Any');
    setVegOnly(false);
  };

  const rows = useMemo(() => {
    let data = restaurants.filter((r) => {
      const query = search.trim().toLowerCase();
      const matchesSearch =
        !query ||
        `${r.name} ${r.cuisine} ${r.area}`.toLowerCase().includes(query);

      const matchesCuisine =
        cuisine === 'All' ||
        r.cuisine.toLowerCase().includes(cuisine.toLowerCase()) ||
        r.name.toLowerCase().includes(cuisine.toLowerCase());

      const matchesVeg = !vegOnly || r.veg === true;

      let matchesPrice = true;
      if (price === 'Under ₹200') {
        matchesPrice = r.price < 200;
      } else if (price === '₹200–₹400') {
        matchesPrice = r.price >= 200 && r.price <= 400;
      } else if (price === 'Above ₹400') {
        matchesPrice = r.price > 400;
      }

      return matchesSearch && matchesCuisine && matchesVeg && matchesPrice;
    });

    if (sort === 'Rating') {
      data.sort((a, b) => b.rating - a.rating);
    } else if (sort === 'Price: Low to High') {
      data.sort((a, b) => a.price - b.price);
    } else if (sort === 'Delivery time') {
      const getTime = (t) => parseInt(t, 10) || 0;
      data.sort((a, b) => getTime(a.time) - getTime(b.time));
    }

    return data;
  }, [search, cuisine, sort, price, vegOnly]);

  return (
    <View style={styles.screen}>
      <AppHeader
        title="Restaurants"
        subtitle="Madhapur, Hyderabad"
        navigation={navigation}
      />

      <View style={styles.searchRow}>
        <Ionicons name="search" size={18} color={colors.muted} />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search restaurants, cuisines"
          placeholderTextColor={colors.muted}
          style={styles.search}
        />
        {search.length > 0 && (
          <TouchableOpacity
            onPress={() => setSearch('')}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="close-circle" size={18} color={colors.muted} />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={() => setFilterModalVisible(true)}
          style={[
            styles.filterButton,
            (sort !== 'Relevance' || price !== 'Any' || vegOnly) &&
              styles.filterButtonActive,
          ]}
        >
          <Ionicons
            name="options"
            size={20}
            color={
              sort !== 'Relevance' || price !== 'Any' || vegOnly
                ? colors.white
                : colors.teal
            }
          />
        </TouchableOpacity>
      </View>

      <View style={styles.chipsWrap}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chips}
        >
          {cuisines.map((c) => {
            const active = cuisine === c;
            return (
              <TouchableOpacity
                key={c}
                onPress={() => setCuisine(c)}
                style={[styles.chip, active && styles.chipActive]}
              >
                <Text
                  style={[styles.chipText, active && styles.chipTextActive]}
                >
                  {c}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <View style={styles.resultLine}>
        <Text style={styles.count}>{rows.length} restaurants</Text>
        <View style={styles.sortStatusRow}>
          <Text style={styles.sortLabel}>↕ {sort}</Text>
          {hasActiveFilters && (
            <TouchableOpacity
              onPress={handleResetFilters}
              style={styles.resetPill}
            >
              <Text style={styles.resetPillText}>Reset</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
      >
        {rows.map((r) => (
          <TouchableOpacity
            key={r.id}
            activeOpacity={0.9}
            style={styles.card}
            onPress={() =>
              navigation.navigate('RestaurantDetails', { restaurantId: r.id })
            }
          >
            <View style={styles.imageContainer}>
              <Image source={{ uri: r.image }} style={styles.image} />
              {!!r.offer && (
                <View style={styles.offerBadge}>
                  <Text style={styles.offerText}>{r.offer}</Text>
                </View>
              )}
            </View>
            <View style={styles.cardBody}>
              <View style={styles.nameRow}>
                <Text style={styles.name}>{r.name}</Text>
                <TouchableOpacity
                  onPress={(e) => {
                    e?.stopPropagation?.();
                    toggleFavorite(r.id);
                  }}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons
                    name={favorites.includes(r.id) ? 'heart' : 'heart-outline'}
                    size={21}
                    color={
                      favorites.includes(r.id) ? colors.orange : colors.muted
                    }
                  />
                </TouchableOpacity>
              </View>
              <Text style={styles.meta}>
                {r.cuisine} · {r.area}
              </Text>
              <View style={styles.details}>
                <Text style={styles.rating}>★ {r.rating}</Text>
                <Text style={styles.meta}>◷ {r.time}</Text>
                <Text style={styles.meta}>⌖ {r.distance}</Text>
                <Text style={styles.meta}>₹{r.price} for two</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {rows.length === 0 && (
          <View style={styles.emptyContainer}>
            <Ionicons name="restaurant-outline" size={48} color={colors.muted} />
            <Text style={styles.empty}>
              No restaurants match these filters.
            </Text>
            {hasActiveFilters && (
              <TouchableOpacity
                onPress={handleResetFilters}
                style={styles.emptyResetBtn}
              >
                <Text style={styles.emptyResetBtnText}>Reset all filters</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>

      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        initialFilters={{ sort, cuisine, price, vegOnly }}
        onApply={(applied) => {
          setSort(applied.sort);
          setCuisine(applied.cuisine);
          setPrice(applied.price);
          setVegOnly(applied.vegOnly);
        }}
      />

      <BottomTabBar
        navigation={navigation}
        active="Restaurants"
        cartCount={cartCount}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.soft,
    paddingTop: 42,
  },
  searchRow: {
    marginHorizontal: 18,
    backgroundColor: colors.white,
    borderRadius: 14,
    height: 48,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  search: {
    flex: 1,
    color: colors.ink,
    fontSize: 13,
  },
  filterButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterButtonActive: {
    backgroundColor: colors.teal,
  },
  chipsWrap: {
    paddingVertical: 12,
  },
  chips: {
    paddingHorizontal: 18,
    gap: 8,
  },
  chip: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
  },
  chipActive: {
    backgroundColor: colors.teal,
    borderColor: colors.teal,
  },
  chipText: {
    fontSize: 11,
    color: colors.muted,
    fontWeight: '700',
  },
  chipTextActive: {
    color: colors.white,
    fontWeight: '800',
  },
  resultLine: {
    paddingHorizontal: 20,
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  count: {
    fontSize: 12,
    fontWeight: '900',
    color: colors.ink,
  },
  sortStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sortLabel: {
    fontSize: 11,
    color: colors.teal,
    fontWeight: '700',
  },
  resetPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    backgroundColor: colors.cream,
    borderWidth: 1,
    borderColor: colors.border,
  },
  resetPillText: {
    fontSize: 10,
    color: colors.orangeDeep,
    fontWeight: '800',
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 14,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 19,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 2,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 165,
    backgroundColor: colors.border,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  offerBadge: {
    position: 'absolute',
    left: 12,
    bottom: 12,
    backgroundColor: colors.ink,
    opacity: 0.85,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  offerText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '900',
  },
  cardBody: {
    padding: 13,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.ink,
  },
  meta: {
    fontSize: 10,
    color: colors.muted,
    marginTop: 4,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    alignItems: 'center',
  },
  rating: {
    fontSize: 11,
    color: colors.mango,
    fontWeight: '900',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
    gap: 10,
  },
  empty: {
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '700',
    color: colors.muted,
  },
  emptyResetBtn: {
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: colors.teal,
  },
  emptyResetBtnText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '800',
  },
});
