
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';

export default function NotificationsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Restaurant Details</Text>
      <Text style={styles.subtitle}>Restaurant menu will appear here.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 23,
    fontWeight: '900',
    color: colors.ink,
  },
  subtitle: {
    marginTop: 8,
    color: colors.muted,
  },
});
