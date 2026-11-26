
import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Modal,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { colors } from '../constants/colors';
import {
  addAddress,
  updateAddress,
  selectAddress,
} from '../utils/addressStorage';
import { Ionicons } from '@expo/vector-icons';

const addressTypes = [
  { label: 'Home', icon: '⌂' },
  { label: 'Work', icon: '▣' },
  { label: 'Other', icon: '⌖' },
];



export default function AddressConfirmationScreen({
  navigation,
  route,
}) {
  const location = route.params?.location;
  const editAddress = route.params?.editAddress || null;
  const isEditMode = Boolean(editAddress);
  const [selectedType, setSelectedType] = useState(
    editAddress?.addressType || editAddress?.type || 'Home'
  );

  const [customAddressName, setCustomAddressName] = useState(
    editAddress?.customAddressName || ''
  );
  const [nameError, setNameError] = useState('');
  const [saving, setSaving] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);

  const successScale = useRef(new Animated.Value(0.85)).current;
  const successOpacity = useRef(new Animated.Value(0)).current;


  if (!location) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Address not available</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.editText}>Go back and enter your address</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleConfirm = async () => {
    if (saving) return;

    if (!location) {
      Alert.alert('Address missing', 'Please enter your delivery address again.');
      return;
    }

    if (selectedType === 'Other' && !customAddressName.trim()) {
      setNameError('Please enter a name for this address.');
      return;
    }

    try {
      setSaving(true);

      const addressToSave = {
        ...location,
        id: editAddress?.id || location.id || `address_${Date.now()}`,
        addressType: selectedType,
        customAddressName:
          selectedType === 'Other' ? customAddressName.trim() : '',
        isDefault: editAddress ? Boolean(editAddress.isDefault) : false,
      };

      if (isEditMode) {
        await updateAddress(addressToSave);
      } else {
        await addAddress(addressToSave);
      }

      await selectAddress(addressToSave);

      setSuccessVisible(true);

      Animated.parallel([
        Animated.spring(successScale, {
          toValue: 1,
          friction: 6,
          tension: 65,
          useNativeDriver: true,
        }),
        Animated.timing(successOpacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();

    } catch (error) {
      console.error('Address confirmation failed:', error);

      Alert.alert(
        'Unable to save address',
        'Something went wrong while saving your address. Please try again.'
      );
    } finally {
      setSaving(false);
    }
  };

  const handleSuccessContinue = () => {
    setSuccessVisible(false);

    if (isEditMode) {
      navigation.navigate('ManageAddresses');
      return;
    }

    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'Home',
          params: {
            location: {
              ...location,
              addressType: selectedType,
              customAddressName:
                selectedType === 'Other'
                  ? customAddressName.trim()
                  : '',
            },
          },
        },
      ],
    });
  };


  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>

        <View>
          <Text style={styles.headerTitle}>
            {isEditMode ? 'Update address' : 'Confirm address'}
          </Text>
          <Text style={styles.headerSubtitle}>
            Make sure your delivery details are correct
          </Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.successIllustration}>
          <View style={styles.successCircle}>
            <Text style={styles.pinIcon}>📍</Text>
          </View>
          <Text style={styles.successTitle}>Address looks good!</Text>
          <Text style={styles.successDescription}>
            Your food will be delivered to this location.
          </Text>
        </View>

        <View style={styles.addressCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>DELIVERY ADDRESS</Text>
            <Text style={styles.verified}>✓ DETAILS ADDED</Text>
          </View>

          <Text style={styles.addressName}>
            {location.houseNumber}
          </Text>

          <Text style={styles.addressText}>
            {[
              location.street,
              location.area,
              location.landmark,
              location.city,
              location.postalCode,
            ]
              .filter(Boolean)
              .join(', ')}
          </Text>

          {location.latitude != null &&
            location.longitude != null && (
              <Text style={styles.coordinates}>
                Location coordinates verified
              </Text>
            )}

          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.editButtonText}>Edit address</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Save address as</Text>

        <View style={styles.typeContainer}>
          {addressTypes.map((type) => {
            const selected = selectedType === type.label;

            return (
              <TouchableOpacity
                key={type.label}
                style={[
                  styles.typeCard,
                  selected && styles.selectedTypeCard,
                ]}
                onPress={() => {
                  setSelectedType(type.label);
                  setNameError('');
                  if (type.label !== 'Other') {
                    setCustomAddressName('');
                  }
                }}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.typeIcon,
                    selected && styles.selectedTypeText,
                  ]}
                >
                  {type.icon}
                </Text>

                <Text
                  style={[
                    styles.typeLabel,
                    selected && styles.selectedTypeText,
                  ]}
                >
                  {type.label}
                </Text>

                {selected && (
                  <View style={styles.checkCircle}>
                    <Text style={styles.checkText}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {selectedType === 'Other' && (
          <View style={styles.customNameContainer}>
            <Text style={styles.customNameLabel}>
              Give this address a name *
            </Text>

            <TextInput
              value={customAddressName}
              onChangeText={(value) => {
                setCustomAddressName(value);
                if (value.trim()) setNameError('');
              }}
              placeholder="e.g. Parents' House"
              placeholderTextColor="#A5A5A5"
              maxLength={30}
              autoCapitalize="words"
              style={[
                styles.customNameInput,
                nameError ? styles.inputError : null,
              ]}
            />

            {nameError ? (
              <Text style={styles.errorText}>{nameError}</Text>
            ) : (
              <Text style={styles.inputHint}>
                Choose a name that helps you identify this address.
              </Text>
            )}
          </View>
        )}
        <View style={styles.deliveryNote}>
          <Text style={styles.deliveryNoteTitle}>
            Delivery tip
          </Text>
          <Text style={styles.deliveryNoteText}>
            Keep your phone available so the delivery partner can contact
            you if they need help finding your address.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.confirmButton,
            saving && { opacity: 0.7 },
          ]}
          onPress={handleConfirm}
          disabled={saving}
          activeOpacity={0.85}
        >
          {saving ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <>
              <Text style={styles.confirmText}>
                {isEditMode ? 'UPDATE ADDRESS' : 'CONFIRM ADDRESS & CONTINUE'}
              </Text>
              <Text style={styles.confirmArrow}>→</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      <Modal
        visible={successVisible}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => { }}
      >
        <View style={styles.successOverlay}>
          <Animated.View
            style={[
              styles.successPopup,
              {
                opacity: successOpacity,
                transform: [{ scale: successScale }],
              },
            ]}
          >
            <View style={styles.successPopupIcon}>
              <Ionicons
                name="checkmark"
                size={38}
                color={colors.white}
              />
            </View>

            <Text style={styles.successPopupTitle}>
              Address saved successfully!
            </Text>

            <Text style={styles.successPopupDescription}>
              Your {selectedType.toLowerCase()} address is ready for delivery.
            </Text>

            <TouchableOpacity
              style={styles.successPopupButton}
              onPress={handleSuccessContinue}
              activeOpacity={0.85}
            >
              <Text style={styles.successPopupButtonText}>
                CONTINUE
              </Text>
              <Ionicons name="arrow-forward" size={18} color={colors.white} />
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.cream,
    padding: 25,
  },
  errorTitle: {
    color: colors.ink,
    fontSize: 19,
    fontWeight: '900',
    marginBottom: 12,
  },
  editText: {
    color: colors.teal,
    fontWeight: '800',
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
    color: colors.ink,
    fontSize: 19,
    fontWeight: '900',
  },
  headerSubtitle: {
    color: colors.muted,
    fontSize: 11,
    marginTop: 4,
  },
  content: {
    padding: 20,
    paddingBottom: 30,
  },
  successIllustration: {
    alignItems: 'center',
    paddingVertical: 22,
  },
  successCircle: {
    width: 95,
    height: 95,
    borderRadius: 48,
    backgroundColor: colors.vanilla,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinIcon: {
    fontSize: 48,
  },
  successTitle: {
    color: colors.ink,
    fontSize: 21,
    fontWeight: '900',
    marginTop: 15,
  },
  successDescription: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 6,
    textAlign: 'center',
  },
  addressCard: {
    backgroundColor: colors.white,
    borderRadius: 19,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  cardTitle: {
    fontSize: 10,
    fontWeight: '900',
    color: colors.orangeDeep,
    letterSpacing: 0.8,
  },
  verified: {
    color: colors.teal,
    fontSize: 9,
    fontWeight: '900',
  },
  addressName: {
    color: colors.ink,
    fontSize: 17,
    fontWeight: '900',
    marginTop: 17,
  },
  addressText: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 21,
    marginTop: 7,
  },
  coordinates: {
    color: colors.teal,
    fontSize: 10,
    fontWeight: '700',
    marginTop: 10,
  },
  editButton: {
    alignSelf: 'flex-start',
    marginTop: 17,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: colors.cream,
  },
  editButtonText: {
    color: colors.orangeDeep,
    fontWeight: '800',
    fontSize: 11,
  },
  sectionTitle: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: '900',
    marginTop: 25,
    marginBottom: 13,
  },
  typeContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  typeCard: {
    flex: 1,
    minHeight: 88,
    backgroundColor: colors.white,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
  },
  selectedTypeCard: {
    borderColor: colors.orange,
    borderWidth: 1.5,
    backgroundColor: colors.vanilla,
  },
  typeIcon: {
    color: colors.muted,
    fontSize: 23,
  },
  typeLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '800',
  },
  selectedTypeText: {
    color: colors.orangeDeep,
  },
  checkCircle: {
    position: 'absolute',
    right: 7,
    top: 7,
    width: 17,
    height: 17,
    borderRadius: 9,
    backgroundColor: colors.teal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '900',
  },
  deliveryNote: {
    backgroundColor: colors.vanilla,
    borderRadius: 14,
    padding: 15,
    marginTop: 22,
  },
  deliveryNoteTitle: {
    color: colors.ink,
    fontSize: 12,
    fontWeight: '900',
  },
  deliveryNoteText: {
    color: colors.muted,
    fontSize: 11,
    lineHeight: 17,
    marginTop: 5,
  },
  footer: {
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 25,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  confirmButton: {
    height: 55,
    borderRadius: 17,
    backgroundColor: colors.orange,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  confirmArrow: {
    color: colors.white,
    fontSize: 21,
    position: 'absolute',
    right: 18,
  },
  customNameContainer: {
    marginTop: 18,
    padding: 15,
    backgroundColor: colors.white,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.border,
  },

  customNameLabel: {
    color: colors.ink,
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 10,
  },

  customNameInput: {
    height: 49,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.soft,
    paddingHorizontal: 13,
    color: colors.ink,
    fontSize: 13,
  },

  inputError: {
    borderColor: '#E53935',
  },

  errorText: {
    color: '#E53935',
    fontSize: 11,
    marginTop: 7,
  },

  inputHint: {
    color: colors.muted,
    fontSize: 10,
    marginTop: 7,
  },
  successOverlay: {
  flex: 1,
  backgroundColor: 'rgba(36, 36, 36, 0.45)',
  justifyContent: 'center',
  alignItems: 'center',
  padding: 25,
},

successPopup: {
  width: '100%',
  maxWidth: 380,
  backgroundColor: colors.white,
  borderRadius: 24,
  padding: 25,
  alignItems: 'center',
  elevation: 12,
},

successPopupIcon: {
  width: 75,
  height: 75,
  borderRadius: 40,
  backgroundColor: colors.teal,
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: 18,
},

successPopupTitle: {
  fontSize: 19,
  fontWeight: '900',
  color: colors.ink,
  textAlign: 'center',
},

successPopupDescription: {
  fontSize: 12,
  color: colors.muted,
  textAlign: 'center',
  lineHeight: 19,
  marginTop: 9,
},

successPopupButton: {
  width: '100%',
  height: 50,
  borderRadius: 13,
  backgroundColor: colors.orange,
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  gap: 10,
  marginTop: 23,
},

successPopupButtonText: {
  color: colors.white,
  fontSize: 12,
  fontWeight: '900',
},
});
