
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, gradients } from '../constants/colors';

export default function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.cream} />

      <View style={styles.top}>
        <LinearGradient colors={gradients.hero} style={styles.logo}>
          <Ionicons name="fast-food" size={43} color={colors.white} />
        </LinearGradient>
        <Text style={styles.brand}>YUDU FOOD</Text>
        <Text style={styles.tagline}>Good food. Great mood.</Text>
      </View>

      <View style={styles.illustration}>
        <Text style={styles.foodEmoji}>🍔 🍕 🥗</Text>
        <Text style={styles.heading}>Cravings?</Text>
        <Text style={styles.headingAccent}>We've got you.</Text>
        <Text style={styles.description}>
          Discover delicious food from restaurants around you and get it
          delivered to your doorstep.
        </Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate('Signup')}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryText}>CREATE ACCOUNT</Text>
          <Ionicons name="arrow-forward" size={19} color={colors.white} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('Login')}
          activeOpacity={0.85}
        >
          <Text style={styles.secondaryText}>I ALREADY HAVE AN ACCOUNT</Text>
        </TouchableOpacity>

        <Text style={styles.terms}>
          By continuing, you agree to our Terms & Privacy Policy.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream,
    paddingHorizontal: 25,
    justifyContent: 'space-between',
    paddingTop: 65,
    paddingBottom: 28,
  },
  top: { alignItems: 'center' },
  logo: {
    width: 78,
    height: 78,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brand: {
    color: colors.ink,
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 2,
    marginTop: 12,
  },
  tagline: { color: colors.muted, fontSize: 12, marginTop: 4 },
  illustration: { alignItems: 'center', paddingHorizontal: 5 },
  foodEmoji: { fontSize: 48, marginBottom: 25 },
  heading: {
    color: colors.ink,
    fontSize: 32,
    fontWeight: '900',
    textAlign: 'center',
  },
  headingAccent: {
    color: colors.orange,
    fontSize: 32,
    fontWeight: '900',
    textAlign: 'center',
  },
  description: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 23,
    textAlign: 'center',
    marginTop: 14,
  },
  actions: { gap: 12 },
  primaryButton: {
    height: 55,
    borderRadius: 16,
    backgroundColor: colors.orange,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  primaryText: { color: colors.white, fontWeight: '900', fontSize: 13 },
  secondaryButton: {
    height: 53,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.orange,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  secondaryText: { color: colors.orangeDeep, fontWeight: '900', fontSize: 12 },
  terms: {
    color: colors.muted,
    fontSize: 10,
    textAlign: 'center',
    marginTop: 8,
  },
});
