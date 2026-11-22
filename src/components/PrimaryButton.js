import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colors } from '../constants/colors';

export default function PrimaryButton({ title, onPress, disabled, loading, style }) {
  return (
    <TouchableOpacity activeOpacity={0.85} disabled={disabled || loading} onPress={onPress} style={[styles.button, (disabled || loading) && styles.disabled, style]}>
      {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.text}>{title}</Text>}
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  button: { minHeight: 52, borderRadius: 16, backgroundColor: colors.teal, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 18 },
  disabled: { opacity: 0.45 },
  text: { color: '#fff', fontWeight: '900', fontSize: 14 },
});
