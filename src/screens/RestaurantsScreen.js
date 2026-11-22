import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Image, StyleSheet, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppHeader from '../components/AppHeader';
import { restaurants } from '../data/catalog';
import { useShop } from '../context/ShopContext';
import { colors } from '../constants/colors';

const cuisines = ['All', 'Biryani', 'Pizza', 'South Indian', 'North Indian'];
const sorts = ['Relevance', 'Rating', 'Delivery time', 'Price: Low to High'];

export default function RestaurantsScreen({ navigation }) {
  const [search, setSearch] = useState('');
  const [cuisine, setCuisine] = useState('All');
  const [sort, setSort] = useState('Relevance');
  const [vegOnly, setVegOnly] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const { favorites, toggleFavorite } = useShop();

  const rows = useMemo(() => {
    let data = restaurants.filter(r =>
      `${r.name} ${r.cuisine} ${r.area}`.toLowerCase().includes(search.toLowerCase()) &&
      (cuisine === 'All' || r.cuisine.toLowerCase().includes(cuisine.toLowerCase())) &&
      (!vegOnly || r.veg)
    );
    if (sort === 'Rating') data.sort((a,b) => b.rating-a.rating);
    if (sort === 'Price: Low to High') data.sort((a,b) => a.price-b.price);
    if (sort === 'Delivery time') data.sort((a,b) => a.time.localeCompare(b.time));
    return data;
  }, [search, cuisine, sort, vegOnly]);

  return (
    <View style={styles.screen}>
      <AppHeader title="Restaurants" subtitle="Madhapur, Hyderabad" navigation={navigation} rightIcon="options-outline" onRightPress={() => setFiltersOpen(v => !v)} />
      <View style={styles.searchRow}>
        <Ionicons name="search" size={18} color={colors.muted} />
        <TextInput value={search} onChangeText={setSearch} placeholder="Search restaurants, cuisines" placeholderTextColor="#A49A94" style={styles.search} />
        <TouchableOpacity onPress={() => setFiltersOpen(v => !v)}><Ionicons name="options" size={21} color={colors.teal} /></TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
        {cuisines.map(c => <TouchableOpacity key={c} onPress={() => setCuisine(c)} style={[styles.chip, cuisine===c && styles.chipActive]}><Text style={[styles.chipText,cuisine===c&&styles.chipTextActive]}>{c}</Text></TouchableOpacity>)}
      </ScrollView>
      {filtersOpen && <View style={styles.filterPanel}>
        <Text style={styles.filterTitle}>Sort by</Text>
        <View style={styles.wrap}>{sorts.map(s => <TouchableOpacity key={s} onPress={() => setSort(s)} style={[styles.chip,sort===s&&styles.chipActive]}><Text style={[styles.chipText,sort===s&&styles.chipTextActive]}>{s}</Text></TouchableOpacity>)}</View>
        <View style={styles.vegRow}><Text style={styles.filterTitle}>Pure vegetarian only</Text><Switch value={vegOnly} onValueChange={setVegOnly} trackColor={{true:colors.teal}} /></View>
      </View>}
      <View style={styles.resultLine}><Text style={styles.count}>{rows.length} restaurants</Text><Text style={styles.sortLabel}>↕ {sort}</Text></View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
        {rows.map(r => <TouchableOpacity key={r.id} activeOpacity={0.9} style={styles.card} onPress={() => navigation.navigate('RestaurantDetails',{restaurantId:r.id})}>
          <View>
            <Image source={{uri:r.image}} style={styles.image} />
            {!!r.offer && <View style={styles.offer}><Text style={styles.offerText}>{r.offer}</Text></View>}
          </View>
          <View style={styles.cardBody}>
            <View style={styles.nameRow}><Text style={styles.name}>{r.name}</Text><TouchableOpacity onPress={() => toggleFavorite(r.id)}><Ionicons name={favorites.includes(r.id)?'heart':'heart-outline'} size={21} color={colors.orange} /></TouchableOpacity></View>
            <Text style={styles.meta}>{r.cuisine} · {r.area}</Text>
            <View style={styles.details}><Text style={styles.rating}>★ {r.rating}</Text><Text style={styles.meta}>◷ {r.time}</Text><Text style={styles.meta}>⌖ {r.distance}</Text><Text style={styles.meta}>₹{r.price} for two</Text></View>
          </View>
        </TouchableOpacity>)}
        {!rows.length && <Text style={styles.empty}>No restaurants match these filters.</Text>}
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
 screen:{flex:1,backgroundColor:colors.soft,paddingTop:42}, searchRow:{marginHorizontal:18,backgroundColor:'#fff',borderRadius:14,height:48,paddingHorizontal:14,flexDirection:'row',alignItems:'center',gap:10,borderWidth:1,borderColor:colors.border},search:{flex:1,color:colors.ink},chips:{paddingHorizontal:18,paddingVertical:13,gap:8},chip:{borderWidth:1,borderColor:colors.border,backgroundColor:'#fff',paddingHorizontal:13,paddingVertical:8,borderRadius:18},chipActive:{backgroundColor:'#E5F5F2',borderColor:colors.teal},chipText:{fontSize:11,color:colors.muted,fontWeight:'700'},chipTextActive:{color:colors.teal},filterPanel:{marginHorizontal:18,backgroundColor:'#fff',padding:14,borderRadius:16},filterTitle:{fontWeight:'800',color:colors.ink,fontSize:12},wrap:{flexDirection:'row',flexWrap:'wrap',gap:7,marginTop:9},vegRow:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginTop:10},resultLine:{paddingHorizontal:20,paddingBottom:8,flexDirection:'row',justifyContent:'space-between'},count:{fontSize:12,fontWeight:'900',color:colors.ink},sortLabel:{fontSize:11,color:colors.teal},list:{paddingHorizontal:16,paddingBottom:30,gap:14},card:{backgroundColor:'#fff',borderRadius:19,overflow:'hidden',elevation:2},image:{width:'100%',height:165,backgroundColor:'#eee'},offer:{position:'absolute',left:12,bottom:12,backgroundColor:'rgba(0,0,0,.65)',paddingHorizontal:10,paddingVertical:6,borderRadius:10},offerText:{color:'#fff',fontSize:10,fontWeight:'900'},cardBody:{padding:13},nameRow:{flexDirection:'row',alignItems:'center',justifyContent:'space-between'},name:{fontSize:16,fontWeight:'900',color:colors.ink},meta:{fontSize:10,color:colors.muted,marginTop:4},details:{flexDirection:'row',justifyContent:'space-between',marginTop:10,alignItems:'center'},rating:{fontSize:11,color:'#E99A18',fontWeight:'900'},empty:{textAlign:'center',padding:35,color:colors.muted}
});
