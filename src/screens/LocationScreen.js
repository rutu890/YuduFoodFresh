
import React, { useRef, useState, useEffect } from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Linking,
  Animated,
  Easing,
} from 'react-native';

import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';

import { colors } from '../constants/colors';
import { getCurrentDeliveryLocation } from '../services/locationService';

export default function LocationScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null);

  // Illustration animations
  const illustrationScale = useRef(new Animated.Value(0.65)).current;
  const illustrationOpacity = useRef(new Animated.Value(0)).current;
  const pinFloat = useRef(new Animated.Value(0)).current;
  const sparkleScale = useRef(new Animated.Value(0.4)).current;

  // Text animations
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const contentTranslate = useRef(new Animated.Value(20)).current;

  // Address card animation
  const addressOpacity = useRef(new Animated.Value(0)).current;
  const addressTranslate = useRef(new Animated.Value(20)).current;

  // Continue button animation
  const continueOpacity = useRef(new Animated.Value(0)).current;
  const continueScale = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    const entranceAnimation = Animated.parallel([
      Animated.spring(illustrationScale, {
        toValue: 1,
        friction: 5,
        tension: 45,
        useNativeDriver: true,
      }),

      Animated.timing(illustrationOpacity, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      }),

      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 750,
        delay: 250,
        useNativeDriver: true,
      }),

      Animated.spring(contentTranslate, {
        toValue: 0,
        friction: 7,
        delay: 250,
        useNativeDriver: true,
      }),

      Animated.spring(sparkleScale, {
        toValue: 1,
        friction: 5,
        tension: 45,
        delay: 450,
        useNativeDriver: true,
      }),
    ]);

    entranceAnimation.start();

    const floatingAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pinFloat, {
          toValue: 1,
          duration: 1800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),

        Animated.timing(pinFloat, {
          toValue: 0,
          duration: 1800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    floatingAnimation.start();

    return () => {
      entranceAnimation.stop();
      floatingAnimation.stop();
    };
  }, []);

  // Show detected address with animation
  const animateLocationResult = () => {
    addressOpacity.setValue(0);
    addressTranslate.setValue(20);

    continueOpacity.setValue(0);
    continueScale.setValue(0.9);

    Animated.parallel([
      Animated.timing(addressOpacity, {
        toValue: 1,
        duration: 450,
        useNativeDriver: true,
      }),

      Animated.spring(addressTranslate, {
        toValue: 0,
        friction: 7,
        useNativeDriver: true,
      }),

      Animated.timing(continueOpacity, {
        toValue: 1,
        duration: 450,
        delay: 150,
        useNativeDriver: true,
      }),

      Animated.spring(continueScale, {
        toValue: 1,
        friction: 6,
        delay: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleCurrentLocation = async () => {
    try {
      setLoading(true);
      setLocation(null);

      addressOpacity.setValue(0);
      continueOpacity.setValue(0);

      const result = await getCurrentDeliveryLocation();

      setLocation(result);
      animateLocationResult();
    } catch (error) {
      Alert.alert(
        'Unable to get location',
        error.message ||
          'Something went wrong while detecting your location.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Open Settings',
            onPress: () => Linking.openSettings(),
          },
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    if (!location) return;

    navigation.replace('Home', { location });
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Location Illustration */}
      <Animated.View
        style={[
          styles.illustrationWrapper,
          {
            opacity: illustrationOpacity,
            transform: [{ scale: illustrationScale }],
          },
        ]}
      >
        <LinearGradient
          colors={['#FFF0D8', '#E3F5FA', '#E5F5EC']}
          style={styles.illustration}
        >
          {/* Floating Location Pin */}
          <Animated.View
            style={[
              styles.locationCircle,
              {
                transform: [
                  {
                    translateY: pinFloat.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -13],
                    }),
                  },
                ],
              },
            ]}
          >
            <Text style={styles.locationIcon}>📍</Text>
          </Animated.View>

          {/* Animated Sparkles */}
          <Animated.Text
            style={[
              styles.sparkle,
              {
                transform: [{ scale: sparkleScale }],
              },
            ]}
          >
            ✦
          </Animated.Text>

          <Animated.Text
            style={[
              styles.smallSparkle,
              {
                transform: [{ scale: sparkleScale }],
              },
            ]}
          >
            ✧
          </Animated.Text>
        </LinearGradient>
      </Animated.View>

      {/* Heading and Description */}
      <Animated.View
        style={[
          styles.textContent,
          {
            opacity: contentOpacity,
            transform: [{ translateY: contentTranslate }],
          },
        ]}
      >
        <Text style={styles.title}>
          Where should we deliver?
        </Text>

        <Text style={styles.description}>
          Set your location to discover delicious food
          and get it delivered right to your doorstep.
        </Text>
      </Animated.View>

      {/* Detected Address */}
      {location && (
        <Animated.View
          style={[
            styles.addressCard,
            {
              opacity: addressOpacity,
              transform: [{ translateY: addressTranslate }],
            },
          ]}
        >
          <View style={styles.addressHeader}>
            <Text style={styles.addressLabel}>
              YOUR CURRENT LOCATION
            </Text>

            <Text style={styles.successIcon}>✓</Text>
          </View>

          <Text style={styles.addressText}>
            {location.formattedAddress}
          </Text>
        </Animated.View>
      )}

      {/* Current Location Button */}
      <TouchableOpacity
        style={[
          styles.button,
          loading && styles.disabledButton,
        ]}
        onPress={handleCurrentLocation}
        disabled={loading}
        activeOpacity={0.85}
      >
        {loading ? (
          <>
            <ActivityIndicator color={colors.white} />

            <Text style={styles.loadingText}>
              DETECTING LOCATION...
            </Text>
          </>
        ) : (
          <>
            <Text style={styles.buttonText}>
              {location
                ? 'DETECT LOCATION AGAIN'
                : 'USE MY CURRENT LOCATION'}
            </Text>

            <Text style={styles.buttonIcon}>⌖</Text>
          </>
        )}
      </TouchableOpacity>

      {/* Confirm Location */}
      {location && (
        <Animated.View
          style={{
            width: '100%',
            opacity: continueOpacity,
            transform: [{ scale: continueScale }],
          }}
        >
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinue}
            activeOpacity={0.85}
          >
            <Text style={styles.continueText}>
              CONFIRM LOCATION & CONTINUE
            </Text>

            <Text style={styles.continueArrow}>→</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* Manual Address */}
      <Animated.View
        style={{
          opacity: contentOpacity,
          transform: [{ translateY: contentTranslate }],
        }}
      >
        <TouchableOpacity
          style={styles.manualButton}
          onPress={() =>
            Alert.alert(
              'Manual address',
              'Manual address search will be added in the next step.'
            )
          }
          activeOpacity={0.7}
        >
          <Text style={styles.manualText}>
            Enter location manually
          </Text>
        </TouchableOpacity>
      </Animated.View>

      <Text style={styles.privacyText}>
        Your location helps us find restaurants and delivery
        options near you.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream,
    paddingHorizontal: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },

  illustrationWrapper: {
    width: 250,
    height: 250,
    marginBottom: 35,
  },

  illustration: {
    flex: 1,
    borderRadius: 42,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  locationCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#8A5A36',
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 7 },
  },

  locationIcon: {
    fontSize: 75,
  },

  sparkle: {
    position: 'absolute',
    top: 35,
    right: 40,
    fontSize: 35,
    color: colors.orange,
  },

  smallSparkle: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    fontSize: 28,
    color: colors.blue,
  },

  textContent: {
    alignItems: 'center',
  },

  title: {
    fontSize: 27,
    fontWeight: '900',
    color: colors.ink,
    textAlign: 'center',
  },

  description: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 23,
    textAlign: 'center',
    marginTop: 15,
  },

  addressCard: {
    width: '100%',
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 16,
    marginTop: 22,
    borderWidth: 1,
    borderColor: colors.border,
  },

  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  addressLabel: {
    color: colors.orange,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },

  successIcon: {
    color: colors.teal,
    fontSize: 18,
    fontWeight: '900',
  },

  addressText: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 21,
    marginTop: 8,
  },

  button: {
    width: '100%',
    height: 56,
    borderRadius: 18,
    backgroundColor: colors.orange,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 30,
  },

  disabledButton: {
    opacity: 0.7,
  },

  buttonText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  loadingText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '800',
    marginLeft: 10,
    letterSpacing: 0.5,
  },

  buttonIcon: {
    color: colors.white,
    fontSize: 23,
    marginLeft: 10,
  },

  continueButton: {
    width: '100%',
    height: 54,
    borderRadius: 18,
    backgroundColor: colors.teal,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    flexDirection: 'row',
  },

  continueText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.4,
  },

  continueArrow: {
    color: colors.white,
    fontSize: 21,
    position: 'absolute',
    right: 18,
  },

  manualButton: {
    marginTop: 20,
    padding: 10,
  },

  manualText: {
    color: colors.orangeDeep,
    fontSize: 14,
    fontWeight: '700',
  },

  privacyText: {
    color: colors.muted,
    fontSize: 10,
    lineHeight: 16,
    textAlign: 'center',
    marginTop: 16,
    paddingHorizontal: 12,
  },
});
