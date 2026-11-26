
import React, { useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';

const getCategoryColors = (category) => {
  switch (category) {
    case 'Orders':
      return {
        foreground: colors.orangeDeep,
        background: colors.vanilla,
      };

    case 'Payments':
      return {
        foreground: colors.teal,
        background: '#E5F5F1',
      };

    case 'Delivery':
      return {
        foreground: colors.blue,
        background: '#E7F6FD',
      };

    case 'Offers':
      return {
        foreground: colors.watermelon,
        background: '#FFF0F0',
      };

    default:
      return {
        foreground: colors.orange,
        background: colors.cream,
      };
  }
};

export default function NotificationCard({ item, onPress }) {
  const scale = useRef(new Animated.Value(1)).current;
  const categoryColors = getCategoryColors(item.category);

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.985,
      useNativeDriver: true,
      friction: 7,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      friction: 7,
    }).start();
  };

  return (
    <Animated.View
      style={[
        styles.animatedContainer,
        { transform: [{ scale }] },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => onPress(item)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.card,
          item.unread && styles.unreadCard,
        ]}
      >
        <View
          style={[
            styles.iconWrap,
            { backgroundColor: categoryColors.background },
          ]}
        >
          <Ionicons
            name={item.icon}
            size={20}
            color={categoryColors.foreground}
          />
        </View>

        <View style={styles.content}>
          <View style={styles.titleRow}>
            <Text style={styles.title} numberOfLines={1}>
              {item.title}
            </Text>

            {item.unread && <View style={styles.unreadDot} />}

            <Text style={styles.time}>
              {item.time}
            </Text>
          </View>

          <Text style={styles.message}>
            {item.message}
          </Text>

          {item.couponCode ? (
            <View style={styles.coupon}>
              <Text style={styles.couponText}>
                {item.couponCode}
              </Text>
            </View>
          ) : null}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  animatedContainer: {
    marginBottom: 9,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.white,
    padding: 13,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 11,
  },
  unreadCard: {
    backgroundColor: '#FFFCF8',
    borderColor: colors.mango,
  },
  iconWrap: {
    width: 39,
    height: 39,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  title: {
    flex: 1,
    fontSize: 12,
    fontWeight: '900',
    color: colors.ink,
  },
  unreadDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.watermelon,
  },
  time: {
    fontSize: 9,
    color: colors.muted,
  },
  message: {
    fontSize: 10,
    lineHeight: 16,
    color: colors.muted,
    marginTop: 5,
  },
  coupon: {
    alignSelf: 'flex-start',
    backgroundColor: colors.vanilla,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
    marginTop: 6,
  },
  couponText: {
    fontSize: 9,
    fontWeight: '900',
    color: colors.orangeDeep,
  },
});
