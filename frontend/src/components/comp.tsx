import React, { useState, useEffect } from "react";
import {
  WiThermometer,
  WiRain,
  WiStrongWind,
  WiDaySunny,
} from "react-icons/wi";
import { FiSearch, FiMap, FiMapPin } from "react-icons/fi";
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
delete (
  L.Icon.Default.prototype as L.Icon.Default & { _getIconUrl?: () => void }
)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

type LocationData = {
  id: string;
  city: string;
  temperature: number;
  rainfall: number;
  wind: number;
  comfort: number;
  lat: number;
  lng: number;
  forecast: Record<string, "sunny" | "rain" | "snow">; // weather per date
  // Additional optional properties from API
  humidity?: number;
  pressure?: number;
  visibility?: number;
  uvIndex?: number;
  apiResponse?: unknown; // Store original API response
};

// 🌤️ Sample mock data with coordinates for map plotting
const allLocationsData: LocationData[] = [
  {
    id: "sf",
    city: "San Francisco",
    temperature: 22,
    rainfall: 0.2,
    wind: 15,
    comfort: 8,
    lat: 37.7749,
    lng: -122.4194,
    forecast: {
      "2025-10-04": "rain",
      "2025-10-05": "sunny",
      "2025-10-06": "snow",
    },
  },
  {
    id: "ny",
    city: "New York",
    temperature: 28,
    rainfall: 0.5,
    wind: 20,
    comfort: 7,
    lat: 40.7128,
    lng: -74.006,
    forecast: {
      "2025-10-04": "sunny",
      "2025-10-05": "rain",
      "2025-10-06": "snow",
    },
  },
  {
    id: "london",
    city: "London",
    temperature: 18,
    rainfall: 1.2,
    wind: 25,
    comfort: 6,
    lat: 51.5074,
    lng: -0.1278,
    forecast: {
      "2025-10-04": "rain",
      "2025-10-05": "rain",
      "2025-10-06": "snow",
    },
  },
  {
    id: "tokyo",
    city: "Tokyo",
    temperature: 37,
    rainfall: 3.2,
    wind: 18,
    comfort: 5,
    lat: 35.6762,
    lng: 139.6503,
    forecast: {
      "2025-10-04": "sunny",
      "2025-10-05": "rain",
      "2025-10-06": "sunny",
    },
  },
  {
    id: "sydney",
    city: "Sydney",
    temperature: 25,
    rainfall: 0.1,
    wind: 22,
    comfort: 9,
    lat: -33.8688,
    lng: 151.2093,
    forecast: {
      "2025-10-04": "sunny",
      "2025-10-05": "sunny",
      "2025-10-06": "rain",
    },
  },
  {
    id: "mumbai",
    city: "Mumbai",
    temperature: 42,
    rainfall: 4.5,
    wind: 12,
    comfort: 4,
    lat: 19.076,
    lng: 72.8777,
    forecast: {
      "2025-10-04": "rain",
      "2025-10-05": "rain",
      "2025-10-06": "sunny",
    },
  },
  {
    id: "dubai",
    city: "Dubai",
    temperature: 45,
    rainfall: 0.0,
    wind: 40,
    comfort: 3,
    lat: 25.2048,
    lng: 55.2708,
    forecast: {
      "2025-10-04": "sunny",
      "2025-10-05": "sunny",
      "2025-10-06": "sunny",
    },
  },
];

const MetricTile = ({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) => (
  <div className="bg-white/10 backdrop-blur-lg p-8 rounded-xl shadow-xl hover:bg-white/20 border transition-all duration-300 min-h-[120px] border-blue-400/30">
    <div className="flex items-center gap-3 mb-4">
      {icon}
      <span className="font-bold text-xl text-blue-300">{title}</span>
    </div>
    <span className="text-2xl font-bold text-white">{value}</span>
  </div>
);

// Helper component to change the map's view programmatically
function ChangeMapView({ coords }: { coords: L.LatLng }) {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.flyTo(coords, 13);
    }
  }, [coords, map]);
  return null;
}

