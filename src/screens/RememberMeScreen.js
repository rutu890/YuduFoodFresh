
import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, StatusBar,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { saveLoginPreference } from '../utils/authStorage';
import { getSavedAddresses, getActiveAddress } from '../utils/addressStorage';

export default function RememberMeScreen({ navigation, route }) {
  const user = route.params?.user;
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    if (!user || loading) return;

    try {
      setLoading(true);

      await saveLoginPreference(user, remember);

      const [addresses, activeAddress] = await Promise.all([
        getSavedAddresses(),
        getActiveAddress(),
      ]);

      if (activeAddress || addresses.length > 0) {
        const selectedAddress = activeAddress || addresses[0];

        navigation.reset({
          index: 0,
          routes: [{ name: 'Home', params: { location: selectedAddress, user } }],
        });
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Location', params: { user } }],
        });
      }
    } catch (error) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Location', params: { user } }],
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.cream} />

      <View style={styles.iconCircle}>
        <Ionicons name="shield-checkmark-outline" size={38} color={colors.teal} />
      </View>

      <Text style={styles.eyebrow}>ONE LAST STEP</Text>
      <Text style={styles.title}>Stay signed in?</Text>
      <Text style={styles.description}>
        Choose whether YUDU Food should remember your login on this device.
      </Text>

      <TouchableOpacity
        style={[styles.option, remember && styles.optionSelected]}
        onPress={() => setRemember(true)}
        activeOpacity={0.8}
      >
        <View style={styles.optionIcon}>
          <Ionicons name="phone-portrait-outline" size={22} color={colors.teal} />
        </View>
        <View style={styles.optionText}>
          <Text style={styles.optionTitle}>Remember me</Text>
          <Text style={styles.optionDescription}>
            Stay signed in when you reopen the app.
          </Text>
        </View>
        <Ionicons
          name={remember ? 'radio-button-on' : 'radio-button-off'}
          size={22}
          color={remember ? colors.orange : colors.muted}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.option, !remember && styles.optionSelected]}
        onPress={() => setRemember(false)}
        activeOpacity={0.8}
      >
        <View style={styles.optionIcon}>
          <Ionicons name="log-in-outline" size={22} color={colors.teal} />
        </View>
        <View style={styles.optionText}>
          <Text style={styles.optionTitle}>Don't remember me</Text>
          <Text style={styles.optionDescription}>
            Ask me to log in again next time.
          </Text>
        </View>
        <Ionicons
          name={!remember ? 'radio-button-on' : 'radio-button-off'}
          size={22}
          color={!remember ? colors.orange : colors.muted}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.7 }]}
        onPress={handleContinue}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={colors.white} />
        ) : (
          <>
            <Text style={styles.buttonText}>CONTINUE TO YUDU</Text>
            <Ionicons name="arrow-forward" size={19} color={colors.white} />
          </>
        )}
      </TouchableOpacity>

      <Text style={styles.note}>
        You can change this preference later. This mock login is for app testing only.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: colors.cream,
    padding: 24, justifyContent: 'center',
  },
  iconCircle: {
    width: 76, height: 76, borderRadius: 25,
    backgroundColor: colors.white, alignItems: 'center',
    justifyContent: 'center', marginBottom: 25,
  },
  eyebrow: { color: colors.orange, fontSize: 11, fontWeight: '900', letterSpacing: 2 },
  title: { color: colors.ink, fontSize: 30, fontWeight: '900', marginTop: 10 },
  description: { color: colors.muted, fontSize: 13, lineHeight: 21, marginTop: 9, marginBottom: 25 },
  option: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: colors.white, borderWidth: 1,
    borderColor: colors.border, borderRadius: 16,
    padding: 14, marginBottom: 12,
  },
  optionSelected: { borderColor: colors.orange, borderWidth: 1.5 },
  optionIcon: {
    width: 42, height: 42, borderRadius: 13,
    backgroundColor: colors.cream, alignItems: 'center',
    justifyContent: 'center',
  },
  optionText: { flex: 1 },
  optionTitle: { color: colors.ink, fontSize: 13, fontWeight: '900' },
  optionDescription: { color: colors.muted, fontSize: 10, marginTop: 4 },
  button: {
    height: 55, borderRadius: 16, backgroundColor: colors.orange,
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 12, marginTop: 18,
  },
  buttonText: { color: colors.white, fontWeight: '900', fontSize: 13 },
  note: { color: colors.muted, fontSize: 10, lineHeight: 16, marginTop: 16, textAlign: 'center' },
});
