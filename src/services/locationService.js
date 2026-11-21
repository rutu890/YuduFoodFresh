
import * as Location from 'expo-location';

export async function getCurrentDeliveryLocation() {
  // Check whether location services are enabled.
  const servicesEnabled = await Location.hasServicesEnabledAsync();

  if (!servicesEnabled) {
    throw new Error(
      'Location services are turned off. Please enable GPS and try again.'
    );
  }

  // Ask the user for foreground location permission.
  const permission = await Location.requestForegroundPermissionsAsync();

  if (!permission.granted) {
    throw new Error(
      'Location permission was not granted. You can enable it in your phone settings or enter your address manually.'
    );
  }

  // Get the device's current coordinates.
  const position = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });

  const { latitude, longitude } = position.coords;

  // Convert coordinates into a readable address.
  const addresses = await Location.reverseGeocodeAsync({
    latitude,
    longitude,
  });

  const address = addresses?.[0];

  const formattedAddress = address
    ? [
        address.name,
        address.street,
        address.district,
        address.city,
        address.region,
        address.postalCode,
      ]
        .filter(Boolean)
        .filter((value, index, values) => values.indexOf(value) === index)
        .join(', ')
    : `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;

  return {
    latitude,
    longitude,
    formattedAddress,
    city: address?.city || address?.district || '',
    postalCode: address?.postalCode || '',
  };
}
