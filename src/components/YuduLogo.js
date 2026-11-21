
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';

export default function YuduLogo({
  size = 100,
  dark = false,
}) {
  return (
    <View style={styles.container}>
      <View
        style={[
          styles.logoBox,
          {
            width: size,
            height: size,
            borderRadius: size * 0.3,
          },
        ]}
      >
        <Text
          style={[
            styles.logoLetter,
            { fontSize: size * 0.66 },
          ]}
        >
          Y
        </Text>

        <View
          style={[
            styles.logoDot,
            {
              width: size * 0.1,
              height: size * 0.1,
              borderRadius: size * 0.05,
              right: size * 0.2,
              top: size * 0.18,
            },
          ]}
        />
      </View>

      <Text
        style={[
          styles.brandName,
          { color: dark ? colors.ink : colors.white },
        ]}
      >
        YUDU
      </Text>

      <Text
        style={[
          styles.brandSub,
          { color: dark ? colors.ink : colors.white },
        ]}
      >
        FOOD
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },

  logoBox: {
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 12,
    shadowColor: '#6D1B12',
    shadowOpacity: 0.22,
    shadowRadius: 15,
    shadowOffset: {
      width: 0,
      height: 8,
    },
  },

  logoLetter: {
    color: colors.orange,
    fontWeight: '900',
  },

  logoDot: {
    position: 'absolute',
    backgroundColor: colors.blue,
  },

  brandName: {
    fontSize: 38,
    fontWeight: '900',
    letterSpacing: 7,
    marginTop: 15,
  },

  brandSub: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 9,
    marginLeft: 9,
    marginTop: 2,
  },
});