// Leaflet Map Component for Location Selection
const InteractiveMap = ({
  onLocationSelect,
  title,
  selectedLocation,
  className = "",
}: {
  onLocationSelect: (location: {
    lat: number;
    lng: number;
    name: string;
  }) => void;
  title: string;
  selectedLocation?: { lat: number; lng: number; name: string };
  className?: string;
}) => {
  const [markerPosition, setMarkerPosition] = useState<L.LatLng | null>(
    selectedLocation
      ? new L.LatLng(selectedLocation.lat, selectedLocation.lng)
      : new L.LatLng(40.7128, -74.006)
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Update marker position when selectedLocation changes
  useEffect(() => {
    if (selectedLocation) {
      setMarkerPosition(
        new L.LatLng(selectedLocation.lat, selectedLocation.lng)
      );
    }
  }, [selectedLocation]);

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
            const placeName = data.display_name || "Unknown Location";
            const cityName =
              data.address?.city ||
              data.address?.town ||
              data.address?.village ||
              placeName.split(",")[0];
            onLocationSelect({ lat, lng, name: cityName });
          })
          .catch((error) => {
            console.error("Error fetching location name:", error);
            onLocationSelect({ lat, lng, name: "Unknown Location" });
          });
      },
    });
    return null;
  };

  // Function to handle the search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;

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
            data[0].display_name.split(",")[0];
          onLocationSelect({
            lat: parseFloat(lat),
            lng: parseFloat(lon),
            name: cityName,
          });
        } else {
          alert("Location not found!");
        }
      })
      .catch((error) => {
        console.error("Error fetching geocoding data:", error);
        alert("Error finding location.");
      });
  };

  // Get user's current location
  const useMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newPos = new L.LatLng(latitude, longitude);
          setMarkerPosition(newPos);

          fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          )
            .then((response) => response.json())
            .then((data) => {
              const cityName =
                data.address?.city ||
                data.address?.town ||
                data.address?.village ||
                "My Location";
              onLocationSelect({
                lat: latitude,
                lng: longitude,
                name: cityName,
              });
            })
            .catch(() => {
              onLocationSelect({
                lat: latitude,
                lng: longitude,
                name: "My Location",
              });
            });
        },
        (error) => {
          console.error("Geolocation error:", error);
          alert(
            "Unable to get your location. Please make sure location services are enabled."
          );
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  return (
    <div
      className={`bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-blue-400/30 ${className}`}
    >
      <h3 className="text-blue-300 font-semibold mb-4 text-center">{title}</h3>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="mb-4 flex gap-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for a location..."
          className="flex-grow bg-white/10 backdrop-blur-sm text-white px-3 py-2 rounded-lg border border-blue-400/50 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-300"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 p-2 rounded-lg transition-colors"
        >
          <FiSearch className="w-5 h-5 text-white" />
        </button>
      </form>

      <div className="relative h-64 rounded-xl overflow-hidden mb-4">
        <MapContainer
          center={markerPosition || [20, 0]}
          zoom={markerPosition ? 10 : 3}
          scrollWheelZoom={true}
          style={{ height: "100%", width: "100%" }}
          className="z-10"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <MapClickHandler />
          {markerPosition && (
            <>
              <Marker position={markerPosition}>
                <Popup>{selectedLocation?.name || "Selected Location"}</Popup>
              </Marker>
              <ChangeMapView coords={markerPosition} />
            </>
          )}
        </MapContainer>
      </div>

      <button
        onClick={useMyLocation}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-blue-600/50 transform hover:scale-105"
      >
        <FiMapPin className="w-5 h-5" />
        Use My Location
      </button>

      {selectedLocation && (
        <div className="mt-3 text-center text-blue-200 text-sm">
          Selected: {selectedLocation.name}
        </div>
      )}
    </div>
  );
};

