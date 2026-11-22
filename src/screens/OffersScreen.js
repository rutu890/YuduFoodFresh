
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../constants/colors';
import BottomTabBar from '../components/BottomTabBar';

const offers = [
  {
    id: '1',
    title: 'FLAT 50% OFF',
    subtitle: 'Up to ₹100 on your first order',
    code: 'WELCOME50',
    colors: ['#E94708', '#FF7A32'],
  },
  {
    id: '2',
    title: '20% OFF',
    subtitle: 'On selected restaurant orders',
    code: 'YUDU20',
    colors: ['#008C89', '#00A89B'],
  },
  {
    id: '3',
    title: 'FREE DELIVERY',
    subtitle: 'On orders above ₹299',
    code: 'FREEDEL',
    colors: ['#6336E8', '#9270F4'],
  },
];

export default function OffersScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>

        <View>
          <Text style={styles.heading}>Offers & rewards</Text>
          <Text style={styles.subtitle}>Delicious deals, just for you</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.sectionTitle}>Available offers</Text>

        {offers.map((offer) => (
          <LinearGradient
            key={offer.id}
            colors={offer.colors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.offerCard}
          >
            <View style={styles.offerCircle} />
            <View style={styles.offerContent}>
              <Text style={styles.offerTitle}>{offer.title}</Text>
              <Text style={styles.offerSubtitle}>{offer.subtitle}</Text>

              <View style={styles.codeRow}>
                <View style={styles.codeBox}>
                  <Text style={styles.codeText}>CODE: {offer.code}</Text>
                </View>
                <TouchableOpacity
                  style={styles.useButton}
                  activeOpacity={0.8}
                  onPress={() => navigation.navigate('Restaurants')}
                >
                  <Text style={styles.useButtonText}>Explore food →</Text>
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        ))}

        <View style={styles.noteCard}>
          <Text style={styles.noteTitle}>A little tip for you!</Text>
          <Text style={styles.noteText}>
            Check the offer terms before applying a coupon at checkout.
          </Text>
        </View>
      </ScrollView>

      <BottomTabBar navigation={navigation} active="Offers" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white, paddingTop: 48 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    gap: 12,
    marginBottom: 22,
  },
  backButton: {
    width: 37,
    height: 37,
    borderRadius: 20,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  backText: { fontSize: 29, color: '#241B3D', lineHeight: 32 },
  heading: { fontSize: 20, fontWeight: '900', color: '#241B3D' },
  subtitle: { fontSize: 11, color: colors.muted, marginTop: 3 },
  content: { paddingHorizontal: 18, paddingBottom: 25 },
  sectionTitle: {
    color: '#241B3D',
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 14,
  },
  offerCard: {
    minHeight: 145,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 15,
    justifyContent: 'center',
  },
  offerCircle: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 80,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.35)',
    right: -32,
    top: -25,
  },
  offerContent: { padding: 18 },
  offerTitle: { color: colors.white, fontSize: 23, fontWeight: '900' },
  offerSubtitle: { color: colors.white, fontSize: 11, marginTop: 4 },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 15,
    gap: 8,
  },
  codeBox: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 9,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.55)',
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  codeText: { color: colors.white, fontSize: 10, fontWeight: '900' },
  useButton: {
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 15,
  },
  useButtonText: { color: '#6336E8', fontSize: 10, fontWeight: '900' },
  noteCard: {
    padding: 16,
    backgroundColor: colors.cream,
    borderRadius: 15,
    marginTop: 5,
  },
  noteTitle: { color: '#241B3D', fontSize: 13, fontWeight: '900' },
  noteText: { color: colors.muted, fontSize: 11, marginTop: 5, lineHeight: 17 },
});
