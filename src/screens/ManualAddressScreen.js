
import React, { useEffect, useState } from 'react';
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
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { colors } from '../constants/colors';
import { searchManualAddress } from '../services/locationService';

export default function ManualAddressScreen({ navigation, route }) {
  const editAddress = route.params?.editAddress || null;
  const mapLocation = route.params?.mapLocation || null;

  const isEditMode = Boolean(editAddress);

  const [searchText, setSearchText] = useState('');
  const [searching, setSearching] = useState(false);

  const [coordinates, setCoordinates] = useState(() => {
    const latitude = Number(editAddress?.latitude);
    const longitude = Number(editAddress?.longitude);

    return Number.isFinite(latitude) &&
      Number.isFinite(longitude) &&
      editAddress?.latitude != null &&
      editAddress?.longitude != null
      ? { latitude, longitude }
      : null;
  });

  const [form, setForm] = useState({
    houseNumber: editAddress?.houseNumber || '',
    street: editAddress?.street || editAddress?.road || '',
    area: editAddress?.area || editAddress?.locality || '',
    landmark: editAddress?.landmark || '',
    city: editAddress?.city || '',
    postalCode: editAddress?.postalCode || editAddress?.pinCode || '',
  });

  // Receive a location returned by the map picker.
  useEffect(() => {
    if (!mapLocation) return;

    const latitude = Number(mapLocation.latitude);
    const longitude = Number(mapLocation.longitude);

    if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
      setCoordinates({ latitude, longitude });
    }

    setForm((previous) => ({
      ...previous,
      street: mapLocation.street || mapLocation.road || previous.street,
      area:
        mapLocation.area ||
        mapLocation.locality ||
        mapLocation.district ||
        previous.area,
      city: mapLocation.city || previous.city,
      postalCode:
        mapLocation.postalCode ||
        mapLocation.pinCode ||
        previous.postalCode,
      landmark: mapLocation.landmark || previous.landmark,
    }));

    navigation.setParams({ mapLocation: undefined });
  }, [mapLocation, navigation]);

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

      setCoordinates({
        latitude: Number(result.latitude),
        longitude: Number(result.longitude),
      });

      try {
        const Location = await import('expo-location');

        const addresses = await Location.reverseGeocodeAsync({
          latitude: result.latitude,
          longitude: result.longitude,
        });

        const address = addresses?.[0];

        if (address) {
          setForm((previous) => ({
            ...previous,
            street: previous.street || address.street || address.name || '',
            area:
              previous.area ||
              address.district ||
              address.subregion ||
              address.city ||
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
        // The user can still enter address details manually.
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

  const handlePickMapLocation = () => {
   navigation.navigate('MapLocationPicker', {
  address: editAddress
    ? {
        ...editAddress,
        ...form,
        ...(coordinates || {}),
      }
    : {
        ...form,
        ...(coordinates || {}),
      },
  editAddress: editAddress || null,
  returnTo: 'ManualAddress',
});
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
      ...editAddress,
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
        form.postalCode.trim(),
      ].filter(Boolean).join(', '),
      source: 'manual',
    };

    navigation.navigate('AddressConfirmation', {
      location,
      editAddress: isEditMode ? editAddress : null,
      returnTo: route.params?.returnTo || 'ManageAddresses',
    });
  };

  const renderField = (
    label,
    field,
    placeholder,
    options = {}
  ) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        value={form[field]}
        onChangeText={(value) => updateField(field, value)}
        placeholder={placeholder}
        placeholderTextColor="#A5A5A5"
        style={[
          styles.input,
          options.multiline && styles.multilineInput,
        ]}
        multiline={options.multiline || false}
        keyboardType={options.keyboardType || 'default'}
        maxLength={options.maxLength}
        autoCapitalize={options.autoCapitalize || 'words'}
        textAlignVertical={options.multiline ? 'top' : 'center'}
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
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.75}
          >
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>

          <View>
            <Text style={styles.headerTitle}>
              {isEditMode ? 'Edit delivery address' : 'Add delivery address'}
            </Text>
            <Text style={styles.headerSubtitle}>
              Enter your complete delivery details
            </Text>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.content}
        >
          {/* Address Search */}
          <View style={styles.searchCard}>
            <Text style={styles.sectionTitle}>Find your location</Text>
            <Text style={styles.helperText}>
              Search your area or street to identify your location.
            </Text>

            <View style={styles.searchRow}>
              <TextInput
                style={styles.searchInput}
                value={searchText}
                onChangeText={setSearchText}
                placeholder="Search area, street or landmark"
                placeholderTextColor="#A5A5A5"
                returnKeyType="search"
                onSubmitEditing={handleSearch}
              />

              <TouchableOpacity
                style={styles.searchButton}
                onPress={handleSearch}
                disabled={searching}
                activeOpacity={0.8}
              >
                {searching ? (
                  <ActivityIndicator color={colors.white} size="small" />
                ) : (
                  <Text style={styles.searchButtonText}>Search</Text>
                )}
              </TouchableOpacity>
            </View>

            {coordinates && (
              <Text style={styles.foundText}>
                ✓ Location coordinates detected
              </Text>
            )}

            <TouchableOpacity
              style={styles.mapPickerButton}
              onPress={handlePickMapLocation}
              activeOpacity={0.8}
            >
              <Ionicons name="map-outline" size={19} color={colors.teal} />
              <Text style={styles.mapPickerButtonText}>
                Select exact location on map
              </Text>
              <Ionicons
                name="chevron-forward"
                size={18}
                color={colors.teal}
              />
            </TouchableOpacity>
          </View>

          {/* Address Details */}
          <Text style={styles.sectionHeading}>Delivery address details</Text>

          {renderField(
            'House / Flat number *',
            'houseNumber',
            'e.g. Flat 204, Building A'
          )}

          {renderField(
            'Street / Road *',
            'street',
            'Enter street or road name'
          )}

          {renderField(
            'Area / Locality *',
            'area',
            'Enter your area or locality'
          )}

          {renderField(
            'Landmark (Optional)',
            'landmark',
            'Nearby landmark'
          )}

          {renderField(
            'City *',
            'city',
            'Enter city'
          )}

          {renderField(
            'PIN Code *',
            'postalCode',
            'Enter 6-digit PIN code',
            { keyboardType: 'number-pad', maxLength: 6 }
          )}

          <View style={styles.infoCard}>
            <Ionicons
              name="information-circle"
              size={19}
              color={colors.orangeDeep}
              style={styles.infoIcon}
            />
            <Text style={styles.infoText}>
              Make sure your address details are correct so your delivery
              partner can find you easily.
            </Text>
          </View>
        </ScrollView>

        {/* Footer */}
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
