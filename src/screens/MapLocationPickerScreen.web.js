
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';

export default function MapLocationPickerScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={22} color={colors.ink} />
        </TouchableOpacity>

        <Text style={styles.title}>Select delivery location</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <Ionicons
            name="map-outline"
            size={48}
            color={colors.teal}
          />
        </View>

        <Text style={styles.heading}>Map selection is available in the app</Text>

        <Text style={styles.description}>
          For the web preview, please enter your complete address manually.
          Exact map selection is available in the Android application.
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Return to address form</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    paddingTop: 25,
    backgroundColor: colors.white,
    gap: 14,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: colors.cream,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.ink,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 28,
  },
  iconCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#E3F5F1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,
  },
  heading: {
    fontSize: 21,
    fontWeight: '900',
    color: colors.ink,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    lineHeight: 23,
    color: colors.muted,
    textAlign: 'center',
    marginTop: 12,
  },
  button: {
    marginTop: 25,
    backgroundColor: colors.orange,
    borderRadius: 15,
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  buttonText: {
    color: colors.white,
    fontWeight: '800',
    fontSize: 13,
  },
});
