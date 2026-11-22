import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppHeader from '../components/AppHeader';
import PrimaryButton from '../components/PrimaryButton';
import { useShop } from '../context/ShopContext';
import { colors } from '../constants/colors';

export default function CartScreen({ navigation }) {
 const {cart,changeQuantity,removeFromCart}=useShop();
 const [coupon,setCoupon]=useState('WELCOME50');
 const [applied,setApplied]=useState(true);
 const subtotal=useMemo(()=>cart.reduce((n,x)=>n+x.price*x.quantity,0),[cart]);
 const discount=applied&&subtotal>0?Math.min(100,subtotal):0;
 const total=Math.max(0,subtotal+(cart.length?68:0)-discount);
 return <View style={styles.screen}>
  <AppHeader title="Your cart" subtitle={`${cart.length} items in your bag`} navigation={navigation}/>
  <ScrollView contentContainerStyle={styles.content}>
   {cart.length===0?<View style={styles.empty}><Ionicons name="basket-outline" size={55} color={colors.teal}/><Text style={styles.emptyTitle}>Your cart is waiting</Text><Text style={styles.muted}>Add something delicious to get started.</Text><PrimaryButton title="Explore restaurants" onPress={()=>navigation.navigate('Restaurants')} style={{marginTop:18}}/></View>:
   <>
    {cart.map(item=><View key={item.key} style={styles.item}>
      <Image source={{uri:item.image}} style={styles.image}/>
      <View style={{flex:1}}><Text style={styles.name}>{item.name}</Text><Text style={styles.muted}>{item.portion||'Regular'}{item.extras?.length?` · ${item.extras.join(', ')}`:''}</Text><TouchableOpacity onPress={()=>removeFromCart(item.key)}><Text style={styles.remove}>Remove</Text></TouchableOpacity></View>
      <View style={styles.right}><View style={styles.stepper}><TouchableOpacity onPress={()=>changeQuantity(item.key,-1)}><Text style={styles.step}>−</Text></TouchableOpacity><Text style={styles.qty}>{item.quantity}</Text><TouchableOpacity onPress={()=>changeQuantity(item.key,1)}><Text style={styles.step}>＋</Text></TouchableOpacity></View><Text style={styles.price}>₹{item.price*item.quantity}</Text></View>
    </View>)}
    <View style={styles.couponBox}><View style={{flex:1}}><Text style={styles.name}>Apply coupon</Text><TextInput value={coupon} onChangeText={setCoupon} autoCapitalize="characters" style={styles.couponInput}/></View><TouchableOpacity onPress={()=>setApplied(coupon.trim().toUpperCase()==='WELCOME50')}><Text style={styles.apply}>{applied?'Applied ✓':'Apply'}</Text></TouchableOpacity></View>
    <View style={styles.bill}><Text style={styles.billTitle}>Bill details</Text><Bill label="Item total" value={`₹${subtotal}`}/><Bill label="Delivery fee" value={cart.length?'₹25':'₹0'}/><Bill label="Taxes & charges" value={cart.length?'₹43':'₹0'}/><Bill label="Coupon · WELCOME50" value={`−₹${discount}`} green/><View style={styles.total}><Text style={styles.totalText}>To pay</Text><Text style={styles.totalText}>₹{total}</Text></View></View>
   </>}
  </ScrollView>
  {cart.length>0&&<View style={styles.footer}><View><Text style={styles.muted}>Total payable</Text><Text style={styles.totalText}>₹{total}</Text></View><PrimaryButton title="Checkout →" onPress={()=>navigation.navigate('Checkout')} style={{flex:1}}/></View>}
 </View>;
}
function Bill({label,value,green}){return <View style={styles.billRow}><Text style={[styles.muted,green&&{color:'#159B58'}]}>{label}</Text><Text style={[styles.billValue,green&&{color:'#159B58'}]}>{value}</Text></View>}
const styles=StyleSheet.create({screen:{flex:1,backgroundColor:colors.soft,paddingTop:42},content:{padding:16,paddingBottom:120},item:{backgroundColor:'#fff',borderRadius:16,padding:11,flexDirection:'row',gap:11,marginBottom:11,alignItems:'center'},image:{width:75,height:75,borderRadius:12,backgroundColor:'#eee'},name:{fontSize:12,fontWeight:'900',color:colors.ink},muted:{fontSize:10,color:colors.muted,marginTop:5},remove:{fontSize:10,color:colors.orange,fontWeight:'800',marginTop:8},right:{alignItems:'flex-end',gap:9},stepper:{flexDirection:'row',alignItems:'center',borderWidth:1,borderColor:colors.teal,borderRadius:9,paddingHorizontal:7,paddingVertical:3,gap:9},step:{fontSize:16,color:colors.teal,fontWeight:'900'},qty:{fontSize:12,fontWeight:'900'},price:{fontSize:12,fontWeight:'900',color:colors.ink},couponBox:{backgroundColor:'#fff',padding:15,borderRadius:15,flexDirection:'row',alignItems:'center',marginTop:6},couponInput:{borderWidth:1,borderColor:colors.border,borderRadius:8,paddingHorizontal:10,paddingVertical:6,marginTop:8,width:160,fontSize:12},apply:{color:colors.teal,fontWeight:'900'},bill:{backgroundColor:'#fff',padding:16,borderRadius:16,marginTop:14},billTitle:{fontSize:14,fontWeight:'900',color:colors.ink,marginBottom:10},billRow:{flexDirection:'row',justifyContent:'space-between',paddingVertical:7},billValue:{fontSize:11,color:colors.ink,fontWeight:'700'},total:{borderTopWidth:1,borderColor:colors.border,marginTop:7,paddingTop:13,flexDirection:'row',justifyContent:'space-between'},totalText:{fontSize:16,fontWeight:'900',color:colors.ink},footer:{position:'absolute',bottom:0,left:0,right:0,backgroundColor:'#fff',padding:15,paddingBottom:25,flexDirection:'row',alignItems:'center',gap:18,elevation:10},empty:{alignItems:'center',padding:30,marginTop:80},emptyTitle:{fontSize:18,fontWeight:'900',color:colors.ink,marginTop:15}});
