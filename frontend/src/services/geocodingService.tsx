// src/services/geocodingService.ts

export interface Coordinates {
  latitude: number;
  longitude: number;
}

/**
 * Fetches coordinates for a given location name using the free Nominatim API.
 * @param locationName - The name of the place (e.g., "Cubbon Park").
 * @returns A promise that resolves to a Coordinates object or null if not found.
 */
export const getCoordinates = async (locationName: string): Promise<Coordinates | null> => {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(locationName)}&format=json&limit=1`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data && data.length > 0) {
      const { lat, lon } = data[0];
      return {
        latitude: parseFloat(lat),
        longitude: parseFloat(lon),
      };
    }
    return null; // Location not found
  } catch (error) {
    console.error("Error fetching coordinates:", error);
    return null;
  }
};