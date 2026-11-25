
import AsyncStorage from '@react-native-async-storage/async-storage';

const ADDRESSES_KEY = '@yudu_saved_addresses';
const ACTIVE_ADDRESS_KEY = '@yudu_active_address';

export async function getSavedAddresses() {
  try {
    const stored = await AsyncStorage.getItem(ADDRESSES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Could not load saved addresses:', error);
    return [];
  }
}

export async function saveAddresses(addresses) {
  await AsyncStorage.setItem(ADDRESSES_KEY, JSON.stringify(addresses));
}

export async function getActiveAddress() {
  try {
    const stored = await AsyncStorage.getItem(ACTIVE_ADDRESS_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Could not load active address:', error);
    return null;
  }
}

export async function setActiveAddress(address) {
  await AsyncStorage.setItem(
    ACTIVE_ADDRESS_KEY,
    JSON.stringify(address)
  );
}

export async function addAddress(address) {
  const addresses = await getSavedAddresses();

  const newAddress = {
    ...address,
    id: address.id || `address_${Date.now()}`,
    isDefault: addresses.length === 0,
  };

  const updated = [...addresses, newAddress];

  await saveAddresses(updated);

  if (newAddress.isDefault) {
    await setActiveAddress(newAddress);
  }

  return updated;
}

export async function updateAddress(updatedAddress) {
  const addresses = await getSavedAddresses();

  const updated = addresses.map((address) =>
    address.id === updatedAddress.id ? updatedAddress : address
  );

  await saveAddresses(updated);

  const active = await getActiveAddress();

  if (active?.id === updatedAddress.id) {
    await setActiveAddress(updatedAddress);
  }

  return updated;
}

export async function selectAddress(selectedAddress) {
  const addresses = await getSavedAddresses();

  const updated = addresses.map((address) => ({
    ...address,
    isDefault: address.id === selectedAddress.id,
  }));

  await saveAddresses(updated);

  const active = {
    ...selectedAddress,
    isDefault: true,
  };

  await setActiveAddress(active);

  return updated;
}

export async function deleteAddress(addressId) {
  const addresses = await getSavedAddresses();
  const updated = addresses.filter((address) => address.id !== addressId);

  await saveAddresses(updated);

  const active = await getActiveAddress();

  if (active?.id === addressId) {
    const nextAddress = updated[0] || null;

    if (nextAddress) {
      await selectAddress(nextAddress);
    } else {
      await AsyncStorage.removeItem(ACTIVE_ADDRESS_KEY);
    }
  }

  return updated;
}
