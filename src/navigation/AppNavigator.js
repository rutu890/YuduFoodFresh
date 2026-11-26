import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/SplashScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import LocationScreen from '../screens/LocationScreen';
import HomeScreen from '../screens/HomeScreen';
import RestaurantsScreen from '../screens/RestaurantsScreen';
import OffersScreen from '../screens/OffersScreen';
import RestaurantDetailsScreen from '../screens/RestaurantDetailsScreen';
import CartScreen from '../screens/CartScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import OrderTrackingScreen from '../screens/OrderTrackingScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import MyOrdersScreen from '../screens/MyOrdersScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import ManualAddressScreen from '../screens/ManualAddressScreen';
import AddressConfirmationScreen from '../screens/AddressConfirmationScreen';
import ManageAddressesScreen from '../screens/ManageAddressesScreen';
import MapLocationPickerScreen from '../screens/MapLocationPickerScreen';


const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false, animation: 'fade', gestureEnabled: true }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Location" component={LocationScreen} />
        <Stack.Screen
          name="ManualAddress"
          component={ManualAddressScreen}
        />

        <Stack.Screen
          name="AddressConfirmation"
          component={AddressConfirmationScreen}
        />
        <Stack.Screen
          name="ManageAddresses"
          component={ManageAddressesScreen}
        />

        <Stack.Screen
          name="MapLocationPicker"
          component={MapLocationPickerScreen}
        />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Restaurants" component={RestaurantsScreen} />
        <Stack.Screen name="Offers" component={OffersScreen} />
        <Stack.Screen name="RestaurantDetails" component={RestaurantDetailsScreen} />
        <Stack.Screen name="Cart" component={CartScreen} />
        <Stack.Screen name="Checkout" component={CheckoutScreen} />
        <Stack.Screen name="OrderTracking" component={OrderTrackingScreen} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
        <Stack.Screen name="MyOrders" component={MyOrdersScreen} />
        <Stack.Screen name="Favorites" component={FavoritesScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
