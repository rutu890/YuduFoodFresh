import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';

const tabs = [
  { name: 'Home', icon: '⌂', route: 'Home' },
  { name: 'Restaurants', icon: '♜', route: 'Restaurants' },
  { name: 'Cart', icon: '▢', route: 'Cart' },
  { name: 'Profile', icon: '♙', route: 'Profile' },
];

export default function BottomTabBar({ navigation, active }) {
  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const selected = active === tab.name;

        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.tab}
            activeOpacity={0.7}
            onPress={() => {
              if (tab.route === 'Cart' || tab.route === 'Profile') {
                return;
              }
              navigation.navigate(tab.route);
            }}
          >
            <View style={[styles.iconWrap, selected && styles.activeIconWrap]}>
              <Text style={[styles.icon, selected && styles.activeIcon]}>
                {tab.icon}
              </Text>
            </View>

            <Text style={[styles.label, selected && styles.activeLabel]}>
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
    minWidth: 43,
    height: 30,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeIconWrap: {
    backgroundColor: '#F0E8FF',
  },
  icon: {
    fontSize: 23,
    color: '#9991B2',
  },
  activeIcon: {
    color: '#6336E8',
    fontWeight: '900',
  },
  label: {
    color: '#9991B2',
    fontSize: 10,
  },
  activeLabel: {
    color: '#6336E8',
    fontWeight: '800',
  },
});