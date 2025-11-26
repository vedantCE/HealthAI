import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";

// Configure axios base URL for backend API calls
axios.defaults.baseURL = "http://127.0.0.1:8000";

// Leaflet is a lightweight, open-source JavaScript library for interactive maps
// It uses OpenStreetMap tiles and doesn't require any API keys
// React-Leaflet provides React components for Leaflet maps

interface MedicalPlace {
  name: string;
  lat: number;
  lon: number;
  type: string;
  address: string;
}

// Fix Leaflet default marker icons (required for React)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Create custom colored icons for different medical facility types
const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background-color: ${color};
      border: 2px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    "></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
};

// Define icons for different medical facility types
const hospitalIcon = createCustomIcon('#FF0000'); // Red for hospitals
const clinicIcon = createCustomIcon('#0000FF');   // Blue for clinics
const pharmacyIcon = createCustomIcon('#00FF00');  // Green for pharmacies
const userIcon = createCustomIcon('#007cbf');     // Blue for user location

export default function MapView() {
  // State for user's current location coordinates
  const [userLat, setUserLat] = useState<number | null>(null);
  const [userLon, setUserLon] = useState<number | null>(null);
  
  // State for nearby medical facilities from backend
  const [medicalPlaces, setMedicalPlaces] = useState<MedicalPlace[]>([]);
  
  // State for loading and error handling
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // Function to fetch nearby medical facilities from backend
  const fetchMedicalPlaces = async (lat: number, lon: number) => {
    try {
      console.log(`Fetching medical places for coordinates: ${lat}, ${lon}`);
      
      // Call backend API endpoint with user coordinates
      const response = await axios.get(`/nearby-medical?lat=${lat}&lon=${lon}`);
      console.log("Backend response:", response.data);
      
      if (response.data.success) {
        setMedicalPlaces(response.data.places);
        console.log(`Found ${response.data.places.length} medical facilities`);
      }
    } catch (error) {
      console.error("Error fetching medical places:", error);
      setError("Failed to load nearby medical facilities");
    }
  };

  // Function to get appropriate icon based on medical facility type
  const getMarkerIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "hospital":
        return hospitalIcon;
      case "clinic":
        return clinicIcon;
      case "pharmacy":
        return pharmacyIcon;
      default:
        return clinicIcon; // Default to clinic icon
    }
  };

  // Main effect hook that runs when component mounts
  useEffect(() => {
    // Get user's current location using browser geolocation API
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        
        console.log(`User location obtained: ${lat}, ${lon}`);
        setUserLat(lat);
        setUserLon(lon);

        // Fetch medical facilities from backend
        fetchMedicalPlaces(lat, lon);
        setLoading(false);
      },
      (error) => {
        console.error("Geolocation error:", error);
        setError("Unable to get your location. Please enable location services.");
        setLoading(false);
      }
    );
  }, []);

  // Render loading state
  if (loading) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "500px",
        fontSize: "16px",
        backgroundColor: "#f5f5f5",
        borderRadius: "12px"
      }}>
        Loading map and nearby medical facilities...
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "500px",
        color: "red",
        fontSize: "16px",
        backgroundColor: "#f5f5f5",
        borderRadius: "12px"
      }}>
        {error}
      </div>
    );
  }

  // Render error if no location available
  if (!userLat || !userLon) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "500px",
        fontSize: "16px",
        backgroundColor: "#f5f5f5",
        borderRadius: "12px"
      }}>
        Location not available
      </div>
    );
  }

  // Render the interactive map with markers
  return (
    <div style={{ width: "100%", height: "500px", position: "relative" }}>
      {/* Leaflet Map Container with OpenStreetMap tiles */}
      <MapContainer
        center={[userLat, userLon]}
        zoom={14}
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
        }}
      >
        {/* OpenStreetMap tile layer - free and no API key required */}
        <TileLayer
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {/* User location marker */}
        <Marker position={[userLat, userLon]} icon={userIcon}>
          <Popup>
            <div style={{ padding: "5px" }}>
              <strong>Your Location</strong>
            </div>
          </Popup>
        </Marker>
        
        {/* Medical facility markers */}
        {medicalPlaces.map((place, index) => (
          <Marker 
            key={index} 
            position={[place.lat, place.lon]} 
            icon={getMarkerIcon(place.type)}
          >
            <Popup>
              <div style={{ padding: "10px", minWidth: "200px" }}>
                <h3 style={{ margin: "0 0 5px 0", fontSize: "14px" }}>{place.name}</h3>
                <p style={{ margin: "0 0 3px 0", fontSize: "12px", color: "#666" }}>
                  <strong>Type:</strong> {place.type}
                </p>
                <p style={{ margin: "0", fontSize: "12px", color: "#666" }}>
                  <strong>Address:</strong> {place.address}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {/* Legend showing marker colors */}
      <div style={{
        position: "absolute",
        top: "10px",
        right: "10px",
        backgroundColor: "white",
        padding: "10px",
        borderRadius: "5px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        fontSize: "12px",
        zIndex: 1000
      }}>
        <div style={{ marginBottom: "5px", fontWeight: "bold" }}>Legend:</div>
        <div style={{ display: "flex", alignItems: "center", marginBottom: "3px" }}>
          <div style={{ width: "12px", height: "12px", backgroundColor: "#FF0000", borderRadius: "50%", marginRight: "5px" }}></div>
          Hospitals
        </div>
        <div style={{ display: "flex", alignItems: "center", marginBottom: "3px" }}>
          <div style={{ width: "12px", height: "12px", backgroundColor: "#0000FF", borderRadius: "50%", marginRight: "5px" }}></div>
          Clinics
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ width: "12px", height: "12px", backgroundColor: "#00FF00", borderRadius: "50%", marginRight: "5px" }}></div>
          Pharmacies
        </div>
      </div>
    </div>
  );
}