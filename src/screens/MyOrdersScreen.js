import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppHeader from '../components/AppHeader';
import PrimaryButton from '../components/PrimaryButton';
import { useShop } from '../context/ShopContext';
import { colors } from '../constants/colors';
import { LayoutAnimation, Platform, UIManager } from 'react-native';


const tabs=['Active','Completed','Cancelled'];

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}
export default function MyOrdersScreen({navigation}) {
 const {orders,setActiveOrder}=useShop();
const [tab, setTab] = useState('Active');

const handleTabChange = (newTab) => {
  LayoutAnimation.configureNext(
    LayoutAnimation.Presets.easeInEaseOut
  );

  setTab(newTab);
};

 const filtered=useMemo(()=>orders.filter(o=>tab==='Active'?o.status==='On Delivery':tab==='Completed'?o.status==='Delivered':o.status==='Cancelled'),[orders,tab]);
 return <View style={styles.screen}>
  <AppHeader title="My Orders" subtitle="Track, reorder and download invoices" navigation={navigation} rightIcon="search-outline"/>
  <View style={styles.tabs}>{tabs.map(t=><TouchableOpacity key={t} onPress={() => handleTabChange(t)} style={[styles.tab,tab===t&&styles.tabActive]}><Text style={[styles.tabText,tab===t&&styles.tabTextActive]}>{t}</Text><Text style={styles.tabCount}>{orders.filter(o=>t==='Active'?o.status==='On Delivery':t==='Completed'?o.status==='Delivered':o.status==='Cancelled').length}</Text></TouchableOpacity>)}</View>
  <ScrollView contentContainerStyle={styles.content}>
   {filtered.map(order=><View key={order.id} style={styles.order}>
    <View style={styles.row}><View style={styles.restaurantIcon}><Ionicons name="restaurant" size={18} color={colors.orange}/></View><View style={{flex:1}}><Text style={styles.name}>{order.restaurant}</Text><Text style={styles.muted}>#{order.id} · {order.date}</Text></View><Text style={[styles.status,order.status==='Delivered'?styles.delivered:order.status==='Cancelled'?styles.cancelled:styles.active]}>{order.status}</Text></View>
    <Text style={styles.items}>{order.items.join(', ')}</Text>
    <View style={styles.rowBottom}><View><Text style={styles.muted}>Total amount</Text><Text style={styles.total}>₹{order.total}</Text></View>
      {order.status==='On Delivery'?<PrimaryButton title="Track order" onPress={()=>{setActiveOrder(order);navigation.navigate('OrderTracking')}} style={styles.smallButton}/>:<TouchableOpacity style={styles.reorder} onPress={()=>navigation.navigate('Restaurants')}><Text style={styles.reorderText}>＋ Reorder</Text></TouchableOpacity>}
    </View>
   </View>)}
   {!filtered.length&&<View style={styles.empty}><Ionicons name="receipt-outline" size={44} color={colors.teal}/><Text style={styles.name}>No {tab.toLowerCase()} orders yet</Text></View>}
  </ScrollView>
 </View>;
}
const styles=StyleSheet.create({screen:{flex:1,backgroundColor:'#F5F0FF',paddingTop:42},
  tabs:{flexDirection:'row',marginHorizontal:18,backgroundColor:'#E9E0FA',borderRadius:18,padding:4},tab:{flex:1,paddingVertical:10,alignItems:'center',flexDirection:'row',justifyContent:'center',gap:5,borderRadius:14},tabActive:{backgroundColor:'#6734D4'},tabText:{fontSize:10,color:'#6E6380',fontWeight:'800'},tabTextActive:{color:'#fff'},tabCount:{fontSize:9,color:'#A99CBD'},content:{padding:16,gap:12},order:{backgroundColor:'#fff',borderRadius:18,padding:14},row:{flexDirection:'row',alignItems:'center',gap:10},restaurantIcon:{width:38,height:38,borderRadius:13,backgroundColor:'#FFF0E7',alignItems:'center',justifyContent:'center'},name:{fontSize:13,fontWeight:'900',color:colors.ink},muted:{fontSize:9,color:colors.muted,marginTop:4},status:{fontSize:9,fontWeight:'900',paddingHorizontal:8,paddingVertical:6,borderRadius:10},active:{color:'#9A6500',backgroundColor:'#FFF0CB'},delivered:{color:'#13834B',backgroundColor:'#DDF8E8'},cancelled:{color:'#B43B3B',backgroundColor:'#FFE5E5'},items:{fontSize:10,color:colors.muted,marginTop:12,lineHeight:16},rowBottom:{borderTopWidth:1,borderColor:colors.border,marginTop:12,paddingTop:11,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},total:{fontSize:14,fontWeight:'900',color:colors.ink,marginTop:3},smallButton:{minHeight:38,paddingHorizontal:14,borderRadius:12},reorder:{borderWidth:1,borderColor:colors.teal,borderRadius:13,paddingHorizontal:14,paddingVertical:9},reorderText:{color:colors.teal,fontSize:10,fontWeight:'900'},empty:{alignItems:'center',padding:50,gap:12},screen: {
  flex: 1,
  backgroundColor: colors.cream,
  paddingTop: 42,
},
tabs: {
  flexDirection: 'row',
  marginHorizontal: 18,
  backgroundColor: colors.soft,
  borderRadius: 18,
  padding: 4,
},
tabActive: {
  backgroundColor: colors.orange,
},
tabText: {
  fontSize: 10,
  color: colors.muted,
  fontWeight: '800',
},
tabTextActive: {
  color: colors.white,
},
tabCount: {
  fontSize: 9,
  color: colors.muted,
},
active: {
  color: colors.orangeDeep,
  backgroundColor: colors.vanilla,
},
delivered: {
  color: colors.tealDeep,
  backgroundColor: colors.aqua,
},
cancelled: {
  color: '#B43B3B',
  backgroundColor: '#FFE5E5',
},});
