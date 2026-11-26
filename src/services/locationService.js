
import * as Location from 'expo-location';

export async function searchManualAddress(addressText) {
  const query = addressText?.trim();

  if (!query) {
    throw new Error('Please enter an address to search.');
  }

  if (typeof Location.geocodeAsync !== 'function') {
    throw new Error('Address search is unavailable on this device.');
  }

  try {
    const results = await Location.geocodeAsync(query);

    if (!results || results.length === 0) {
      throw new Error(
        'We could not find this address. Please check the details.'
      );
    }

    const { latitude, longitude } = results[0];

    return {
      latitude,
      longitude,
    };
  } catch (error) {
    if (error.message?.includes('could not find')) {
      throw error;
    }

    throw new Error(
      'Unable to search this address. Please try again.'
    );
  }
}
