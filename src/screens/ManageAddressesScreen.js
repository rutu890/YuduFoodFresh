
import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

import { colors } from '../constants/colors';
import {
  getSavedAddresses,
  getActiveAddress,
  selectAddress,
  deleteAddress,
} from '../utils/addressStorage';

const ADDRESS_ICONS = {
  Home: 'home-outline',
  Work: 'briefcase-outline',
  Other: 'location-outline',
};

const getAddressLabel = (address) => {
  const type = address.addressType || address.type || 'Other';

  if (type === 'Other') {
    return address.customAddressName?.trim() || 'Other';
  }

  return type;
};

const getAddressType = (address) =>
  address.addressType || address.type || 'Other';

export default function ManageAddressesScreen({ navigation, route }) {
  const [addresses, setAddresses] = useState([]);
  const [activeAddress, setActiveAddressState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const loadAddresses = useCallback(async () => {
    try {
      setLoading(true);

      const [saved, active] = await Promise.all([
        getSavedAddresses(),
        getActiveAddress(),
      ]);

      setAddresses(saved);
      setActiveAddressState(active);
    } catch (error) {
      Alert.alert('Unable to load addresses', 'Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadAddresses();
    }, [loadAddresses])
  );

  const handlePickExactLocation = (address) => {
    navigation.navigate('MapLocationPicker', {
      address,
      returnTo: 'ManageAddresses',
    });
  };

  const handleSelect = async (address) => {
    try {
      setUpdatingId(address.id);

      const updated = await selectAddress(address);

      setAddresses(updated);
      setActiveAddressState({ ...address, isDefault: true });

      Alert.alert(
        'Delivery address updated',
        'Your selected delivery location has been updated.'
      );
    } catch (error) {
      Alert.alert('Something went wrong', 'Please try again.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = (address) => {
    Alert.alert(
      'Delete address?',
      `Are you sure you want to delete your ${address.customAddressName ||
      address.addressType ||
      address.type ||
      'saved'
      } address?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const updated = await deleteAddress(address.id);
              setAddresses(updated);
              setActiveAddressState(await getActiveAddress());
            } catch (error) {
              Alert.alert('Unable to delete', 'Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleAddAddress = () => {
    navigation.navigate('ManualAddress', {
      returnTo: 'ManageAddresses',
    });
  };

  const handleEditAddress = (address) => {
    navigation.navigate('ManualAddress', {
      returnTo: 'ManageAddresses',
      editAddress: address,
    });
  };

  const formatAddress = (address) =>
    [
      address.houseNumber,
      address.street || address.road,
      address.area || address.locality,
      address.landmark,
      address.city,
      address.postalCode || address.pinCode,
    ]
      .filter(Boolean)
      .join(', ');

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.75}
        >
          <Ionicons name="arrow-back" size={22} color={colors.ink} />
        </TouchableOpacity>

        <View style={styles.headerText}>
          <Text style={styles.title}>Your addresses</Text>
          <Text style={styles.subtitle}>
            Manage your delivery locations
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>SAVED ADDRESSES</Text>
          <Text style={styles.count}>{addresses.length} saved</Text>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color={colors.orange} size="large" />
            <Text style={styles.loadingText}>Loading your addresses...</Text>
          </View>
        ) : addresses.length === 0 ? (
          <View style={styles.emptyCard}>
            <View style={styles.emptyIcon}>
              <Ionicons
                name="location-outline"
                size={34}
                color={colors.orange}
              />
            </View>

            <Text style={styles.emptyTitle}>No saved addresses yet</Text>
            <Text style={styles.emptyDescription}>
              Add your home, work or another delivery location to make
              ordering easier.
            </Text>

            <TouchableOpacity
              style={styles.emptyButton}
              onPress={handleAddAddress}
              activeOpacity={0.8}
            >
              <Ionicons name="add" size={19} color={colors.white} />
              <Text style={styles.emptyButtonText}>Add an address</Text>
            </TouchableOpacity>
          </View>
        ) : (
          addresses.map((address) => {
            const isActive = activeAddress?.id === address.id;

            return (
              <View
                key={address.id}
                style={[
                  styles.addressCard,
                  isActive && styles.activeCard,
                ]}
              >
                <TouchableOpacity
                  style={styles.addressMain}
                  onPress={() => handleSelect(address)}
                  activeOpacity={0.8}
                >
                  <View style={styles.addressIcon}>
                    <Ionicons
                      name={ADDRESS_ICONS[getAddressType(address)] || 'location-outline'}
                      size={22}
                      color={isActive ? colors.orangeDeep : colors.teal}
                    />
                  </View>

                  <View style={styles.addressDetails}>
                    <View style={styles.nameRow}>
                      <Text style={styles.addressType}>
                        {getAddressLabel(address)}
                      </Text>

                      {isActive && (
                        <View style={styles.defaultBadge}>
                          <Text style={styles.defaultBadgeText}>
                            SELECTED
                          </Text>
                        </View>
                      )}
                    </View>

                    <Text style={styles.addressText}>
                      {formatAddress(address) || 'Address details unavailable'}
                    </Text>

                    {address.phone ? (
                      <Text style={styles.phoneText}>
                        {address.phone}
                      </Text>
                    ) : null}
                  </View>

                  {updatingId === address.id ? (
                    <ActivityIndicator color={colors.orange} />
                  ) : (
                    <Ionicons
                      name={isActive ? 'radio-button-on' : 'radio-button-off'}
                      size={22}
                      color={isActive ? colors.orange : colors.muted}
                    />
                  )}
                </TouchableOpacity>

                <View style={styles.cardDivider} />


                <View style={styles.actionRow}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleEditAddress(address)}
                    activeOpacity={0.75}
                  >
                    <Ionicons name="create-outline" size={16} color={colors.teal} />
                    <Text style={styles.editText}>Edit</Text>
                  </TouchableOpacity>

                  <View style={styles.actionDivider} />

                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleDelete(address)}
                    activeOpacity={0.75}
                  >
                    <Ionicons name="trash-outline" size={16} color="#D94A45" />
                    <Text style={styles.deleteText}>Delete</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={styles.mapLocationButton}
                  onPress={() => handlePickExactLocation(address)}
                  activeOpacity={0.8}
                >
                  <Ionicons name="map-outline" size={17} color={colors.teal} />
                  <Text style={styles.mapLocationButtonText}>
                    Set exact delivery location
                  </Text>
                  <Ionicons name="chevron-forward" size={17} color={colors.muted} />
                </TouchableOpacity>

              </View>
            );
          })
        )}

        <TouchableOpacity
          style={styles.addAddressButton}
          onPress={handleAddAddress}
          activeOpacity={0.8}
        >
          <View style={styles.addIcon}>
            <Ionicons name="add" size={23} color={colors.orange} />
          </View>

          <View style={styles.addTextContainer}>
            <Text style={styles.addTitle}>Add a new address</Text>
            <Text style={styles.addSubtitle}>
              Save another place for food delivery
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={20}
            color={colors.muted}
          />
        </TouchableOpacity>

        <View style={styles.tipCard}>
          <Ionicons
            name="information-circle-outline"
            size={19}
            color={colors.orangeDeep}
          />
          <Text style={styles.tipText}>
            Your selected address will be used to show nearby restaurants
            and calculate delivery availability.
          </Text>
        </View>
      </ScrollView>
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
    backgroundColor: colors.white,
    paddingTop: 48,
    paddingBottom: 17,
    paddingHorizontal: 17,
    gap: 13,
  },
  backButton: {
    width: 43,
    height: 43,
    borderRadius: 15,
    backgroundColor: colors.cream,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
  },
  title: {
    color: colors.ink,
    fontSize: 19,
    fontWeight: '900',
  },
  subtitle: {
    color: colors.muted,
    fontSize: 11,
    marginTop: 4,
  },
  content: {
    padding: 17,
    paddingBottom: 35,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 13,
  },
  sectionTitle: {
    color: colors.ink,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.7,
  },
  count: {
    color: colors.teal,
    fontSize: 11,
    fontWeight: '800',
  },
  loadingContainer: {
    paddingVertical: 60,
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    color: colors.muted,
    fontSize: 12,
  },
  emptyCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.vanilla,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: '900',
    marginTop: 15,
  },
  emptyDescription: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 19,
    textAlign: 'center',
    marginTop: 7,
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.orange,
    borderRadius: 13,
    paddingHorizontal: 18,
    paddingVertical: 12,
    marginTop: 18,
  },
  emptyButtonText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '900',
  },
  addressCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 15,
    marginBottom: 13,
    borderWidth: 1,
    borderColor: colors.border,
  },
  activeCard: {
    borderColor: colors.orange,
    borderWidth: 1.5,
  },
  addressMain: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  addressIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: colors.cream,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addressDetails: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  addressType: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: '900',
  },
  defaultBadge: {
    backgroundColor: '#E6F5EF',
    borderRadius: 7,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  defaultBadgeText: {
    color: colors.tealDeep,
    fontSize: 8,
    fontWeight: '900',
  },
  addressText: {
    color: colors.muted,
    fontSize: 11,
    lineHeight: 17,
    marginTop: 6,
  },
  phoneText: {
    color: colors.muted,
    fontSize: 10,
    marginTop: 5,
  },
  cardDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginTop: 14,
  },
  actionRow: {
    flexDirection: 'row',
    paddingTop: 11,
    alignItems: 'center',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 4,
  },
  editText: {
    color: colors.teal,
    fontSize: 11,
    fontWeight: '800',
  },
  deleteText: {
    color: '#D94A45',
    fontSize: 11,
    fontWeight: '800',
  },
  actionDivider: {
    width: 1,
    height: 18,
    backgroundColor: colors.border,
  },
  addAddressButton: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    borderRadius: 17,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 5,
  },
  addIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: colors.vanilla,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addTextContainer: {
    flex: 1,
  },
  addTitle: {
    color: colors.ink,
    fontSize: 12,
    fontWeight: '900',
  },
  addSubtitle: {
    color: colors.muted,
    fontSize: 10,
    marginTop: 4,
  },
  tipCard: {
    backgroundColor: colors.vanilla,
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 9,
    marginTop: 18,
  },
  tipText: {
    flex: 1,
    color: colors.muted,
    fontSize: 10,
    lineHeight: 16,
  },
  mapLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 12,
    paddingVertical: 11,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#EAF7F4',
  },

  mapLocationButtonText: {
    flex: 1,
    color: colors.tealDeep,
    fontSize: 11,
    fontWeight: '800',
  },
});
