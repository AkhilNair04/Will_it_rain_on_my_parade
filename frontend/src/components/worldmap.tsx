import React, { useState, useEffect } from 'react';
import { MapPin, Search } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix for default Leaflet icon issue with webpack
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
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

export default function WorldMap() {
  // State for the map marker's position
  const [markerPosition, setMarkerPosition] = useState<L.LatLng | null>(new L.LatLng(40.7128, -74.0060)); // Default to New York
  
  // State for the search query
  const [searchQuery, setSearchQuery] = useState('');

  // Component to handle map clicks
  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setMarkerPosition(e.latlng);

        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
          .then(response => response.json())
          .then(data => {
            const placeName = data.display_name || 'Name not found';
            console.log({ name: placeName, latitude: lat, longitude: lng });
          })
          .catch(error => {
            console.error("Error fetching location name:", error);
            console.log({ name: 'Could not fetch name', latitude: lat, longitude: lng });
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
    fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=1`)
      .then(response => response.json())
      .then(data => {
        if (data && data.length > 0) {
          const { lat, lon } = data[0];
          const newPos = new L.LatLng(parseFloat(lat), parseFloat(lon));
          setMarkerPosition(newPos);
          console.log(`Found location: ${data[0].display_name}`, { latitude: lat, longitude: lon });
        } else {
          alert("Location not found!");
        }
      })
      .catch(error => {
        console.error("Error fetching geocoding data:", error);
        alert("Error finding location.");
      });
  };

  return (
    <div className="bg-gray-800/30 rounded-2xl p-4 border border-gray-700">
      <div className="relative h-64 rounded-xl overflow-hidden">
        
        <MapContainer 
          center={markerPosition || [20, 0]} 
          zoom={3} 
          scrollWheelZoom={true} 
          style={{ height: '100%', width: '100%' }}
        >
          {/* Search bar form */}
          <form onSubmit={handleSearch} className="absolute top-2 left-1/2 -translate-x-1/2 z-[1000] w-2/3 flex gap-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for a location..."
              className="flex-grow bg-gray-900/80 backdrop-blur-sm text-white px-3 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 p-2.5 rounded-lg transition">
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
      <button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2 shadow-lg hover:shadow-blue-600/50 transform hover:scale-105">
        <MapPin className="w-5 h-5" />
        Use My Location
      </button>
    </div>
  );
}
