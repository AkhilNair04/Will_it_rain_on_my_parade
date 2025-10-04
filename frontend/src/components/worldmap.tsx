import React, { useState, useEffect } from "react";
import { MapPin, Search } from "lucide-react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix for default Leaflet icon issue with webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Helper component to change the map's view programmatically
function ChangeMapView({ coords }: { coords: L.LatLng }) {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.flyTo(coords, 13); // Fly to new coordinates with a nice zoom level
    }
  }, [coords, map]);

  return null;
}

interface WorldMapProps {
  onLocationUpdate?: (
    city: string,
    latitude: number,
    longitude: number
  ) => void;
}

export default function WorldMap({ onLocationUpdate }: WorldMapProps) {
  // State for the map marker's position
  const [markerPosition, setMarkerPosition] = useState<L.LatLng | null>(
    new L.LatLng(40.7128, -74.006)
  ); // Default to New York

  // State for the search query
  const [searchQuery, setSearchQuery] = useState("");

  // State for geolocation
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Component to handle map clicks
  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setMarkerPosition(e.latlng);

        fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
        )
          .then((response) => response.json())
          .then((data) => {
            const placeName = data.display_name || "Name not found";
            const cityName =
              data.address?.city ||
              data.address?.town ||
              data.address?.village ||
              data.name ||
              "Unknown Location";
            console.log({
              name: placeName,
              city: cityName,
              latitude: lat,
              longitude: lng,
            });

            // Call the callback to update parent component
            if (onLocationUpdate) {
              onLocationUpdate(cityName, lat, lng);
            }
          })
          .catch((error) => {
            console.error("Error fetching location name:", error);
            const fallbackCity = "Unknown Location";
            console.log({
              name: "Could not fetch name",
              city: fallbackCity,
              latitude: lat,
              longitude: lng,
            });

            // Still call callback with fallback data
            if (onLocationUpdate) {
              onLocationUpdate(fallbackCity, lat, lng);
            }
          });
      },
    });
    return null;
  };

  // Function to handle the search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;

    // Use Nominatim API for geocoding (name -> coordinates)
    fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        searchQuery
      )}&format=json&limit=1`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data && data.length > 0) {
          const { lat, lon } = data[0];
          const newPos = new L.LatLng(parseFloat(lat), parseFloat(lon));
          setMarkerPosition(newPos);

          const cityName =
            data[0].address?.city ||
            data[0].address?.town ||
            data[0].address?.village ||
            data[0].name ||
            searchQuery;
          console.log(`Found location: ${data[0].display_name}`, {
            city: cityName,
            latitude: lat,
            longitude: lon,
          });

          // Call the callback to update parent component
          if (onLocationUpdate) {
            onLocationUpdate(cityName, parseFloat(lat), parseFloat(lon));
          }
        } else {
          alert("Location not found!");
        }
      })
      .catch((error) => {
        console.error("Error fetching geocoding data:", error);
        alert("Error finding location.");
      });
  };

  // Function to get user's current location
  const getUserLocation = () => {
    setLocationLoading(true);
    setLocationError(null);

    console.log("🌍 [GEOLOCATION] Attempting to get user location...");

    // Check if geolocation is supported
    if (!navigator.geolocation) {
      const error = "Geolocation is not supported by this browser.";
      setLocationError(error);
      setLocationLoading(false);
      console.error("❌ [GEOLOCATION] Error:", error);
      alert(error);
      return;
    }

    // Get current position
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newPos = new L.LatLng(latitude, longitude);

        console.log("✅ [GEOLOCATION] Location obtained:");
        console.log("   - Latitude:", latitude);
        console.log("   - Longitude:", longitude);
        console.log("   - Accuracy:", position.coords.accuracy, "meters");

        setMarkerPosition(newPos);
        setLocationLoading(false);

        // Optional: Get location name using reverse geocoding
        fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
        )
          .then((response) => response.json())
          .then((data) => {
            const placeName = data.display_name || "Location found";
            const cityName =
              data.address?.city ||
              data.address?.town ||
              data.address?.village ||
              data.name ||
              "Your Location";
            console.log("📍 [GEOLOCATION] Location name:", placeName);
            console.log("📊 [GEOLOCATION] Complete location data:", {
              name: placeName,
              city: cityName,
              latitude: latitude,
              longitude: longitude,
              accuracy: position.coords.accuracy,
            });

            // Call the callback to update parent component
            if (onLocationUpdate) {
              onLocationUpdate(cityName, latitude, longitude);
            }
          })
          .catch((error) => {
            console.error(
              "⚠️ [GEOLOCATION] Error fetching location name:",
              error
            );

            // Still call callback with fallback data
            if (onLocationUpdate) {
              onLocationUpdate("Your Location", latitude, longitude);
            }
          });
      },
      (error) => {
        setLocationLoading(false);
        let errorMessage = "Unable to retrieve your location.";

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage =
              "Location access denied by user. Please enable location permissions.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out.";
            break;
          default:
            errorMessage =
              "An unknown error occurred while retrieving location.";
            break;
        }

        console.error("❌ [GEOLOCATION] Error:", errorMessage);
        console.error("❌ [GEOLOCATION] Error details:", error);
        setLocationError(errorMessage);
        alert(errorMessage);
      },
      {
        enableHighAccuracy: true, // Use GPS if available
        timeout: 10000, // 10 seconds timeout
        maximumAge: 300000, // Accept location up to 5 minutes old
      }
    );
  };

  return (
    <div className="bg-gray-800/30 rounded-2xl p-4 border border-gray-700">
      <div className="relative h-64 rounded-xl overflow-hidden">
        <MapContainer
          center={markerPosition || [20, 0]}
          zoom={3}
          scrollWheelZoom={true}
          style={{ height: "100%", width: "100%" }}
        >
          {/* Search bar form */}
          <form
            onSubmit={handleSearch}
            className="absolute top-2 left-1/2 -translate-x-1/2 z-[1000] w-2/3 flex gap-1"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for a location..."
              className="flex-grow bg-gray-900/80 backdrop-blur-sm text-white px-3 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 p-2.5 rounded-lg transition"
            >
              <Search className="w-5 h-5" />
            </button>
          </form>

          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <MapClickHandler />
          {markerPosition && (
            <>
              <Marker position={markerPosition}>
                <Popup>Selected Location</Popup>
              </Marker>
              <ChangeMapView coords={markerPosition} />
            </>
          )}
        </MapContainer>
      </div>
      <button
        onClick={getUserLocation}
        disabled={locationLoading}
        className={`w-full mt-4 text-white font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2 shadow-lg transform ${
          locationLoading
            ? "bg-gray-600 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 hover:shadow-blue-600/50 hover:scale-105"
        }`}
      >
        <MapPin
          className={`w-5 h-5 ${locationLoading ? "animate-pulse" : ""}`}
        />
        {locationLoading ? "Getting Location..." : "Use My Location"}
      </button>
      {locationError && (
        <p className="text-red-400 text-sm mt-2 text-center">{locationError}</p>
      )}
    </div>
  );
}
