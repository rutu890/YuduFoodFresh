
import React, { useRef, useState, useEffect } from 'react';

import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Animated,
  StatusBar,
  useWindowDimensions,
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

import { colors } from '../constants/colors';
import { onboardingSlides } from '../constants/onboardingSlides';

// const { width, height } = Dimensions.get('window');

export default function OnboardingScreen({ navigation }) {
  const listRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Text animation
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const contentTranslate = useRef(new Animated.Value(20)).current;

  // Food illustration animation
  const illustrationScale = useRef(new Animated.Value(0.65)).current;
  const illustrationOpacity = useRef(new Animated.Value(0)).current;
  const illustrationFloat = useRef(new Animated.Value(0)).current;

  const { width, height } = useWindowDimensions();

  // Sparkle animation
  const sparkleScale = useRef(new Animated.Value(0.5)).current;

  const isLastSlide = activeIndex === onboardingSlides.length - 1;

  useEffect(() => {
    // Reset animation values when slide changes
    contentOpacity.setValue(0);
    contentTranslate.setValue(20);

    illustrationScale.setValue(0.65);
    illustrationOpacity.setValue(0);
    illustrationFloat.setValue(0);

    sparkleScale.setValue(0.5);

    // Entrance animation
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
        duration: 700,
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
        delay: 400,
        useNativeDriver: true,
      }),
    ]);

    entranceAnimation.start();

    // Continuous floating animation
    const floatingAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(illustrationFloat, {
          toValue: 1,
          duration: 1800,
          useNativeDriver: true,
        }),

        Animated.timing(illustrationFloat, {
          toValue: 0,
          duration: 1800,
          useNativeDriver: true,
        }),
      ])
    );

    floatingAnimation.start();

    return () => {
      entranceAnimation.stop();
      floatingAnimation.stop();
    };
  }, [
    activeIndex,
    contentOpacity,
    contentTranslate,
    illustrationScale,
    illustrationOpacity,
    illustrationFloat,
    sparkleScale,
  ]);

  const handleScroll = (event) => {
    const index = Math.round(
      event.nativeEvent.contentOffset.x / width
    );

    if (
      index !== activeIndex &&
      index >= 0 &&
      index < onboardingSlides.length
    ) {
      setActiveIndex(index);
    }
  };

  const handleNext = () => {
    if (isLastSlide) {
      navigation.replace('Location');
      return;
    }

    const nextIndex = activeIndex + 1;

    setActiveIndex(nextIndex);

    listRef.current?.scrollToIndex({
      index: nextIndex,
      animated: true,
      viewPosition: 0,
    });
  };

  const handleSkip = () => {
    navigation.replace('Location');
  };

  const handlePagination = (index) => {
    if (index < 0 || index >= onboardingSlides.length) return;

    setActiveIndex(index);

    listRef.current?.scrollToIndex({
      index,
      animated: true,
      viewPosition: 0,
    });
  };

  const renderSlide = ({ item, index }) => {
    return (
      <View style={styles.slide}>
        {/* 3D Food Illustration */}
        <View style={styles.illustrationWrapper}>
          <LinearGradient
            colors={
              index === 0
                ? ['#FFE1C7', '#FFF0D8', '#DDF5FA']
                : index === 1
                  ? ['#FFE1E1', '#FFF0E9', '#E4F5E9']
                  : ['#DDF4ED', '#EAF5FF', '#FFF0D8']
            }
            style={styles.illustration}
          >
            {/* Animated Food Image */}
            <Animated.View
              style={[
                styles.foodImageContainer,
                {
                  opacity: illustrationOpacity,
                  transform: [
                    { scale: illustrationScale },
                    {
                      translateY: illustrationFloat.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, -13],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Animated.Image
                source={item.image}
                style={styles.foodIllustration}
                resizeMode="contain"
              />
            </Animated.View>

            {/* Animated Sparkles */}
            <Animated.Text
              style={[
                styles.sparkleOne,
                {
                  transform: [{ scale: sparkleScale }],
                },
              ]}
            >
              ✦
            </Animated.Text>

            <Animated.Text
              style={[
                styles.sparkleTwo,
                {
                  transform: [{ scale: sparkleScale }],
                },
              ]}
            >
              ✧
            </Animated.Text>

            <Animated.Text
              style={[
                styles.sparkleThree,
                {
                  transform: [{ scale: sparkleScale }],
                },
              ]}
            >
              ✦
            </Animated.Text>
          </LinearGradient>
        </View>

        {/* Animated Text Content */}
        <Animated.View
          style={[
            styles.content,
            {
              opacity: contentOpacity,
              transform: [
                { translateY: contentTranslate },
              ],
            },
          ]}
        >
          <Text style={styles.eyebrow}>
            {item.eyebrow}
          </Text>

          <Text style={styles.title}>
            {item.title}
          </Text>

          <Text style={styles.description}>
            {item.description}
          </Text>
        </Animated.View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={colors.cream}
      />

      {/* Skip Button */}
      {!isLastSlide && (
        <TouchableOpacity
          style={styles.skipButton}
          onPress={handleSkip}
          activeOpacity={0.7}
        >
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      )}

      {/* Swipeable Slides */}
      <FlatList
        ref={listRef}
        data={onboardingSlides}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onMomentumScrollEnd={handleScroll}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
        onScrollToIndexFailed={(info) => {
          listRef.current?.scrollToOffset({
            offset: info.index * width,
            animated: true,
          });
        }}
        extraData={activeIndex}
      />

      {/* Bottom Controls */}
      <View style={styles.bottomSection}>
        {/* Pagination */}
        <View style={styles.pagination}>
          {onboardingSlides.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => handlePagination(index)}
              activeOpacity={0.8}
              style={[
                styles.dot,
                activeIndex === index
                  ? styles.activeDot
                  : styles.inactiveDot,
              ]}
            />
          ))}
        </View>

        {/* Next / Get Started Button */}
        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNext}
          activeOpacity={0.85}
        >
          <Text style={styles.nextButtonText}>
            {isLastSlide ? "LET'S GET STARTED" : 'NEXT'}
          </Text>

          <Text style={styles.arrow}>→</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          Delicious moments start here!
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream,
  },

  skipButton: {
    position: 'absolute',
    top: 12,
    right: 25,
    zIndex: 10,
    padding: 10,
  },

  skipText: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: '700',
  },

 slide: {
  flex: 1,
  width: '100%',
},

