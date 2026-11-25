
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { colors } from '../constants/colors';
import { searchManualAddress } from '../services/locationService';

export default function ManualAddressScreen({ navigation }) {
  const [searchText, setSearchText] = useState('');
  const [searching, setSearching] = useState(false);
  const [coordinates, setCoordinates] = useState(null);

  const [form, setForm] = useState({
    houseNumber: '',
    street: '',
    area: '',
    landmark: '',
    city: '',
    postalCode: '',
  });

  const updateField = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleSearch = async () => {
    if (!searchText.trim()) {
      Alert.alert('Address required', 'Enter an address or area to search.');
      return;
    }

    try {
      setSearching(true);

      const result = await searchManualAddress(searchText);

      setCoordinates(result);

      // Use reverse geocoding to obtain structured address details.
      try {
        const addresses = await import('expo-location').then((module) =>
          module.reverseGeocodeAsync({
            latitude: result.latitude,
            longitude: result.longitude,
          })
        );

        const address = addresses?.[0];

        if (address) {
          setForm((previous) => ({
            ...previous,
            street: previous.street || address.street || address.name || '',
            area:
              previous.area ||
              address.district ||
              address.subregion ||
              '',
            city:
              previous.city ||
              address.city ||
              address.region ||
              '',
            postalCode:
              previous.postalCode || address.postalCode || '',
          }));
        }
      } catch {
        // The address can still be entered manually if reverse geocoding fails.
      }

      Alert.alert('Location found', 'We found your address location.');
    } catch (error) {
      setCoordinates(null);

      Alert.alert(
        'Address not found',
        error.message || 'Please enter the address details manually.'
      );
    } finally {
      setSearching(false);
    }
  };

  const handleContinue = () => {
    const requiredFields = [
      ['houseNumber', 'House / Flat number'],
      ['street', 'Street'],
      ['area', 'Area'],
      ['city', 'City'],
      ['postalCode', 'PIN code'],
    ];

    for (const [field, label] of requiredFields) {
      if (!form[field].trim()) {
        Alert.alert('Missing information', `Please enter ${label}.`);
        return;
      }
    }

    if (!/^\d{6}$/.test(form.postalCode.trim())) {
      Alert.alert('Invalid PIN code', 'Enter a valid 6-digit PIN code.');
      return;
    }

    const location = {
      ...form,
      postalCode: form.postalCode.trim(),
      latitude: coordinates?.latitude ?? null,
      longitude: coordinates?.longitude ?? null,
      formattedAddress: [
        form.houseNumber,
        form.street,
        form.area,
        form.landmark,
        form.city,
        form.postalCode,
      ]
        .filter((value) => value.trim())
        .join(', '),
      source: 'manual',
    };

    navigation.navigate('AddressConfirmation', { location });
  };

  const renderField = (
    label,
    field,
    placeholder,
    options = {}
  ) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>
        {label}
        {options.required ? ' *' : ''}
      </Text>

      <TextInput
        value={form[field]}
        onChangeText={(value) => updateField(field, value)}
        placeholder={placeholder}
        placeholderTextColor="#A5A5A5"
        style={[styles.input, options.multiline && styles.multilineInput]}
        multiline={options.multiline || false}
        keyboardType={options.keyboardType || 'default'}
        autoCapitalize={options.autoCapitalize || 'sentences'}
        maxLength={options.maxLength}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>

          <View>
            <Text style={styles.headerTitle}>Add delivery address</Text>
            <Text style={styles.headerSubtitle}>
              Where should we deliver your food?
            </Text>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.content}
        >
          <View style={styles.searchCard}>
            <Text style={styles.sectionTitle}>Find your location</Text>

            <Text style={styles.helperText}>
              Search your address, street or nearby landmark.
            </Text>

            <View style={styles.searchRow}>
              <TextInput
                value={searchText}
                onChangeText={setSearchText}
                placeholder="Search area or address"
                placeholderTextColor="#A5A5A5"
                style={styles.searchInput}
                returnKeyType="search"
                onSubmitEditing={handleSearch}
              />

              <TouchableOpacity
                style={styles.searchButton}
                onPress={handleSearch}
                disabled={searching}
              >
                {searching ? (
                  <ActivityIndicator color={colors.white} />
                ) : (
                  <Text style={styles.searchButtonText}>Search</Text>
                )}
              </TouchableOpacity>
            </View>

            {coordinates && (
              <Text style={styles.foundText}>
                ✓ Location coordinates found
              </Text>
            )}
          </View>

          <Text style={styles.sectionHeading}>Delivery details</Text>

          {renderField(
            'House / Flat / Apartment',
            'houseNumber',
            'e.g. Flat 42, Building A',
            { required: true }
          )}

          {renderField(
            'Street / Road',
            'street',
            'e.g. Road No. 3',
            { required: true }
          )}

          {renderField(
            'Area / Locality',
            'area',
            'e.g. Madhapur',
            { required: true }
          )}

          {renderField(
            'Landmark',
            'landmark',
            'e.g. Near Metro Station'
          )}

          {renderField(
            'City',
            'city',
            'Enter your city',
            { required: true }
          )}

          {renderField(
            'PIN code',
            'postalCode',
            '6-digit PIN code',
            {
              required: true,
              keyboardType: 'number-pad',
              maxLength: 6,
            }
          )}

          <View style={styles.infoCard}>
            <Text style={styles.infoIcon}>ⓘ</Text>
            <Text style={styles.infoText}>
              Your address will be used to show restaurants and delivery
              options available in your area.
            </Text>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinue}
            activeOpacity={0.85}
          >
            <Text style={styles.continueText}>
              CONTINUE
            </Text>
            <Text style={styles.continueArrow}>→</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    paddingHorizontal: 20,
    paddingTop: 55,
    paddingBottom: 18,
    backgroundColor: colors.white,
    gap: 14,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 15,
    backgroundColor: colors.cream,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 32,
    color: colors.ink,
    lineHeight: 35,
  },
  headerTitle: {
    fontSize: 19,
    fontWeight: '900',
    color: colors.ink,
  },
  headerSubtitle: {
    fontSize: 11,
    color: colors.muted,
    marginTop: 4,
  },
  content: {
    padding: 20,
    paddingBottom: 35,
  },
  searchCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 17,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: '900',
  },
  helperText: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 6,
    marginBottom: 14,
  },
  searchRow: {
    flexDirection: 'row',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    height: 48,
    backgroundColor: colors.soft,
    borderRadius: 12,
    paddingHorizontal: 12,
    color: colors.ink,
    fontSize: 13,
  },
  searchButton: {
    backgroundColor: colors.teal,
    borderRadius: 12,
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 75,
  },
  searchButtonText: {
    color: colors.white,
    fontWeight: '800',
    fontSize: 12,
  },
  foundText: {
    color: colors.teal,
    fontSize: 11,
    fontWeight: '700',
    marginTop: 10,
  },
  sectionHeading: {
    fontSize: 17,
    fontWeight: '900',
    color: colors.ink,
    marginBottom: 15,
  },
  fieldContainer: {
    marginBottom: 15,
  },
  fieldLabel: {
    color: colors.ink,
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 8,
  },
  input: {
    height: 51,
    borderRadius: 13,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    color: colors.ink,
    fontSize: 13,
  },
  multilineInput: {
    height: 85,
    paddingTop: 13,
    textAlignVertical: 'top',
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 13,
    borderRadius: 13,
    backgroundColor: colors.vanilla,
    marginTop: 5,
  },
  infoIcon: {
    color: colors.orangeDeep,
    fontSize: 17,
    marginRight: 9,
  },
  infoText: {
    flex: 1,
    color: colors.muted,
    fontSize: 11,
    lineHeight: 17,
  },
  footer: {
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 25,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  continueButton: {
    height: 54,
    backgroundColor: colors.orange,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.7,
  },
  continueArrow: {
    color: colors.white,
    fontSize: 21,
    position: 'absolute',
    right: 20,
  },
});
