
export async function searchManualAddress(addressText) {
  const query = addressText.trim();

  if (!query) {
    throw new Error('Please enter an address to search.');
  }

  const results = await Location.geocodeAsync(query);

  if (!results || results.length === 0) {
    throw new Error(
      'We could not find this address. You can still enter your address manually.'
    );
  }

  const { latitude, longitude } = results[0];

  return {
    latitude,
    longitude,
  };
}
