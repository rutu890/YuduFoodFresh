
import React, { useEffect, useRef } from 'react';

import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  Easing,
} from 'react-native';

import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';

import YuduLogo from '../components/YuduLogo';
import { colors, gradients } from '../constants/colors';
import {
  hasCompletedOnboarding,
  getRememberedSession,
} from '../utils/authStorage';

import {
  getSavedAddresses,
  getActiveAddress,
} from '../utils/addressStorage';

const { width, height } = Dimensions.get('window');

export default function SplashScreen({ navigation }) {
  const logoScale = useRef(new Animated.Value(0.65)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const foodFloat = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 5,
        tension: 45,
        useNativeDriver: true,
      }),

      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      }),

      Animated.timing(taglineOpacity, {
        toValue: 1,
        duration: 1000,
        delay: 500,
        useNativeDriver: true,
      }),
    ]).start();

    const floatAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(foodFloat, {
          toValue: 1,
          duration: 1800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),

        Animated.timing(foodFloat, {
          toValue: 0,
          duration: 1800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );

    floatAnimation.start();

   const timer = setTimeout(async () => {
  try {
    const session = await getRememberedSession();

    if (session) {
      const [activeAddress, savedAddresses] = await Promise.all([
        getActiveAddress(),
        getSavedAddresses(),
      ]);

      const selectedAddress =
        activeAddress || savedAddresses[0] || null;

      if (selectedAddress) {
        navigation.replace('Home', {
          location: selectedAddress,
          user: session,
        });
      } else {
        navigation.replace('Location', { user: session });
      }

      return;
    }

    const onboardingCompleted = await hasCompletedOnboarding();

    navigation.replace(
      onboardingCompleted ? 'Welcome' : 'Onboarding'
    );
  } catch (error) {
    navigation.replace('Onboarding');
  }
}, 4500);

return () => clearTimeout(timer);

    return () => {
      clearTimeout(timer);
      floatAnimation.stop();
    };
  }, [navigation, foodFloat, logoScale, logoOpacity, taglineOpacity]);

  const floatY = foodFloat.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -13],
  });

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <LinearGradient
        colors={gradients.vibrant}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.circleOne} />
      <View style={styles.circleTwo} />
      <View style={styles.circleThree} />
      <View style={styles.circleFour} />

      <Animated.View
        style={[
          styles.foodDecoration,
          styles.foodTopLeft,
          { transform: [{ translateY: floatY }] },
        ]}
      >
        <View style={styles.plate}>
          <View style={styles.plateInner} />
        </View>
      </Animated.View>

      <Animated.View
        style={[
          styles.foodDecoration,
          styles.foodTopRight,
          { transform: [{ translateY: floatY }] },
        ]}
      >
        <View style={styles.orangeShape} />
      </Animated.View>

      <Animated.View
        style={[
          styles.foodDecoration,
          styles.foodBottomLeft,
          { transform: [{ translateY: floatY }] },
        ]}
      >
        <View style={styles.greenShape} />
      </Animated.View>

      <Animated.View
        style={[
          styles.foodDecoration,
          styles.foodBottomRight,
          { transform: [{ translateY: floatY }] },
        ]}
      >
        <View style={styles.pinkShape} />
      </Animated.View>

      <View style={styles.content}>
        <Animated.View
          style={{
            opacity: logoOpacity,
            transform: [{ scale: logoScale }],
          }}
        >
          <YuduLogo size={104} />
        </Animated.View>

        <Animated.View
          style={[
            styles.taglineContainer,
            { opacity: taglineOpacity },
          ]}
        >
          <Text style={styles.tagline}>
            Good food. Happy mood.
          </Text>

          <Text style={styles.subTagline}>
            Your favourite flavours, delivered with love.
          </Text>
        </Animated.View>
      </View>

      <View style={styles.footer}>
        <View style={styles.loadingTrack}>
          <View style={styles.loadingProgress} />
        </View>

        <Text style={styles.footerText}>
          MADE FOR YOUR CRAVINGS
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },

  circleOne: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(255,255,255,0.07)',
    top: -100,
    right: -100,
  },

  circleTwo: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(255,255,255,0.07)',
    bottom: -70,
    left: -80,
  },

  circleThree: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
    top: height * 0.22,
    left: -45,
  },

  circleFour: {
    position: 'absolute',
    width: 75,
    height: 75,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    bottom: height * 0.2,
    right: -25,
  },

  foodDecoration: {
    position: 'absolute',
    width: 75,
    height: 75,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  foodTopLeft: {
    top: height * 0.19,
    left: width * 0.12,
  },

  foodTopRight: {
    top: height * 0.25,
    right: width * 0.12,
  },

  foodBottomLeft: {
    bottom: height * 0.23,
    left: width * 0.1,
  },

  foodBottomRight: {
    bottom: height * 0.19,
    right: width * 0.1,
  },

  plate: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },

  plateInner: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 5,
    borderColor: colors.mango,
  },

  orangeShape: {
    width: 38,
    height: 38,
    borderRadius: 13,
    backgroundColor: colors.mango,
    transform: [{ rotate: '35deg' }],
  },

  greenShape: {
    width: 40,
    height: 40,
    borderRadius: 25,
    backgroundColor: '#75E1C5',
  },

  pinkShape: {
    width: 40,
    height: 40,
    borderRadius: 15,
    backgroundColor: '#FFB0C2',
    transform: [{ rotate: '25deg' }],
  },

  content: {
    alignItems: 'center',
    marginTop: -15,
  },

  taglineContainer: {
    alignItems: 'center',
    marginTop: 35,
    paddingHorizontal: 30,
  },

  tagline: {
    fontSize: 19,
    fontWeight: '800',
    color: colors.white,
  },

  subTagline: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.88)',
    marginTop: 10,
    textAlign: 'center',
  },

  footer: {
    position: 'absolute',
    bottom: 48,
    alignItems: 'center',
  },

  loadingTrack: {
    width: 125,
    height: 4,
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,0.3)',
    overflow: 'hidden',
  },

  loadingProgress: {
    width: '65%',
    height: 4,
    borderRadius: 5,
    backgroundColor: colors.white,
  },

  footerText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 2,
    marginTop: 14,
  },
});
