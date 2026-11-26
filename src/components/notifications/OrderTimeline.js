
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';

export default function OrderTimeline({ timeline = [] }) {
  const pulse = useRef(new Animated.Value(1)).current;
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fade, {
      toValue: 1,
      duration: 450,
      useNativeDriver: true,
    }).start();

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.22,
          duration: 750,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 750,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    if (timeline.some((step) => step.active)) {
      loop.start();
    }

    return () => loop.stop();
  }, [timeline, pulse, fade]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fade,
          transform: [{
            translateY: fade.interpolate({
              inputRange: [0, 1],
              outputRange: [8, 0],
            }),
          }],
        },
      ]}
    >
      {timeline.map((step, index) => {
        const last = index === timeline.length - 1;

        return (
          <View key={step.id || `${step.title}-${index}`} style={styles.step}>
            <View style={styles.markerColumn}>
              <Animated.View
                style={[
                  styles.marker,
                  step.completed && styles.completedMarker,
                  step.active && styles.activeMarker,
                  step.active && { transform: [{ scale: pulse }] },
                ]}
              >
                {step.completed ? (
                  <Ionicons
                    name="checkmark"
                    size={13}
                    color={colors.white}
                  />
                ) : (
                  <View style={styles.pendingDot} />
                )}
              </Animated.View>

              {!last && (
                <View
                  style={[
                    styles.connector,
                    step.completed && styles.completedConnector,
                  ]}
                />
              )}
            </View>

            <View style={styles.stepContent}>
              <View style={styles.stepHeading}>
                <Text
                  style={[
                    styles.stepTitle,
                    step.active && styles.activeTitle,
                    !step.completed && styles.pendingTitle,
                  ]}
                >
                  {step.title}
                </Text>

                <Text style={styles.time}>{step.time}</Text>
              </View>

              <Text style={styles.description}>
                {step.description}
              </Text>

              {step.active && (
                <View style={styles.activeLabel}>
                  <Animated.View
                    style={[
                      styles.pulseDot,
                      { opacity: pulse },
                    ]}
                  />
                  <Text style={styles.activeLabelText}>
                    CURRENT STATUS
                  </Text>
                </View>
              )}
            </View>
          </View>
        );
      })}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 5,
  },
  step: {
    flexDirection: 'row',
    minHeight: 76,
  },
  markerColumn: {
    width: 30,
    alignItems: 'center',
  },
  marker: {
    width: 23,
    height: 23,
    borderRadius: 12,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  completedMarker: {
    backgroundColor: colors.teal,
  },
  activeMarker: {
    backgroundColor: colors.orange,
    borderWidth: 3,
    borderColor: colors.vanilla,
  },
  pendingDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.muted,
  },
  connector: {
    width: 2,
    flex: 1,
    backgroundColor: colors.border,
    marginVertical: 3,
  },
  completedConnector: {
    backgroundColor: colors.teal,
  },
  stepContent: {
    flex: 1,
    paddingLeft: 12,
    paddingBottom: 17,
  },
  stepHeading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 5,
  },
  stepTitle: {
    color: colors.ink,
    fontSize: 12,
    fontWeight: '800',
    flex: 1,
  },
  activeTitle: {
    color: colors.orangeDeep,
  },
  pendingTitle: {
    color: colors.muted,
  },
  time: {
    color: colors.muted,
    fontSize: 10,
  },
  description: {
    color: colors.muted,
    fontSize: 10,
    lineHeight: 16,
    marginTop: 4,
  },
  activeLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.vanilla,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginTop: 7,
    gap: 5,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.orange,
  },
  activeLabelText: {
    color: colors.orangeDeep,
    fontSize: 8,
    fontWeight: '900',
  },
});
