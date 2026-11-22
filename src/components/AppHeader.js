import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';

export default function AppHeader({ title, subtitle, navigation, rightIcon, onRightPress }) {
  return (
    <View style={styles.row}>
      <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.back} activeOpacity={0.75}>
        <Ionicons name="chevron-back" size={21} color={colors.ink} />
      </TouchableOpacity>
      <View style={styles.copy}>
        <Text style={styles.title}>{title}</Text>
        {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      {!!rightIcon && (
        <TouchableOpacity onPress={onRightPress} style={styles.right} activeOpacity={0.75}>
          <Ionicons name={rightIcon} size={20} color={colors.ink} />
        </TouchableOpacity>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, paddingTop: 12, paddingBottom: 16, gap: 12 },
  back: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', elevation: 2 },
  copy: { flex: 1 },
  title: { fontSize: 21, fontWeight: '900', color: colors.ink },
  subtitle: { fontSize: 11, color: colors.muted, marginTop: 3 },
  right: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', elevation: 2 },
});
