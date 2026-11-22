import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppHeader from '../components/AppHeader';
import PrimaryButton from '../components/PrimaryButton';
import { useShop } from '../context/ShopContext';
import { colors } from '../constants/colors';

const methods=['UPI','Google Pay','PhonePe','Paytm','Credit / Debit Cards','Net Banking','Cash on Delivery'];

export default function CheckoutScreen({navigation}) {
 const {cart,placeOrder}=useShop();
 const [address,setAddress]=useState('Flat 42, Road No. 3, Madhapur, Hyderabad – 500081');
 const [instruction,setInstruction]=useState('');
 const [payment,setPayment]=useState('Google Pay');
 const subtotal=cart.reduce((n,x)=>n+x.price*x.quantity,0);
 const total=Math.max(0,subtotal+(cart.length?68:0)-(cart.length?Math.min(100,subtotal):0));
 const submit=()=>{
   if(!cart.length){Alert.alert('Your cart is empty','Add items before placing an order.');return;}
   if(!address.trim()){Alert.alert('Delivery address required','Please enter your delivery address.');return;}
   placeOrder(payment,address);
   navigation.replace('OrderTracking');
 };
 return <View style={styles.screen}>
  <AppHeader title="Checkout" subtitle="Delivering in 30–35 min" navigation={navigation}/>
  <ScrollView contentContainerStyle={styles.content}>
   <View style={styles.card}><View style={styles.row}><Ionicons name="home" size={19} color={colors.orange}/><Text style={styles.heading}>Deliver to · Home</Text><TouchableOpacity onPress={()=>Alert.alert('Delivery address','Edit the address below.') }><Text style={styles.change}>Change</Text></TouchableOpacity></View><TextInput multiline value={address} onChangeText={setAddress} style={styles.address}/></View>
   <View style={styles.card}><Text style={styles.heading}>Delivery instructions</Text><View style={styles.pills}>{['Leave at door',"Don't ring bell",'Call me'].map(x=><TouchableOpacity key={x} onPress={()=>setInstruction(x)} style={[styles.pill,instruction===x&&styles.pillActive]}><Text style={[styles.pillText,instruction===x&&styles.pillTextActive]}>{x}</Text></TouchableOpacity>)}</View></View>
   <View style={styles.card}><Text style={styles.heading}>Payment method</Text>{methods.map(m=><TouchableOpacity key={m} onPress={()=>setPayment(m)} style={styles.method}><View style={styles.methodIcon}><Text style={styles.methodInitial}>{m.slice(0,1)}</Text></View><Text style={styles.methodText}>{m}</Text><Ionicons name={payment===m?'radio-button-on':'radio-button-off'} color={payment===m?colors.teal:'#A9A1AC'} size={20}/></TouchableOpacity>)}</View>
   <View style={styles.card}><Text style={styles.heading}>Order summary · {cart.length} items</Text><Text style={styles.summary}>Items ₹{subtotal}  ·  Delivery ₹{cart.length?25:0}  ·  Taxes ₹{cart.length?43:0}</Text><View style={styles.total}><Text style={styles.heading}>To pay</Text><Text style={styles.heading}>₹{total}</Text></View></View>
  </ScrollView>
  <View style={styles.footer}><View><Text style={styles.small}>Total</Text><Text style={styles.totalPrice}>₹{total}</Text></View><PrimaryButton title="Place order →" onPress={submit} style={{flex:1}}/></View>
 </View>;
}
const styles=StyleSheet.create({screen:{flex:1,backgroundColor:colors.soft,paddingTop:42},content:{padding:15,paddingBottom:120,gap:12},card:{backgroundColor:'#fff',borderRadius:16,padding:15},row:{flexDirection:'row',alignItems:'center',gap:9},heading:{fontSize:13,fontWeight:'900',color:colors.ink,flex:1},change:{fontSize:11,color:colors.teal,fontWeight:'900'},address:{fontSize:11,color:colors.muted,marginTop:9,minHeight:45,textAlignVertical:'top'},pills:{flexDirection:'row',flexWrap:'wrap',gap:7,marginTop:12},pill:{borderWidth:1,borderColor:colors.border,borderRadius:18,paddingHorizontal:10,paddingVertical:8},pillActive:{borderColor:colors.teal,backgroundColor:'#E5F5F2'},pillText:{fontSize:10,color:colors.muted},pillTextActive:{color:colors.teal,fontWeight:'900'},method:{flexDirection:'row',alignItems:'center',paddingVertical:10,borderBottomWidth:1,borderColor:'#F5F0EC',gap:10},methodIcon:{width:27,height:27,borderRadius:8,backgroundColor:'#F0E8FF',alignItems:'center',justifyContent:'center'},methodInitial:{fontSize:11,color:colors.teal,fontWeight:'900'},methodText:{fontSize:11,color:colors.ink,flex:1},summary:{fontSize:10,color:colors.muted,marginTop:12},total:{borderTopWidth:1,borderColor:colors.border,marginTop:12,paddingTop:12,flexDirection:'row',justifyContent:'space-between'},footer:{position:'absolute',bottom:0,left:0,right:0,backgroundColor:'#fff',padding:15,paddingBottom:25,flexDirection:'row',alignItems:'center',gap:18},small:{fontSize:10,color:colors.muted},totalPrice:{fontSize:17,fontWeight:'900',color:colors.ink,marginTop:3}});
