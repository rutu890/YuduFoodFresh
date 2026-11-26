
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

import { colors } from '../constants/colors';
import OrderTimeline from '../components/notifications/OrderTimeline';

export default function OrderUpdateDetailsScreen({ navigation, route }) {
  const notification = route.params?.notification || {};

  const {
    orderNumber = '#YDU10245',
    restaurantName = 'Spice Garden',
    orderStatus = 'Preparing',
    estimatedArrival = '12:45 PM',
    totalAmount = 349,
    items = [],
    timeline = [],
    deliveryPartner,
    otp,
  } = notification;

  const isOnTheWay =
    orderStatus.toLowerCase().includes('way') ||
    orderStatus.toLowerCase().includes('picked');

  const isDelivered = orderStatus.toLowerCase() === 'delivered';

  const handleCallPartner = async () => {
    if (!deliveryPartner?.phone) {
      Alert.alert('Contact unavailable', 'Delivery partner phone number is not available.');
      return;
    }

    const phoneUrl = `tel:${deliveryPartner.phone}`;

    try {
      const supported = await Linking.canOpenURL(phoneUrl);

      if (supported) {
        await Linking.openURL(phoneUrl);
      } else {
        Alert.alert('Unable to call', 'Calling is not supported on this device.');
      }
    } catch {
      Alert.alert('Unable to call', 'Please try again.');
    }
  };

  const handleTrackOrder = () => {
    navigation.navigate('OrderTracking', {
      order: notification,
      orderId: orderNumber,
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={21} color={colors.ink} />
        </TouchableOpacity>

        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Order updates</Text>
          <Text style={styles.headerSubtitle}>
            Stay informed about your delivery
          </Text>
        </View>

        <View style={styles.headerIcon}>
          <Ionicons name="receipt-outline" size={20} color={colors.orangeDeep} />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Current order status */}
        <View style={styles.statusCard}>
          <View style={styles.statusTop}>
            <View>
              <Text style={styles.overline}>ORDER {orderNumber}</Text>
              <Text style={styles.statusTitle}>{orderStatus}</Text>
              <Text style={styles.restaurantName}>{restaurantName}</Text>
            </View>

            <View style={styles.statusIcon}>
              <Ionicons
                name={
                  isDelivered
                    ? 'checkmark-done-circle'
                    : isOnTheWay
                      ? 'bicycle'
                      : 'restaurant'
                }
                size={30}
                color={colors.orangeDeep}
              />
            </View>
          </View>

          <View style={styles.etaBox}>
            <Ionicons name="time-outline" size={19} color={colors.teal} />
            <View style={{ flex: 1 }}>
              <Text style={styles.etaLabel}>
                {isDelivered ? 'Delivered successfully' : 'Estimated arrival'}
              </Text>
              <Text style={styles.etaTime}>
                {isDelivered ? 'Enjoy your meal!' : estimatedArrival}
              </Text>
            </View>
            <View style={styles.liveBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>
                {isDelivered ? 'COMPLETED' : 'UPDATING'}
              </Text>
            </View>
          </View>
        </View>

        {/* Timeline */}
        <View style={styles.card}>
          <View style={styles.cardHeading}>
            <Text style={styles.cardTitle}>Order timeline</Text>
            <Ionicons name="time-outline" size={18} color={colors.teal} />
          </View>

          {timeline.length > 0 ? (
            <OrderTimeline timeline={timeline} />
          ) : (
            <Text style={styles.emptyText}>
              Order timeline details are not available yet.
            </Text>
          )}
        </View>

        {/* Delivery partner */}
        {deliveryPartner && isOnTheWay && !isDelivered && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Your delivery partner</Text>

            <View style={styles.partnerRow}>
              <View style={styles.partnerAvatar}>
                <Ionicons name="person" size={25} color={colors.teal} />
              </View>

              <View style={styles.partnerInfo}>
                <Text style={styles.partnerName}>
                  {deliveryPartner.name}
                </Text>
                <Text style={styles.partnerVehicle}>
                  {deliveryPartner.vehicle} · {deliveryPartner.vehicleNumber}
                </Text>
                <View style={styles.ratingRow}>
                  <Ionicons name="star" size={12} color={colors.mango} />
                  <Text style={styles.ratingText}>
                    {deliveryPartner.rating} rating
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.callButton}
                onPress={handleCallPartner}
                activeOpacity={0.8}
              >
                <Ionicons name="call" size={18} color={colors.white} />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Delivery OTP */}
        {otp && isOnTheWay && !isDelivered && (
          <View style={styles.otpCard}>
            <View style={styles.otpHeading}>
              <Ionicons name="shield-checkmark" size={20} color={colors.orangeDeep} />
              <Text style={styles.otpTitle}>Delivery verification OTP</Text>
            </View>

            <Text style={styles.otpDescription}>
              Share this code with your delivery partner only when your order
              arrives at your doorstep.
            </Text>

            <View style={styles.otpDigits}>
              {String(otp).split('').map((digit, index) => (
                <View key={index} style={styles.otpDigit}>
                  <Text style={styles.otpDigitText}>{digit}</Text>
                </View>
              ))}
            </View>

            <Text style={styles.otpWarning}>
              Never share your OTP before receiving your order.
            </Text>
          </View>
        )}

        {/* Order items */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Order summary</Text>

          {items.map((item, index) => (
            <View key={`${item.name}-${index}`} style={styles.itemRow}>
              <Text style={styles.itemName}>
                {item.quantity} × {item.name}
              </Text>
              <Text style={styles.itemPrice}>
                ₹{item.price}
              </Text>
            </View>
          ))}

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Order total</Text>
            <Text style={styles.totalAmount}>₹{totalAmount}</Text>
          </View>
        </View>

        {/* Actions */}
        {!isDelivered && (
          <TouchableOpacity
            style={styles.trackButton}
            onPress={handleTrackOrder}
            activeOpacity={0.85}
          >
            <Ionicons name="navigate-outline" size={19} color={colors.white} />
            <Text style={styles.trackButtonText}>TRACK LIVE ORDER</Text>
            <Ionicons name="arrow-forward" size={18} color={colors.white} />
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.backToNotifications}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Text style={styles.backToNotificationsText}>
            Back to notifications
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: colors.white,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    width: 39,
    height: 39,
    borderRadius: 13,
    backgroundColor: colors.soft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.ink,
  },
  headerSubtitle: {
    color: colors.muted,
    fontSize: 10,
    marginTop: 3,
  },
  headerIcon: {
    width: 39,
    height: 39,
    borderRadius: 13,
    backgroundColor: colors.vanilla,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 15,
    paddingBottom: 35,
  },
  statusCard: {
    backgroundColor: colors.white,
    borderRadius: 19,
    padding: 17,
    marginBottom: 13,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statusTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  overline: {
    color: colors.muted,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.7,
  },
  statusTitle: {
    fontSize: 23,
    fontWeight: '900',
    color: colors.orangeDeep,
    marginTop: 5,
  },
  restaurantName: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 4,
  },
  statusIcon: {
    width: 55,
    height: 55,
    borderRadius: 18,
    backgroundColor: colors.vanilla,
    alignItems: 'center',
    justifyContent: 'center',
  },
  etaBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#EAF7F3',
    padding: 12,
    borderRadius: 13,
    marginTop: 17,
  },
  etaLabel: {
    fontSize: 10,
    color: colors.muted,
  },
  etaTime: {
    fontSize: 15,
    fontWeight: '900',
    color: colors.tealDeep,
    marginTop: 2,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.white,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 12,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.teal,
  },
  liveText: {
    fontSize: 8,
    fontWeight: '900',
    color: colors.tealDeep,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 16,
    marginBottom: 13,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 17,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: colors.ink,
    marginBottom: 14,
  },
  emptyText: {
    fontSize: 11,
    color: colors.muted,
  },
  partnerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
  },
  partnerAvatar: {
    width: 47,
    height: 47,
    borderRadius: 24,
    backgroundColor: '#EAF7F3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  partnerInfo: {
    flex: 1,
  },
  partnerName: {
    color: colors.ink,
    fontSize: 12,
    fontWeight: '900',
  },
  partnerVehicle: {
    color: colors.muted,
    fontSize: 9,
    marginTop: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  ratingText: {
    color: colors.muted,
    fontSize: 9,
  },
  callButton: {
    width: 39,
    height: 39,
    borderRadius: 20,
    backgroundColor: colors.teal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpCard: {
    backgroundColor: colors.vanilla,
    borderRadius: 18,
    padding: 17,
    marginBottom: 13,
    borderWidth: 1,
    borderColor: colors.mango,
  },
  otpHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  otpTitle: {
    color: colors.ink,
    fontSize: 13,
    fontWeight: '900',
  },
  otpDescription: {
    color: colors.muted,
    fontSize: 10,
    lineHeight: 16,
    marginTop: 9,
  },
  otpDigits: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginVertical: 15,
  },
  otpDigit: {
    width: 43,
    height: 48,
    borderRadius: 11,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.mango,
  },
  otpDigitText: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.orangeDeep,
  },
  otpWarning: {
    textAlign: 'center',
    color: colors.orangeDeep,
    fontSize: 9,
    fontWeight: '700',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 11,
  },
  itemName: {
    flex: 1,
    fontSize: 11,
    color: colors.muted,
  },
  itemPrice: {
    fontSize: 11,
    color: colors.ink,
    fontWeight: '700',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
    marginTop: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalLabel: {
    color: colors.ink,
    fontSize: 12,
    fontWeight: '900',
  },
  totalAmount: {
    color: colors.orangeDeep,
    fontSize: 14,
    fontWeight: '900',
  },
  trackButton: {
    minHeight: 53,
    borderRadius: 16,
    backgroundColor: colors.orange,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 17,
    marginTop: 3,
  },
  trackButtonText: {
    flex: 1,
    textAlign: 'center',
    color: colors.white,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  backToNotifications: {
    alignItems: 'center',
    paddingVertical: 17,
  },
  backToNotificationsText: {
    color: colors.tealDeep,
    fontSize: 11,
    fontWeight: '800',
  },
});
