import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { colors } from '../constants/colors';
import BottomTabBar from '../components/BottomTabBar';

const restaurantData = [
  {
    id: '1',
    name: 'Nizam Dum House',
    cuisine: 'Biryani, Mughlai',
    price: '₹350 for two',
    rating: '4.5',
    time: '30–35 min',
    distance: '2.4 km',
    offer: '50% OFF up to ₹100',
    image: 'https://images.unsplash.com/photo-1563379091339-03246963d96c?w=800',
  },
  {
    id: '2',
    name: 'Fire & Crust',
    cuisine: 'Pizza, Italian',
    price: '₹450 for two',
    rating: '4.4',
    time: '25–30 min',
    distance: '3.1 km',
    offer: 'Free delivery on ₹299+',
    image: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=800',
  },
  {
    id: '3',
    name: 'Tiffin Tales',
    cuisine: 'South Indian',
    price: '₹200 for two',
    rating: '4.3',
    time: '20–25 min',
    distance: '1.8 km',
    offer: '20% OFF',
    image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=800',
  },
];

const filters = ['Sort by', 'Cuisine', 'Price', 'Veg', 'Rating'];

export default function RestaurantsScreen({ navigation, route }) {
  const [search, setSearch] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('');
  const [favourites, setFavourites] = useState([]);

  const filteredRestaurants = useMemo(() => {
    return restaurantData.filter((item) =>
      `${item.name} ${item.cuisine}`.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const toggleFavourite = (id) => {
    setFavourites((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id]
    );
  };

  const renderRestaurant = ({ item }) => {
    const isFavourite = favourites.includes(item.id);

    return (
      <TouchableOpacity
        activeOpacity={0.94}
        style={styles.card}
        onPress={() => {}}
      >
        <View style={styles.imageWrap}>
          <Image source={{ uri: item.image }} style={styles.image} />

          <View style={styles.offerLabel}>
            <Text style={styles.offerText}>✦ {item.offer}</Text>
          </View>

          <View style={styles.timeLabel}>
            <Text style={styles.timeText}>◷ {item.time}</Text>
          </View>

          <TouchableOpacity
            style={styles.heartButton}
            onPress={() => toggleFavourite(item.id)}
            activeOpacity={0.7}
          >
            <Text style={[styles.heart, isFavourite && styles.heartActive]}>
              {isFavourite ? '♥' : '♡'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.details}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{item.name}</Text>
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingText}>★ {item.rating}</Text>
            </View>
          </View>

          <Text style={styles.cuisine}>
            {item.cuisine} · {item.price}
          </Text>

          <View style={styles.deliveryRow}>
            <Text style={styles.deliveryText}>♧  Delivery available</Text>
            <Text style={styles.distance}>⌖  {item.distance}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>

        <View style={styles.headerTitles}>
          <Text style={styles.heading}>Restaurants</Text>
          <Text style={styles.subheading}>Madhapur, Hyderabad</Text>
        </View>
      </View>

      <View style={styles.searchBar}>
        <Text style={styles.searchIcon}>⌕</Text>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search restaurants, cuisines"
          placeholderTextColor="#9991AD"
          style={styles.searchInput}
        />
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterIcon}>☷</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        horizontal
        data={filters}
        keyExtractor={(item) => item}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filters}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.filterChip,
              (selectedFilter === item || item === 'Veg') && styles.selectedChip,
            ]}
            onPress={() =>
              setSelectedFilter(selectedFilter === item ? '' : item)
            }
            activeOpacity={0.75}
          >
            <Text
              style={[
                styles.filterChipText,
                (selectedFilter === item || item === 'Veg') && styles.selectedChipText,
              ]}
            >
              {item} {item !== 'Veg' ? '⌄' : ''}
            </Text>
          </TouchableOpacity>
        )}
      />

      <View style={styles.resultRow}>
        <Text style={styles.resultCount}>
          {filteredRestaurants.length} restaurants
        </Text>
        <TouchableOpacity onPress={() => setSelectedFilter('Relevance')}>
          <Text style={styles.sortText}>↕ Sort: Relevance</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredRestaurants}
        keyExtractor={(item) => item.id}
        renderItem={renderRestaurant}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.restaurantList}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🍽️</Text>
            <Text style={styles.emptyTitle}>No restaurants found</Text>
            <Text style={styles.emptyText}>Try searching for another dish or cuisine.</Text>
          </View>
        }
        initialNumToRender={3}
        windowSize={5}
        removeClippedSubviews
      />

      <BottomTabBar navigation={navigation} active="Restaurants" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white, paddingTop: 45 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    marginBottom: 14,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 20,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    marginRight: 12,
  },
  backText: { color: '#241B3D', fontSize: 30, lineHeight: 32 },
  headerTitles: { flex: 1 },
  heading: {
    color: '#241B3D',
    fontSize: 21,
    fontWeight: '900',
  },
  subheading: { color: '#9991AD', fontSize: 10, marginTop: 2 },

  searchBar: {
    height: 45,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#E8E1F2',
    marginHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  searchIcon: { fontSize: 24, color: '#9991AD' },
  searchInput: { flex: 1, fontSize: 12, paddingHorizontal: 8, color: colors.ink },
  filterButton: {
    width: 33,
    height: 33,
    borderRadius: 11,
    backgroundColor: '#6336E8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterIcon: { color: colors.white, fontSize: 21 },

  filters: { paddingHorizontal: 18, paddingVertical: 12, gap: 8 },
  filterChip: {
    borderWidth: 1,
    borderColor: '#E8E1F2',
    borderRadius: 20,
    paddingHorizontal: 13,
    paddingVertical: 8,
  },
  selectedChip: { backgroundColor: '#F0E8FF', borderColor: '#6336E8' },
  filterChipText: { fontSize: 11, color: '#51486A' },
  selectedChipText: { color: '#6336E8', fontWeight: '800' },

  resultRow: {
    paddingHorizontal: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  resultCount: { color: '#241B3D', fontSize: 12, fontWeight: '900' },
  sortText: { color: '#6336E8', fontSize: 11, fontWeight: '700' },

  restaurantList: { paddingHorizontal: 18, paddingBottom: 15 },
  card: { marginBottom: 17 },
  imageWrap: {
    height: 155,
    borderRadius: 17,
    overflow: 'hidden',
    backgroundColor: colors.soft,
  },
  image: { width: '100%', height: '100%' },
  offerLabel: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 12,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  offerText: { color: colors.white, fontSize: 10, fontWeight: '800' },
  timeLabel: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  timeText: { color: '#241B3D', fontSize: 10, fontWeight: '800' },
  heartButton: {
    position: 'absolute',
    top: 9,
    right: 9,
    width: 32,
    height: 32,
    borderRadius: 18,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heart: { color: '#241B3D', fontSize: 23, lineHeight: 26 },
  heartActive: { color: '#E94768' },

  details: { paddingTop: 8 },
  nameRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  name: { color: '#241B3D', fontSize: 14, fontWeight: '900' },
  ratingBadge: { backgroundColor: '#13A45B', borderRadius: 7, paddingHorizontal: 7, paddingVertical: 4 },
  ratingText: { color: colors.white, fontSize: 10, fontWeight: '900' },
  cuisine: { color: '#77718A', fontSize: 11, marginTop: 4 },
  deliveryRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 12 },
  deliveryText: { color: '#6336E8', fontSize: 10 },
  distance: { color: '#77718A', fontSize: 10 },

  emptyState: { alignItems: 'center', paddingTop: 70 },
  emptyEmoji: { fontSize: 40 },
  emptyTitle: { color: '#241B3D', fontSize: 16, fontWeight: '900', marginTop: 12 },
  emptyText: { color: '#77718A', fontSize: 12, marginTop: 6 },
});