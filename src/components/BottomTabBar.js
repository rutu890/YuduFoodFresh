
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';

const tabs = [
  {
    name: 'Home',
    route: 'Home',
    icon: 'home-outline',
    activeIcon: 'home',
  },
  {
    name: 'Restaurants',
    route: 'Restaurants',
    icon: 'restaurant-outline',
    activeIcon: 'restaurant',
  },
  {
    name: 'Cart',
    route: 'Cart',
    icon: 'bag-handle-outline',
    activeIcon: 'bag-handle',
  },
  {
    name: 'Offers',
    route: 'Offers',
    icon: 'pricetag-outline',
    activeIcon: 'pricetag',
  },
];

export default function BottomTabBar({
  navigation,
  active,
  cartCount = 0,
}) {
  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const selected = active === tab.name;

        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.tab}
            activeOpacity={0.7}
            onPress={() => navigation.navigate(tab.route)}
          >
            <View
              style={[
                styles.iconWrap,
                selected && styles.activeIconWrap,
              ]}
            >
              <Ionicons
                name={selected ? tab.activeIcon : tab.icon}
                size={21}
                color={selected ? colors.teal : '#999999'}
              />

              {tab.name === 'Cart' && cartCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {cartCount > 9 ? '9+' : cartCount}
                  </Text>
                </View>
              )}
            </View>

            <Text
              style={[
                styles.label,
                selected && styles.activeLabel,
              ]}
            >
              {tab.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 76,
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingBottom: 5,
    elevation: 12,
  },

  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },

  iconWrap: {
    width: 43,
    height: 32,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },

  activeIconWrap: {
    backgroundColor: '#E8F7F4',
  },

  label: {
    color: '#999999',
    fontSize: 10,
    fontWeight: '500',
  },

  activeLabel: {
    color: colors.teal,
    fontWeight: '800',
  },

  badge: {
    position: 'absolute',
    right: 1,
    top: -3,
    minWidth: 16,
    height: 16,
    borderRadius: 9,
    backgroundColor: colors.watermelon,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.white,
  },

  badgeText: {
    color: colors.white,
    fontSize: 9,
    fontWeight: '800',
  },
});