illustrationWrapper: {
  height: '46%',
  minHeight: 220,
  paddingHorizontal: 22,
  paddingTop: 45,
},

  illustration: {
    flex: 1,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  foodImageContainer: {
    width: '90%',
    height: '90%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  foodIllustration: {
    width: '100%',
    height: '100%',
  },

  sparkleOne: {
    position: 'absolute',
    top: 35,
    right: 55,
    fontSize: 35,
    color: colors.orange,
  },

  sparkleTwo: {
    position: 'absolute',
    bottom: 35,
    left: 45,
    fontSize: 27,
    color: colors.blue,
  },

  sparkleThree: {
    position: 'absolute',
    top: '20%',
    left: '40%',
    fontSize: 19,
    color: colors.orange,
  },

  content: {
    paddingHorizontal: 28,
    paddingTop: 27,
    alignItems: 'center',
  },

  eyebrow: {
    color: colors.orange,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
    textAlign: 'center',
  },

  title: {
    color: colors.ink,
    fontSize: 32,
    fontWeight: '900',
    lineHeight: 40,
    textAlign: 'center',
    marginTop: 16,
  },

  description: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 23,
    textAlign: 'center',
    marginTop: 14,
    paddingHorizontal: 3,
  },

  bottomSection: {
    paddingHorizontal: 28,
    paddingBottom: 18,
    alignItems: 'center',
  },

  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24,
  },

  dot: {
    height: 8,
    borderRadius: 5,
  },

  activeDot: {
    width: 25,
    backgroundColor: colors.orange,
  },

  inactiveDot: {
    width: 8,
    backgroundColor: '#E7CFC1',
  },

  nextButton: {
    height: 56,
    width: '100%',
    borderRadius: 18,
    backgroundColor: colors.orange,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  nextButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1,
  },

  arrow: {
    position: 'absolute',
    right: 22,
    color: colors.white,
    fontSize: 23,
  },

  footerText: {
    color: colors.muted,
    fontSize: 11,
    marginTop: 14,
  },
});
