import { LocationData } from './types';

export async function getCurrentLocation(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    });
  });
}

export async function reverseGeocode(lat: number, lng: number): Promise<LocationData> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&accept-language=en`,
      {
        headers: {
          'User-Agent': 'PanchayatConnect/1.0',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch address');
    }

    const data = await response.json();
    const address = data.address || {};
    
    // Extract panchayat/village name from various fields
    const panchayat = 
      address.village ||
      address.suburb ||
      address.town ||
      address.city_district ||
      address.municipality ||
      address.city ||
      address.county ||
      'Unknown Location';
    
    // Build full address
    const addressParts = [
      address.road,
      address.neighbourhood,
      address.suburb,
      address.village || address.town || address.city,
      address.state_district,
      address.state,
      address.postcode,
    ].filter(Boolean);

    const fullAddress = addressParts.join(', ');

    // Generate possible panchayat names
    const possiblePanchayats = [
      address.village,
      address.suburb,
      address.town,
      address.city_district,
      address.municipality,
    ].filter(Boolean);

    return {
      lat,
      lng,
      address: fullAddress || data.display_name || 'Address not found',
      panchayat,
      possiblePanchayats: possiblePanchayats.length > 1 ? possiblePanchayats : undefined,
    };
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return {
      lat,
      lng,
      address: 'Unable to detect address',
      panchayat: 'Unknown Panchayat',
    };
  }
}

export async function detectLocation(): Promise<LocationData> {
  try {
    const position = await getCurrentLocation();
    const { latitude, longitude } = position.coords;
    return await reverseGeocode(latitude, longitude);
  } catch (error) {
    console.error('Location detection error:', error);
    throw error;
  }
}
