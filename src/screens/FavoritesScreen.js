import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppHeader from '../components/AppHeader';
import { restaurants, menuItems } from '../data/catalog';
import { useShop } from '../context/ShopContext';
import { colors } from '../constants/colors';

export default function FavoritesScreen({navigation}) {
 const {favorites,toggleFavorite,addToCart}=useShop();
 const [tab,setTab]=useState('Restaurants');
 const savedRestaurants=useMemo(()=>restaurants.filter(r=>favorites.includes(r.id)),[favorites]);
 const savedFoods=menuItems.slice(0,3);
 return <View style={styles.screen}>
  <AppHeader title="Favorites" subtitle={`${savedRestaurants.length} restaurants · dishes you saved`} navigation={navigation} rightIcon="search-outline"/>
  <View style={styles.tabs}>{['Restaurants','Food Items'].map(t=><TouchableOpacity key={t} onPress={()=>setTab(t)} style={[styles.tab,tab===t&&styles.tabActive]}><Text style={[styles.tabText,tab===t&&styles.tabTextActive]}>{t}</Text></TouchableOpacity>)}</View>
  <ScrollView contentContainerStyle={styles.content}>
   {tab==='Restaurants'?<>
    <Text style={styles.section}>Favorite Restaurants</Text>
    {savedRestaurants.map(r=><TouchableOpacity key={r.id} style={styles.restaurant} onPress={()=>navigation.navigate('RestaurantDetails',{restaurantId:r.id})}>
      <Image source={{uri:r.image}} style={styles.image}/><View style={{flex:1}}><Text style={styles.name}>{r.name}</Text><Text style={styles.muted}>{r.cuisine} · {r.distance}</Text><Text style={styles.rating}>★ {r.rating} · {r.time}</Text></View><TouchableOpacity onPress={()=>toggleFavorite(r.id)}><Ionicons name="heart" color={colors.orange} size={22}/></TouchableOpacity>
    </TouchableOpacity>)}
   </>:<>
    <Text style={styles.section}>Quick Order</Text>
    <View style={styles.foodGrid}>{savedFoods.map(item=><View key={item.id} style={styles.foodCard}><Image source={{uri:item.image}} style={styles.foodImage}/><Text style={styles.name}>{item.name}</Text><Text style={styles.muted}>{item.restaurant}</Text><View style={styles.foodBottom}><Text style={styles.price}>₹{item.price}</Text><TouchableOpacity style={styles.add} onPress={()=>addToCart({...item,portion:'Regular',extras:[]})}><Ionicons name="add" size={18} color="#fff"/></TouchableOpacity></View></View>)}</View>
   </>}
   {tab==='Restaurants'&&!savedRestaurants.length&&<Text style={styles.empty}>Save restaurants with the heart icon to see them here.</Text>}
  </ScrollView>
 </View>;
}
const styles=StyleSheet.create({screen:{flex:1,backgroundColor:'#F5F0FF',paddingTop:42},tabs:{flexDirection:'row',marginHorizontal:18,backgroundColor:'#E9E0FA',borderRadius:17,padding:4},tab:{flex:1,padding:11,alignItems:'center',borderRadius:14},tabActive:{backgroundColor:'#6734D4'},tabText:{fontSize:11,color:'#6E6380',fontWeight:'800'},tabTextActive:{color:'#fff'},content:{padding:17},section:{fontSize:14,fontWeight:'900',color:colors.ink,marginBottom:12},restaurant:{backgroundColor:'#fff',padding:11,borderRadius:16,flexDirection:'row',alignItems:'center',gap:11,marginBottom:10},image:{width:58,height:58,borderRadius:13,backgroundColor:'#eee'},name:{fontSize:11,fontWeight:'900',color:colors.ink},muted:{fontSize:9,color:colors.muted,marginTop:4},rating:{fontSize:10,color:'#D99018',fontWeight:'800',marginTop:5},foodGrid:{flexDirection:'row',flexWrap:'wrap',gap:10},foodCard:{width:'48%',backgroundColor:'#fff',padding:9,borderRadius:16},foodImage:{width:'100%',height:105,borderRadius:12,backgroundColor:'#eee',marginBottom:8},foodBottom:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:8},price:{fontSize:12,fontWeight:'900',color:colors.ink},add:{width:28,height:28,borderRadius:15,backgroundColor:colors.teal,alignItems:'center',justifyContent:'center'},empty:{textAlign:'center',color:colors.muted,padding:25}});