const CompareLocations: React.FC = () => {
  const [location1, setLocation1] = useState<string | null>(null);
  const [location2, setLocation2] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState("2025-10-04");
  const [weatherMode, setWeatherMode] = useState<"rain" | "snow" | "sunny">(
    "sunny"
  );

  const [showMap, setShowMap] = useState(true); // Start with map visible
  const [location1Data, setLocation1Data] = useState<{
    lat: number;
    lng: number;
    name: string;
  } | null>(null);
  const [location2Data, setLocation2Data] = useState<{
    lat: number;
    lng: number;
    name: string;
  } | null>(null);

  // API data states
  const [apiWeatherData1, setApiWeatherData1] = useState<LocationData | null>(
    null
  );
  const [apiWeatherData2, setApiWeatherData2] = useState<LocationData | null>(
    null
  );
  const [isLoadingLocation1, setIsLoadingLocation1] = useState(false);
  const [isLoadingLocation2, setIsLoadingLocation2] = useState(false);
  const [errorLocation1, setErrorLocation1] = useState<string | null>(null);
  const [errorLocation2, setErrorLocation2] = useState<string | null>(null);

  // Fetch weather data from API using POST request
  const fetchWeatherForLocation = React.useCallback(
    async (
      locationData: { lat: number; lng: number; name: string },
      isFirstLocation: boolean
    ) => {
      const setLoading = isFirstLocation
        ? setIsLoadingLocation1
        : setIsLoadingLocation2;
      const setWeatherData = isFirstLocation
        ? setApiWeatherData1
        : setApiWeatherData2;
      const setError = isFirstLocation ? setErrorLocation1 : setErrorLocation2;

      setLoading(true);
      setError(null);

      try {
        // Prepare request body for weather API
        const requestBody = {
          city: locationData.name,
          latitude: locationData.lat,
          longitude: locationData.lng,
          forecast_date: selectedDate,
          start_hour: 10,
          end_hour: 16,
        };

        console.log(`🌍 Fetching weather for ${locationData.name}...`);
        console.log("📡 Request body:", requestBody);

        // POST request to weather API
        const weatherResponse = await fetch(
          "http://localhost:5000/api/weather",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
          }
        );

        if (!weatherResponse.ok) {
          throw new Error(
            `Weather API failed: ${weatherResponse.status} ${weatherResponse.statusText}`
          );
        }

        const weatherData = await weatherResponse.json();
        console.log(
          `📊 Weather API response for ${locationData.name}:`,
          weatherData
        );

        // Transform API response to expected format
        const combinedData = {
          id: `api_${locationData.name.toLowerCase().replace(/\s+/g, "_")}`,
          city: locationData.name,
          temperature:
            weatherData.live_forecast_values?.temperature_max_celsius ||
            weatherData.temperature ||
            Math.round(15 + Math.random() * 25),
          rainfall:
            weatherData.prediction_output?.predicted_rainfall_mm ||
            weatherData.rainfall ||
            Math.round(Math.random() * 5 * 10) / 10,
          wind:
            weatherData.live_forecast_values?.wind_speed_mps ||
            weatherData.windSpeed ||
            Math.round(5 + Math.random() * 35),
          comfort:
            weatherData.comfort_score ||
            weatherData.comfort ||
            Math.round(3 + Math.random() * 7),
          lat: locationData.lat,
          lng: locationData.lng,
          forecast: {
            [selectedDate]:
              weatherData.prediction_output?.rain_outlook === "Rainy"
                ? ("rain" as const)
                : weatherData.prediction_output?.rain_outlook === "Snowy"
                ? ("snow" as const)
                : ("sunny" as const),
          },
          // Additional API data from response
          humidity: weatherData.live_forecast_values?.humidity_percent,
          pressure: weatherData.pressure,
          visibility: weatherData.visibility,
          uvIndex: weatherData.uvIndex,
          // Store original API response for reference
          apiResponse: weatherData,
        };

        setWeatherData(combinedData);
        console.log(
          `✅ Weather data processed for ${locationData.name}:`,
          combinedData
        );
      } catch (error) {
        console.error(
          `❌ Error fetching weather for ${locationData.name}:`,
          error
        );
        setError(
          error instanceof Error
            ? error.message
            : "Failed to fetch weather data"
        );
      } finally {
        setLoading(false);
      }
    },
    [selectedDate]
  );

  // Function to handle sequential comparison when Compare button is clicked
  const handleCompare = async () => {
    if (!location1Data || !location2Data) {
      return;
    }

    try {
      // Clear previous data
      setApiWeatherData1(null);
      setApiWeatherData2(null);
      setErrorLocation1(null);
      setErrorLocation2(null);

      console.log("🔄 Starting sequential comparison...");

      // First API call - Location 1
      console.log("📍 Step 1: Fetching data for Location 1...");
      await fetchWeatherForLocation(location1Data, true);

      // Wait a moment to ensure state is updated
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Second API call - Location 2 (only after Location 1 completes)
      console.log("📍 Step 2: Fetching data for Location 2...");
      await fetchWeatherForLocation(location2Data, false);

      console.log("✅ Sequential comparison completed!");
    } catch (error) {
      console.error("❌ Error during comparison:", error);
      console.error("Failed to complete comparison");
    }
  };

  // Generate random weather data for custom locations

  // Get location data (only return API data after comparison)
  const getLocationData = (
    apiData: LocationData | null
  ): LocationData | null => {
    // Only return API data after comparison is done
    return apiData;
  };

  const loc1 = getLocationData(apiWeatherData1);
  const loc2 = getLocationData(apiWeatherData2);

  // Auto-detect weather mode from selected date
  useEffect(() => {
    const weather1 = loc1?.forecast[selectedDate];
    const weather2 = loc2?.forecast[selectedDate];
    // Priority: if any city has rain/snow → show that
    if (weather1 === "snow" || weather2 === "snow") setWeatherMode("snow");
    else if (weather1 === "rain" || weather2 === "rain") setWeatherMode("rain");
    else setWeatherMode("sunny");
  }, [selectedDate, location1, location2, loc1?.forecast, loc2?.forecast]);

  // Comparison summary
  const hotter =
    loc1 && loc2
      ? loc1.temperature > loc2.temperature
        ? loc1.city
        : loc2.city
      : "N/A";
  const colder =
    loc1 && loc2
      ? loc1.temperature < loc2.temperature
        ? loc1.city
        : loc2.city
      : "N/A";
  const wetter =
    loc1 && loc2
      ? loc1.rainfall > loc2.rainfall
        ? loc1.city
        : loc2.city
      : "N/A";
  const windier =
    loc1 && loc2 ? (loc1.wind > loc2.wind ? loc1.city : loc2.city) : "N/A";

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-black via-blue-950 to-slate-900 text-white font-poppins overflow-hidden">
      {/* Background Animation */}
      {weatherMode === "rain" && (
        <>
          <div className="absolute inset-0 overflow-hidden z-0">
            {[...Array(80)].map((_, i) => (
              <div
                key={i}
                className="absolute w-[2px] bg-gradient-to-b from-blue-300 to-blue-500 opacity-60 animate-rain rounded-full"
                style={{
                  height: `${20 + Math.random() * 15}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${-Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${0.8 + Math.random() * 0.4}s`,
                }}
              />
            ))}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-blue-950/30 via-transparent to-transparent z-0"></div>
        </>
      )}

      {weatherMode === "snow" && (
        <>
          <div className="absolute inset-0 overflow-hidden z-0">
            {[...Array(60)].map((_, i) => (
              <div
                key={i}
                className="absolute bg-white rounded-full opacity-80 animate-snow shadow-lg"
                style={{
                  width: `${4 + Math.random() * 8}px`,
                  height: `${4 + Math.random() * 8}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${-Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${4 + Math.random() * 4}s`,
                }}
              />
            ))}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-blue-950/15 via-transparent to-transparent z-0"></div>
        </>
      )}

      {/* Main Content */}
      <div className="relative z-10 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl font-bold mb-12 text-center">
            Compare Locations
          </h1>

          {/* Date Selection */}
          <div className="text-center mb-8">
            <div className="inline-block relative">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-8 py-3 rounded-lg bg-black/30 backdrop-blur-sm text-white font-medium border border-blue-500/40 focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 transition-all duration-300 shadow-lg shadow-black/20 hover:shadow-blue-500/20 hover:border-blue-400/60 cursor-pointer min-w-[200px]"
                style={{
                  colorScheme: "dark",
                  background: "rgba(0, 0, 0, 0.3)",
                  backdropFilter: "blur(8px)",
                }}
              />
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/5 to-purple-500/5 pointer-events-none"></div>
            </div>
          </div>

          {/* Map Toggle and Location Selection */}
          <div className="text-center mb-8">
            <button
              onClick={() => setShowMap(!showMap)}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors duration-300 font-semibold flex items-center gap-2 mx-auto"
            >
              <FiMap /> {showMap ? "Hide Map" : "Select on Map"}
            </button>
          </div>

          {/* Interactive Map */}
          {showMap && (
            <div className="mb-8">
              {/* Two Map Instances */}
              <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
                <InteractiveMap
                  onLocationSelect={(location) => {
                    console.log("📍 Location 1 selected:", location.name);
                    setLocation1Data(location);
                    const matchingLocation = allLocationsData.find(
                      (loc) =>
                        Math.abs(loc.lat - location.lat) < 0.1 &&
                        Math.abs(loc.lng - location.lng) < 0.1
                    );
                    if (matchingLocation) {
                      setLocation1(matchingLocation.id);
                    } else {
                      // Only store location data, don't generate weather data yet
                      setLocation1(null);
                    }
                    // Clear any previous API data
                    setApiWeatherData1(null);
                  }}
                  title="Location 1"
                  selectedLocation={location1Data || undefined}
                  className="w-full"
                />
                <InteractiveMap
                  onLocationSelect={(location) => {
                    console.log("📍 Location 2 selected:", location.name);
                    setLocation2Data(location);
                    const matchingLocation = allLocationsData.find(
                      (loc) =>
                        Math.abs(loc.lat - location.lat) < 0.1 &&
                        Math.abs(loc.lng - location.lng) < 0.1
                    );
                    if (matchingLocation) {
                      setLocation2(matchingLocation.id);
                    } else {
                      // Only store location data, don't generate weather data yet
                      setLocation2(null);
                    }
                    // Clear any previous API data
                    setApiWeatherData2(null);
                  }}
                  title="Location 2"
                  selectedLocation={location2Data || undefined}
                  className="w-full"
                />
              </div>

              {/* Compare Button */}
              <div className="text-center mt-8">
                <button
                  onClick={handleCompare}
                  disabled={
                    !location1Data ||
                    !location2Data ||
                    isLoadingLocation1 ||
                    isLoadingLocation2
                  }
                  className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center gap-3 mx-auto shadow-lg ${
                    !location1Data ||
                    !location2Data ||
                    isLoadingLocation1 ||
                    isLoadingLocation2
                      ? "bg-gray-600 cursor-not-allowed text-gray-300"
                      : "bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white transform hover:scale-105 shadow-green-500/20 hover:shadow-xl"
                  }`}
                >
                  {isLoadingLocation1 || isLoadingLocation2 ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                      Comparing...
                    </>
                  ) : (
                    <>
                      <span className="text-2xl">⚖️</span>
                      Compare Locations
                    </>
                  )}
                </button>

                {/* Selection Status */}
                <div className="mt-4 flex justify-center gap-8">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        location1Data ? "bg-green-400" : "bg-gray-400"
                      }`}
                    ></div>
                    <span className="text-sm text-gray-300">
                      Location 1:{" "}
                      {location1Data ? location1Data.name : "Not selected"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        location2Data ? "bg-green-400" : "bg-gray-400"
                      }`}
                    ></div>
                    <span className="text-sm text-gray-300">
                      Location 2:{" "}
                      {location2Data ? location2Data.name : "Not selected"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Traditional Dropdowns (fallback) */}
          {!showMap && (
            <div className="flex flex-wrap justify-center gap-6 mb-12">
              {[location1, location2].map((locValue, index) => (
                <div key={index} className="relative">
                  <FiSearch className="absolute left-4 top-4 text-blue-400 text-lg" />
                  <select
                    className="pl-12 pr-6 py-4 rounded-xl bg-white/10 backdrop-blur-xl text-white font-medium shadow-lg border-2 border-blue-400/50 focus:ring-2 focus:ring-blue-400 focus:border-blue-300 transition-all duration-300 min-w-[200px]"
                    value={locValue || ""}
                    onChange={(e) =>
                      index === 0
                        ? setLocation1(e.target.value)
                        : setLocation2(e.target.value)
                    }
                  >
                    {allLocationsData.map((loc) => (
                      <option
                        key={loc.id}
                        value={loc.id}
                        disabled={
                          loc.id === (index === 0 ? location2 : location1)
                        }
                        className="bg-gray-800 text-white"
                      >
                        {loc.city}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          )}

          {/* Weather Data Cards */}
          <div className="flex flex-wrap justify-center gap-10 mb-12">
            {/* Location 1 Card */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-10 w-[450px] h-auto shadow-2xl border-2 transition-all duration-500 transform hover:scale-105 border-blue-400/40 hover:border-blue-300/60 hover:shadow-blue-500/20">
              {!location1Data ? (
                // Empty state for Location 1
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">📍</div>
                  <h2 className="text-2xl font-bold text-gray-300 mb-4">
                    Choose Location 1
                  </h2>
                  <p className="text-gray-400">
                    Select a location on the map above
                  </p>
                </div>
              ) : isLoadingLocation1 ? (
                // Loading state for Location 1
                <div className="text-center py-16">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-400 border-t-transparent mx-auto mb-4"></div>
                  <h2 className="text-2xl font-bold text-blue-300 mb-2">
                    Loading {location1Data.name}
                  </h2>
                  <p className="text-gray-400">Fetching weather data...</p>
                </div>
              ) : errorLocation1 ? (
                // Error state for Location 1
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">❌</div>
                  <h2 className="text-2xl font-bold text-red-300 mb-2">
                    Error Loading Data
                  </h2>
                  <p className="text-red-400 text-sm">{errorLocation1}</p>
                  <button
                    onClick={() =>
                      location1Data &&
                      fetchWeatherForLocation(location1Data, true)
                    }
                    className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                  >
                    Retry
                  </button>
                </div>
              ) : !loc1 && location1Data ? (
                // Location selected but not compared yet
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">🏞️</div>
                  <h2 className="text-2xl font-bold text-blue-300 mb-4">
                    {location1Data.name}
                  </h2>
                  <p className="text-gray-400 mb-2">Location selected!</p>
                  <p className="text-sm text-blue-300">
                    Click "Compare Locations" to get weather data
                  </p>
                </div>
              ) : loc1 ? (
                // Data loaded for Location 1
                <>
                  <h2 className="text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300">
                    {loc1.city}
                  </h2>
                  <div className="grid grid-cols-2 gap-8">
                    <MetricTile
                      icon={<WiThermometer size={48} />}
                      title="🌡️ Temperature"
                      value={`${loc1.temperature}°C`}
                    />
                    <MetricTile
                      icon={<WiRain size={48} />}
                      title="💧 Rainfall"
                      value={`${loc1.rainfall}mm`}
                    />
                    <MetricTile
                      icon={<WiStrongWind size={48} />}
                      title="💨 Wind"
                      value={`${loc1.wind}km/h`}
                    />
                    <MetricTile
                      icon={<WiDaySunny size={48} />}
                      title="😊 Comfort"
                      value={`${loc1.comfort}/10`}
                    />
                  </div>
                  <div className="mt-8 text-center">
                    <span
                      className={`inline-block px-4 py-2 rounded-full font-semibold ${
                        loc1.forecast[selectedDate] === "rain"
                          ? "bg-blue-500/20 text-blue-300"
                          : loc1.forecast[selectedDate] === "snow"
                          ? "bg-purple-500/20 text-purple-300"
                          : "bg-yellow-500/20 text-yellow-300"
                      }`}
                    >
                      {loc1.forecast[selectedDate] === "rain"
                        ? "🌧️ Rainy"
                        : loc1.forecast[selectedDate] === "snow"
                        ? "❄️ Snowy"
                        : "☀️ Sunny"}
                    </span>
                  </div>
                </>
              ) : null}
            </div>

            {/* Location 2 Card */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-10 w-[450px] h-auto shadow-2xl border-2 transition-all duration-500 transform hover:scale-105 border-purple-400/40 hover:border-purple-300/60 hover:shadow-purple-500/20">
              {!location2Data ? (
                // Empty state for Location 2
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">📍</div>
                  <h2 className="text-2xl font-bold text-gray-300 mb-4">
                    Choose Location 2
                  </h2>
                  <p className="text-gray-400">
                    {location1Data
                      ? "Select a second location to compare"
                      : "Select Location 1 first"}
                  </p>
                </div>
              ) : !apiWeatherData1 ? (
                // Waiting for Location 1 to complete
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">⏳</div>
                  <h2 className="text-2xl font-bold text-yellow-300 mb-4">
                    Waiting...
                  </h2>
                  <p className="text-gray-400">
                    Please wait for Location 1 data to load first
                  </p>
                </div>
              ) : isLoadingLocation2 ? (
                // Loading state for Location 2
                <div className="text-center py-16">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-400 border-t-transparent mx-auto mb-4"></div>
                  <h2 className="text-2xl font-bold text-purple-300 mb-2">
                    Loading {location2Data.name}
                  </h2>
                  <p className="text-gray-400">Fetching weather data...</p>
                </div>
              ) : errorLocation2 ? (
                // Error state for Location 2
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">❌</div>
                  <h2 className="text-2xl font-bold text-red-300 mb-2">
                    Error Loading Data
                  </h2>
                  <p className="text-red-400 text-sm">{errorLocation2}</p>
                  <button
                    onClick={() =>
                      location2Data &&
                      fetchWeatherForLocation(location2Data, false)
                    }
                    className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                  >
                    Retry
                  </button>
                </div>
              ) : !loc2 && location2Data ? (
                // Location selected but not compared yet
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">🏞️</div>
                  <h2 className="text-2xl font-bold text-purple-300 mb-4">
                    {location2Data.name}
                  </h2>
                  <p className="text-gray-400 mb-2">Location selected!</p>
                  <p className="text-sm text-purple-300">
                    {location1Data
                      ? 'Click "Compare Locations" to get weather data'
                      : "Select Location 1 first, then compare"}
                  </p>
                </div>
              ) : loc2 ? (
                // Data loaded for Location 2
                <>
                  <h2 className="text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">
                    {loc2.city}
                  </h2>
                  <div className="grid grid-cols-2 gap-8">
                    <MetricTile
                      icon={<WiThermometer size={48} />}
                      title="🌡️ Temperature"
                      value={`${loc2.temperature}°C`}
                    />
                    <MetricTile
                      icon={<WiRain size={48} />}
                      title="💧 Rainfall"
                      value={`${loc2.rainfall}mm`}
                    />
                    <MetricTile
                      icon={<WiStrongWind size={48} />}
                      title="💨 Wind"
                      value={`${loc2.wind}km/h`}
                    />
                    <MetricTile
                      icon={<WiDaySunny size={48} />}
                      title="😊 Comfort"
                      value={`${loc2.comfort}/10`}
                    />
                  </div>
                  <div className="mt-8 text-center">
                    <span
                      className={`inline-block px-4 py-2 rounded-full font-semibold ${
                        loc2.forecast[selectedDate] === "rain"
                          ? "bg-blue-500/20 text-blue-300"
                          : loc2.forecast[selectedDate] === "snow"
                          ? "bg-purple-500/20 text-purple-300"
                          : "bg-yellow-500/20 text-yellow-300"
                      }`}
                    >
                      {loc2.forecast[selectedDate] === "rain"
                        ? "🌧️ Rainy"
                        : loc2.forecast[selectedDate] === "snow"
                        ? "❄️ Snowy"
                        : "☀️ Sunny"}
                    </span>
                  </div>
                </>
              ) : null}
            </div>
          </div>

          {/* Enhanced Summary */}
          <div className="text-center bg-white/5 backdrop-blur-lg rounded-2xl p-8 max-w-4xl mx-auto border border-blue-400/30">
            <h3 className="text-2xl font-bold mb-6 text-blue-300">
              📊 Comparison Summary
            </h3>
            <div className="grid md:grid-cols-2 gap-6 text-lg">
              <div className="space-y-3">
                <p className="text-blue-200">
                  🌡️ <b className="text-yellow-300">{hotter}</b> is hotter,{" "}
                  <b className="text-cyan-300">{colder}</b> is colder
                </p>
                <p className="text-blue-200">
                  🌧️ More rainfall in <b className="text-blue-300">{wetter}</b>
                </p>
              </div>
              <div className="space-y-3">
                <p className="text-blue-200">
                  💨 Windier conditions in{" "}
                  <b className="text-gray-300">{windier}</b>
                </p>
                <p className="text-blue-200">
                  📅 Weather forecast for{" "}
                  <b className="text-purple-300">{selectedDate}</b>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Animations */}
      <style>{`
        @keyframes rain {
          0% { 
            transform: translateY(-20px) translateX(0px); 
            opacity: 0; 
          }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { 
            transform: translateY(100vh) translateX(-20px); 
            opacity: 0; 
          }
        }
        .animate-rain {
          animation: rain linear infinite;
        }

        @keyframes snow {
          0% { 
            transform: translateY(-20px) translateX(0px) rotate(0deg); 
            opacity: 0.8; 
          }
          50% { 
            opacity: 1; 
            transform: translateY(50vh) translateX(10px) rotate(180deg); 
          }
          100% { 
            transform: translateY(100vh) translateX(-10px) rotate(360deg); 
            opacity: 0.6; 
          }
        }
        .animate-snow {
          animation: snow linear infinite;
        }

        @keyframes sunGlow {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 0.25; }
        }
        .animate-sunGlow {
          animation: sunGlow 6s ease-in-out infinite;
        }

        @keyframes sunPulse {
          0%, 100% { 
            transform: scale(1); 
            box-shadow: 0 0 30px rgba(251, 191, 36, 0.3);
          }
          50% { 
            transform: scale(1.05); 
            box-shadow: 0 0 50px rgba(251, 191, 36, 0.5);
          }
        }
        .animate-sunPulse {
          animation: sunPulse 3s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) translateX(0px); 
            opacity: 0.3; 
          }
          33% { 
            transform: translateY(-10px) translateX(5px); 
            opacity: 0.6; 
          }
          66% { 
            transform: translateY(-5px) translateX(-5px); 
            opacity: 0.4; 
          }
        }
        .animate-float {
          animation: float ease-in-out infinite;
        }

        @keyframes popIn {
          from { transform: translateY(-20px) scale(0.8); opacity: 0; }
          to { transform: translateY(0) scale(1); opacity: 1; }
        }
        .animate-popIn { 
          animation: popIn 0.5s ease-out; 
        }

        /* Enhanced Dark Theme Calendar Styling */
        input[type="date"]::-webkit-calendar-picker-indicator {
          background: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%2360a5fa'%3e%3cpath fill-rule='evenodd' d='M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z' clip-rule='evenodd'/%3e%3c/svg%3e") no-repeat;
          background-size: 18px 18px;
          cursor: pointer;
          filter: drop-shadow(0 0 3px rgba(96, 165, 250, 0.4));
          padding: 3px;
          border-radius: 4px;
          transition: all 0.2s ease;
        }

        input[type="date"]::-webkit-calendar-picker-indicator:hover {
          background-color: rgba(96, 165, 250, 0.1);
          transform: scale(1.05);
        }

        /* Dark theme for the calendar popup */
        input[type="date"]::-webkit-datetime-edit {
          color: white;
          font-weight: 500;
          letter-spacing: 0.3px;
        }

        input[type="date"]::-webkit-datetime-edit-fields-wrapper {
          background: transparent;
        }

        input[type="date"]::-webkit-datetime-edit-text,
        input[type="date"]::-webkit-datetime-edit-month-field,
        input[type="date"]::-webkit-datetime-edit-day-field,
        input[type="date"]::-webkit-datetime-edit-year-field {
          color: white;
          background: transparent;
          padding: 1px 3px;
          border-radius: 4px;
          transition: all 0.2s ease;
        }

        input[type="date"]::-webkit-datetime-edit-month-field:focus,
        input[type="date"]::-webkit-datetime-edit-day-field:focus,
        input[type="date"]::-webkit-datetime-edit-year-field:focus {
          background: rgba(96, 165, 250, 0.15);
          outline: none;
          color: #93c5fd;
        }

        /* Calendar popup styling for webkit browsers */
        input[type="date"]::-webkit-inner-spin-button,
        input[type="date"]::-webkit-clear-button {
          display: none;
        }

        /* Custom styles for calendar picker when opened */
        @supports (-webkit-appearance: none) {
          input[type="date"] {
            position: relative;
          }
          
          input[type="date"]:before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.3);
            backdrop-filter: blur(8px);
            border-radius: 8px;
            z-index: -1;
            transition: all 0.3s ease;
          }
          
          input[type="date"]:hover:before {
            background: rgba(0, 0, 0, 0.4);
            box-shadow: 0 4px 16px rgba(96, 165, 250, 0.15);
          }
          
          input[type="date"]:focus:before {
            background: rgba(0, 0, 0, 0.45);
            box-shadow: 0 0 0 2px rgba(96, 165, 250, 0.5);
          }
        }

        /* Firefox specific calendar styling */
        @-moz-document url-prefix() {
          input[type="date"] {
            background: rgba(0, 0, 0, 0.3) !important;
            color: white !important;
            border: 1px solid rgba(96, 165, 250, 0.4) !important;
            border-radius: 8px !important;
          }
        }

        /* Responsive improvements */
        @media (max-width: 768px) {
          .grid-cols-2 {
            grid-template-columns: 1fr;
          }
          
          input[type="date"] {
            font-size: 16px;
            padding: 12px 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default CompareLocations;
