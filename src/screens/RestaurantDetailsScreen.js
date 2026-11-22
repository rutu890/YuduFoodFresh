import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppHeader from '../components/AppHeader';
import PrimaryButton from '../components/PrimaryButton';
import { restaurants, menuItems } from '../data/catalog';
import { useShop } from '../context/ShopContext';
import { colors } from '../constants/colors';

export default function RestaurantDetailsScreen({ route, navigation }) {
  const restaurant = restaurants.find(r => r.id === route.params?.restaurantId) || restaurants[0];
  const items = useMemo(() => menuItems.filter(m => m.restaurantId === restaurant.id), [restaurant.id]);
  const [selected, setSelected] = useState(null);
  const [portion, setPortion] = useState('Regular');
  const [extras, setExtras] = useState([]);
  const { addToCart, favorites, toggleFavorite, cart } = useShop();
  const toggleExtra = x => setExtras(old => old.includes(x) ? old.filter(v=>v!==x) : [...old,x]);
  const addSelected = () => {
    if (!selected) return;
    const extraCost = extras.reduce((n,x)=>n+(x==='Extra cheese'?40:30),0);
    addToCart({...selected, price:selected.price+(portion==='Large'?120:0)+extraCost, portion, extras});
    setSelected(null); setExtras([]); setPortion('Regular');
  };
  return <View style={styles.screen}>
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.heroWrap}>
        <Image source={{uri:restaurant.image}} style={styles.hero}/>
        <View style={styles.heroActions}>
          <TouchableOpacity style={styles.circle} onPress={()=>navigation.goBack()}><Ionicons name="chevron-back" size={21}/></TouchableOpacity>
          <View style={{flex:1}}/>
          <TouchableOpacity style={styles.circle} onPress={()=>toggleFavorite(restaurant.id)}><Ionicons name={favorites.includes(restaurant.id)?'heart':'heart-outline'} size={20} color={colors.orange}/></TouchableOpacity>
          <TouchableOpacity style={styles.circle}><Ionicons name="share-social-outline" size={19}/></TouchableOpacity>
        </View>
      </View>
      <View style={styles.info}>
        <View style={styles.titleRow}><Text style={styles.title}>{restaurant.name}</Text><Text style={styles.rating}>★ {restaurant.rating}</Text></View>
        <Text style={styles.meta}>{restaurant.cuisine} · {restaurant.area}</Text>
        <Text style={styles.meta}>◷ {restaurant.time}   ·   ⌖ {restaurant.distance}   ·   ₹25 delivery</Text>
        <View style={styles.coupon}><Text style={styles.couponText}>％  {restaurant.offer} · Use code WELCOME50</Text></View>
      </View>
      <View style={styles.sectionHead}><Text style={styles.sectionTitle}>Recommended</Text><Text style={styles.meta}>{items.length} items</Text></View>
      {items.map(item=><View key={item.id} style={styles.menuRow}>
        <View style={{flex:1}}>
          <Text style={styles.tag}>{item.category}</Text><Text style={styles.itemName}>{item.name}</Text><Text style={styles.price}>₹{item.price}</Text><Text style={styles.description}>{item.description}</Text>
        </View>
        <View style={styles.thumbWrap}><Image source={{uri:item.image}} style={styles.thumb}/><TouchableOpacity style={styles.add} onPress={()=>{setSelected(item);setPortion('Regular');setExtras([]);}}><Text style={styles.addText}>＋ Add</Text></TouchableOpacity></View>
      </View>)}
      <View style={{height:110}}/>
    </ScrollView>
    {cart.length>0&&<View style={styles.cartBar}><Text style={styles.cartCount}>{cart.reduce((n,x)=>n+x.quantity,0)} items in cart</Text><PrimaryButton title="View cart →" onPress={()=>navigation.navigate('Cart')} style={{flex:1}}/></View>}
    <Modal visible={!!selected} transparent animationType="slide" onRequestClose={()=>setSelected(null)}>
      <View style={styles.modalShade}><View style={styles.modal}>
        <View style={styles.modalHead}><Text style={styles.modalTitle}>Customise item</Text><TouchableOpacity onPress={()=>setSelected(null)}><Ionicons name="close" size={22}/></TouchableOpacity></View>
        <Text style={styles.itemName}>{selected?.name}</Text><Text style={styles.groupLabel}>Choose portion</Text>
        <View style={styles.optionRow}>{['Regular','Large'].map(p=><TouchableOpacity key={p} onPress={()=>setPortion(p)} style={[styles.option,portion===p&&styles.optionActive]}><Text style={[styles.optionText,portion===p&&styles.optionTextActive]}>{p}{p==='Large'?' +₹120':''}</Text></TouchableOpacity>)}</View>
        <Text style={styles.groupLabel}>Extras</Text>
        {['Extra cheese','Extra raita'].map(x=><TouchableOpacity key={x} onPress={()=>toggleExtra(x)} style={styles.extraRow}><Text style={styles.optionText}>{x}</Text><Ionicons name={extras.includes(x)?'checkbox':'square-outline'} size={20} color={colors.teal}/></TouchableOpacity>)}
        <PrimaryButton title={`Add to cart · ₹${(selected?.price||0)+(portion==='Large'?120:0)+extras.reduce((n,x)=>n+(x==='Extra cheese'?40:30),0)}`} onPress={addSelected}/>
      </View></View>
    </Modal>
  </View>;
}
const styles=StyleSheet.create({
 screen:{flex:1,backgroundColor:'#fff',paddingTop:0},heroWrap:{height:245},hero:{width:'100%',height:'100%',backgroundColor:'#eee'},heroActions:{position:'absolute',top:48,left:16,right:16,flexDirection:'row',alignItems:'center'},circle:{width:38,height:38,borderRadius:20,backgroundColor:'#fff',alignItems:'center',justifyContent:'center',marginLeft:8,elevation:3},info:{padding:18,borderBottomWidth:1,borderColor:colors.border},titleRow:{flexDirection:'row',justifyContent:'space-between',alignItems:'center'},title:{fontSize:22,fontWeight:'900',color:colors.ink},rating:{backgroundColor:'#159B58',color:'#fff',paddingHorizontal:8,paddingVertical:4,borderRadius:7,fontWeight:'900',fontSize:11},meta:{fontSize:11,color:colors.muted,marginTop:7},coupon:{backgroundColor:'#F0E8FF',padding:11,borderRadius:11,marginTop:12},couponText:{color:colors.teal,fontSize:11,fontWeight:'800'},sectionHead:{paddingHorizontal:18,paddingTop:18,paddingBottom:5,flexDirection:'row',justifyContent:'space-between',alignItems:'center'},sectionTitle:{fontSize:18,fontWeight:'900',color:colors.ink},menuRow:{marginHorizontal:18,paddingVertical:16,borderBottomWidth:1,borderColor:colors.border,flexDirection:'row',gap:12},tag:{fontSize:9,color:colors.orange,fontWeight:'900'},itemName:{fontSize:14,fontWeight:'900',color:colors.ink,marginTop:5},price:{fontSize:12,fontWeight:'900',color:colors.ink,marginTop:5},description:{fontSize:10,color:colors.muted,lineHeight:15,marginTop:5},thumbWrap:{width:112,height:104},thumb:{width:112,height:82,borderRadius:13,backgroundColor:'#eee'},add:{position:'absolute',bottom:0,alignSelf:'center',backgroundColor:'#fff',borderColor:colors.teal,borderWidth:1,borderRadius:10,paddingHorizontal:18,paddingVertical:7},addText:{color:colors.teal,fontWeight:'900',fontSize:11},cartBar:{position:'absolute',bottom:12,left:14,right:14,backgroundColor:'#fff',padding:10,borderRadius:17,flexDirection:'row',alignItems:'center',gap:10,elevation:8},cartCount:{fontSize:11,fontWeight:'900',color:colors.ink,flex:1},modalShade:{flex:1,backgroundColor:'rgba(0,0,0,.4)',justifyContent:'flex-end'},modal:{backgroundColor:'#fff',padding:20,borderTopLeftRadius:24,borderTopRightRadius:24,gap:10},modalHead:{flexDirection:'row',justifyContent:'space-between',alignItems:'center'},modalTitle:{fontSize:18,fontWeight:'900',color:colors.ink},groupLabel:{fontWeight:'900',fontSize:12,color:colors.ink,marginTop:8},optionRow:{flexDirection:'row',gap:10},option:{padding:11,borderRadius:12,borderWidth:1,borderColor:colors.border},optionActive:{borderColor:colors.teal,backgroundColor:'#E5F5F2'},optionText:{fontSize:12,color:colors.ink},optionTextActive:{color:colors.teal,fontWeight:'900'},extraRow:{flexDirection:'row',justifyContent:'space-between',paddingVertical:8}
});
