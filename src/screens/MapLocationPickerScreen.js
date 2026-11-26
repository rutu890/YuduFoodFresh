
import React, {
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';

import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Alert,
    Animated,
    Keyboard,
    Vibration,
} from 'react-native';

import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

import { colors } from '../constants/colors';
import { updateAddress } from '../utils/addressStorage';

const DEFAULT_REGION = {
    latitude: 20.5937,
    longitude: 78.9629,
    latitudeDelta: 0.08,
    longitudeDelta: 0.08,
};

export default function MapLocationPickerScreen({ navigation, route }) {
    const mapRef = useRef(null);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(18)).current;

    const existingAddress = route.params?.address || route.params?.editAddress;
    const returnTo = route.params?.returnTo || 'ManageAddresses';


    const savedLatitude = Number(existingAddress?.latitude);
    const savedLongitude = Number(existingAddress?.longitude);

    const hasSavedCoordinates =
        existingAddress?.latitude !== null &&
        existingAddress?.longitude !== null &&
        existingAddress?.latitude !== undefined &&
        existingAddress?.longitude !== undefined &&
        Number.isFinite(savedLatitude) &&
        Number.isFinite(savedLongitude);

    const [region, setRegion] = useState(() =>
        hasSavedCoordinates
            ? {
                latitude: savedLatitude,
                longitude: savedLongitude,
                latitudeDelta: 0.008,
                longitudeDelta: 0.008,
            }
            : DEFAULT_REGION
    );

    const [coordinate, setCoordinate] = useState(() =>
        hasSavedCoordinates
            ? {
                latitude: savedLatitude,
                longitude: savedLongitude,
            }
            : null
    );



    const [searchText, setSearchText] = useState('');
    const [addressPreview, setAddressPreview] = useState(
        existingAddress?.mapAddress ||
        existingAddress?.formattedAddress ||
        ''
    );

    const [loading, setLoading] = useState(false);
    const [searching, setSearching] = useState(false);
    const [locating, setLocating] = useState(false);
    const [mapReady, setMapReady] = useState(false);

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 450,
                useNativeDriver: true,
            }),
            Animated.spring(slideAnim, {
                toValue: 0,
                damping: 18,
                stiffness: 130,
                useNativeDriver: true,
            }),
        ]).start();
    }, [fadeAnim, slideAnim]);

    const moveMapTo = useCallback((nextCoordinate, delta = 0.008) => {
        const nextRegion = {
            ...nextCoordinate,
            latitudeDelta: delta,
            longitudeDelta: delta,
        };

        setCoordinate(nextCoordinate);
        setRegion(nextRegion);

        mapRef.current?.animateToRegion(nextRegion, 650);
    }, []);

    const getReadableAddress = useCallback(async (point) => {
        try {
            const results = await Location.reverseGeocodeAsync(point);
            const item = results?.[0];

            if (!item) {
                return `${point.latitude.toFixed(5)}, ${point.longitude.toFixed(5)}`;
            }

            return [
                item.name,
                item.street,
                item.district,
                item.city,
                item.region,
                item.postalCode,
            ]
                .filter(Boolean)
                .filter((value, index, values) => values.indexOf(value) === index)
                .join(', ');
        } catch (error) {
            console.warn('Reverse geocoding failed:', error);
            return `${point.latitude.toFixed(5)}, ${point.longitude.toFixed(5)}`;
        }
    }, []);

    useEffect(() => {
        let cancelled = false;

        const loadInitialAddress = async () => {
            if (!coordinate || addressPreview) return;

            const readable = await getReadableAddress(coordinate);

            if (!cancelled) {
                setAddressPreview(readable);
            }
        };

        loadInitialAddress();

        return () => {
            cancelled = true;
        };
    }, [coordinate, addressPreview, getReadableAddress]);

    const handleSearch = async () => {
        Keyboard.dismiss();

        const query = searchText.trim();

        if (!query) {
            Alert.alert('Enter a location', 'Please enter an area, street or landmark.');
            return;
        }

        if (query.length < 3) {
            Alert.alert('Search is too short', 'Enter at least 3 characters.');
            return;
        }

        if (typeof Location.geocodeAsync !== 'function') {
            Alert.alert(
                'Search unavailable',
                'Address search is not available on this device. You can move the map pin manually.'
            );
            return;
        }

        try {
            setSearching(true);

            const results = await Location.geocodeAsync(query);

            if (!results?.length) {
                Alert.alert(
                    'Location not found',
                    'Try a more specific street, area or landmark.'
                );
                return;
            }

            const result = {
                latitude: results[0].latitude,
                longitude: results[0].longitude,
            };

            moveMapTo(result, 0.012);

            const readable = await getReadableAddress(result);
            setAddressPreview(readable);
            Vibration.vibrate(20);
        } catch (error) {
            Alert.alert(
                'Unable to search',
                error.message || 'Please try another location.'
            );
        } finally {
            setSearching(false);
        }
    };

    const handleCurrentLocation = async () => {
        try {
            setLocating(true);

            const enabled = await Location.hasServicesEnabledAsync();

            if (!enabled) {
                Alert.alert(
                    'GPS is turned off',
                    'Please enable your device location services and try again.'
                );
                return;
            }

            const permission =
                await Location.requestForegroundPermissionsAsync();

            if (!permission.granted) {
                Alert.alert(
                    'Location permission required',
                    'Allow location access to find your current position.'
                );
                return;
            }

            const position = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced,
            });

            const point = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            };

            moveMapTo(point, 0.008);

            const readable = await getReadableAddress(point);
            setAddressPreview(readable);
            Vibration.vibrate(20);
        } catch (error) {
            Alert.alert(
                'Unable to get location',
                error.message || 'Please try again.'
            );
        } finally {
            setLocating(false);
        }
    };

    const handleMarkerDrag = async (event) => {
        const point = event.nativeEvent.coordinate;

        setCoordinate(point);
        setAddressPreview('Finding address...');

        const readable = await getReadableAddress(point);
        setAddressPreview(readable);
        Vibration.vibrate(15);
    };

    const handleMapPress = async (event) => {
        const point = event.nativeEvent.coordinate;

        setCoordinate(point);
        setAddressPreview('Finding address...');

        const readable = await getReadableAddress(point);
        setAddressPreview(readable);
    };

    const handleConfirm = async () => {
        if (!coordinate) {
            Alert.alert(
                'Select a location',
                'Search for your address, use your current location or move the map pin.'
            );
            return;
        }

        if (
            !Number.isFinite(coordinate.latitude) ||
            !Number.isFinite(coordinate.longitude)
        ) {
            Alert.alert('Invalid location', 'Please select a valid map location.');
            return;
        }

        try {
            setLoading(true);

            const readable =
                addressPreview && addressPreview !== 'Finding address...'
                    ? addressPreview
                    : await getReadableAddress(coordinate);

            const reverseResults = await Location.reverseGeocodeAsync({
                latitude: coordinate.latitude,
                longitude: coordinate.longitude,
            });

            const addressDetails = reverseResults?.[0] || {};

            const mapLocation = {
                latitude: coordinate.latitude,
                longitude: coordinate.longitude,
                mapAddress: readable,

                street: addressDetails.street || addressDetails.name || '',
                area:
                    addressDetails.district ||
                    addressDetails.subregion ||
                    addressDetails.city ||
                    '',
                city:
                    addressDetails.city ||
                    addressDetails.region ||
                    '',
                postalCode: addressDetails.postalCode || '',
                landmark: '',
            };

            if (existingAddress?.id && returnTo === 'ManageAddresses') {
                await updateAddress({
                    ...existingAddress,
                    ...mapLocation,
                });

                Vibration.vibrate(35);

                Alert.alert(
                    'Location updated!',
                    'The exact delivery pin has been saved.',
                    [
                        {
                            text: 'Done',
                            onPress: () => navigation.goBack(),
                        },
                    ]
                );

                return;
            }

            Vibration.vibrate(35);

            Alert.alert(
                'Location selected!',
                'Your exact delivery location is ready.',
                [
                    {
                        text: 'Continue',
                        onPress: () => {
                            if (returnTo === 'ManualAddress') {
                                navigation.navigate({
                                    name: 'ManualAddress',
                                    params: {
                                        mapLocation,
                                        editAddress: route.params?.editAddress || null,
                                        returnTo: route.params?.returnTo || 'ManageAddresses',
                                    },
                                    merge: true,
                                });
                            } else {
                                navigation.goBack();
                            }
                        },
                    },
                ]
            );
        } catch (error) {
            Alert.alert(
                'Unable to save location',
                error.message || 'Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />

            <Animated.View
                style={[
                    styles.header,
                    {
                        opacity: fadeAnim,
                        transform: [{ translateY: slideAnim }],
                    },
                ]}
            >
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                    activeOpacity={0.75}
                >
                    <Ionicons name="arrow-back" size={22} color={colors.ink} />
                </TouchableOpacity>

                <View style={styles.headerText}>
                    <Text style={styles.title}>Select a location</Text>
                    <Text style={styles.subtitle}>
                        Pinpoint your exact delivery location
                    </Text>
                </View>
            </Animated.View>

            <View style={styles.searchCard}>
                <View style={styles.searchInputWrap}>
                    <Ionicons name="search-outline" size={20} color={colors.muted} />

                    <TextInput
                        value={searchText}
                        onChangeText={setSearchText}
                        placeholder="Search area, street or landmark"
                        placeholderTextColor="#A5A5A5"
                        style={styles.searchInput}
                        returnKeyType="search"
                        onSubmitEditing={handleSearch}
                        maxLength={120}
                        accessibilityLabel="Search for a location"
                    />
                </View>

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

            <View style={styles.mapContainer}>
                {!mapReady && (
                    <View style={styles.mapLoading}>
                        <ActivityIndicator size="large" color={colors.orange} />
                        <Text style={styles.mapLoadingText}>Loading map...</Text>
                    </View>
                )}

                <MapView
                    ref={mapRef}
                    style={styles.map}
                    initialRegion={region}
                    onMapReady={() => setMapReady(true)}
                    onPress={handleMapPress}
                    showsUserLocation
                    showsMyLocationButton={false}
                    loadingEnabled
                    moveOnMarkerPress={false}
                >
                    {coordinate && (
                        <Marker
                            coordinate={coordinate}
                            draggable
                            onDragEnd={handleMarkerDrag}
                            title="Delivery location"
                            description="Drag this pin to adjust your exact location"
                            pinColor={colors.orange}
                        />
                    )}
                </MapView>

                <TouchableOpacity
                    style={styles.currentLocationButton}
                    onPress={handleCurrentLocation}
                    disabled={locating}
                    activeOpacity={0.8}
                >
                    {locating ? (
                        <ActivityIndicator size="small" color={colors.teal} />
                    ) : (
                        <Ionicons
                            name="locate"
                            size={22}
                            color={colors.teal}
                        />
                    )}
                    <Text style={styles.currentLocationText}>
                        {locating ? 'Locating...' : 'Use current location'}
                    </Text>
                </TouchableOpacity>

                <View style={styles.mapHint}>
                    <Ionicons name="move-outline" size={15} color={colors.tealDeep} />
                    <Text style={styles.mapHintText}>
                        Tap the map or drag the pin to adjust
                    </Text>
                </View>
            </View>

            <View style={styles.bottomPanel}>
                <View style={styles.panelHeading}>
                    <View style={styles.previewIcon}>
                        <Ionicons
                            name="location"
                            size={21}
                            color={colors.orangeDeep}
                        />
                    </View>

                    <View style={styles.previewContent}>
                        <Text style={styles.previewTitle}>Delivery location</Text>

                        <Text style={styles.previewAddress}>
                            {addressPreview || 'Select a point on the map'}
                        </Text>
                    </View>
                </View>

                {coordinate && (
                    <View style={styles.coordinatesBox}>
                        <Text style={styles.coordinateText}>
                            Lat: {coordinate.latitude.toFixed(6)}
                        </Text>
                        <Text style={styles.coordinateText}>
                            Long: {coordinate.longitude.toFixed(6)}
                        </Text>
                    </View>
                )}

                <TouchableOpacity
                    style={[
                        styles.confirmButton,
                        (!coordinate || loading) && styles.disabledButton,
                    ]}
                    onPress={handleConfirm}
                    disabled={!coordinate || loading}
                    activeOpacity={0.85}
                >
                    {loading ? (
                        <ActivityIndicator color={colors.white} />
                    ) : (
                        <>
                            <Text style={styles.confirmButtonText}>
                                Confirm location
                            </Text>
                            <Ionicons
                                name="arrow-forward"
                                size={18}
                                color={colors.white}
                            />
                        </>
                    )}
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
        backgroundColor: colors.white,
        paddingTop: 48,
        paddingBottom: 16,
        paddingHorizontal: 17,
        gap: 12,
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
        fontSize: 18,
        fontWeight: '900',
    },
    subtitle: {
        color: colors.muted,
        fontSize: 11,
        marginTop: 4,
    },
    searchCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        padding: 12,
        gap: 9,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    searchInputWrap: {
        flex: 1,
        height: 47,
        backgroundColor: colors.soft,
        borderRadius: 13,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        gap: 8,
    },
    searchInput: {
        flex: 1,
        color: colors.ink,
        fontSize: 12,
        paddingVertical: 0,
    },
    searchButton: {
        minWidth: 76,
        height: 47,
        paddingHorizontal: 14,
        borderRadius: 13,
        backgroundColor: colors.teal,
        alignItems: 'center',
        justifyContent: 'center',
    },
    searchButtonText: {
        color: colors.white,
        fontSize: 12,
        fontWeight: '900',
    },
    mapContainer: {
        flex: 1,
        overflow: 'hidden',
        backgroundColor: '#E8EDE8',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    mapLoading: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 2,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.soft,
        gap: 10,
    },
    mapLoadingText: {
        color: colors.muted,
        fontSize: 12,
    },
    currentLocationButton: {
        position: 'absolute',
        right: 14,
        top: 15,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 7,
        backgroundColor: colors.white,
        paddingHorizontal: 13,
        paddingVertical: 11,
        borderRadius: 14,
        elevation: 4,
    },
    currentLocationText: {
        color: colors.tealDeep,
        fontSize: 11,
        fontWeight: '800',
    },
    mapHint: {
        position: 'absolute',
        bottom: 15,
        alignSelf: 'center',
        backgroundColor: colors.white,
        borderRadius: 20,
        paddingHorizontal: 13,
        paddingVertical: 9,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        elevation: 3,
    },
    mapHintText: {
        color: colors.ink,
        fontSize: 10,
        fontWeight: '700',
    },
    bottomPanel: {
        backgroundColor: colors.white,
        paddingHorizontal: 17,
        paddingTop: 16,
        paddingBottom: 25,
        borderTopLeftRadius: 22,
        borderTopRightRadius: 22,
        elevation: 12,
    },
    panelHeading: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 11,
    },
    previewIcon: {
        width: 42,
        height: 42,
        borderRadius: 14,
        backgroundColor: colors.vanilla,
        alignItems: 'center',
        justifyContent: 'center',
    },
    previewContent: {
        flex: 1,
    },
    previewTitle: {
        color: colors.ink,
        fontSize: 13,
        fontWeight: '900',
    },
    previewAddress: {
        color: colors.muted,
        fontSize: 11,
        lineHeight: 17,
        marginTop: 4,
    },
    coordinatesBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: colors.soft,
        borderRadius: 10,
        padding: 9,
        marginTop: 12,
    },
    coordinateText: {
        color: colors.muted,
        fontSize: 9,
        fontWeight: '600',
    },
    confirmButton: {
        height: 51,
        borderRadius: 15,
        backgroundColor: colors.orange,
        marginTop: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 9,
    },
    disabledButton: {
        opacity: 0.5,
    },
    confirmButtonText: {
        color: colors.white,
        fontSize: 13,
        fontWeight: '900',
    },
});
