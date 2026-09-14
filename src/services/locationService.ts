import * as Location from 'expo-location';

import {
  formatLocationLabel,
  isValidCoordinates,
  type LocationCoordinates,
} from '../utils/locationHelpers';

export async function getForegroundLocationPermission() {
  return Location.getForegroundPermissionsAsync();
}

export async function requestForegroundLocationPermission() {
  return Location.requestForegroundPermissionsAsync();
}

export async function getCurrentLocation(): Promise<LocationCoordinates> {
  const location = await Location.getCurrentPositionAsync({
    accuracy: Location.LocationAccuracy.Balanced,
    mayShowUserSettingsDialog: true,
  });
  const { latitude, longitude } = location.coords;

  if (!isValidCoordinates(latitude, longitude)) {
    throw new Error('El dispositivo devolvió coordenadas inválidas.');
  }

  return { latitude, longitude };
}

export async function reverseGeocodeLocation(coordinates: LocationCoordinates): Promise<string> {
  const [address] = await Location.reverseGeocodeAsync(coordinates);
  return formatLocationLabel(address);
}
