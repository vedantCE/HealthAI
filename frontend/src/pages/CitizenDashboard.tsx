import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import MapView from "../components/MapView";
import CitizenChatbot from "../components/CitizenChatbot";

axios.defaults.baseURL = "http://127.0.0.1:8000";

export default function CitizenDashboard() {
  const navigate = useNavigate();
  const [lat, setLat] = useState<number | null>(null);
  const [lon, setLon] = useState<number | null>(null);
  const [locationError, setLocationError] = useState<string>("");
  const [weather, setWeather] = useState<any>(null);
  const [cityName, setCityName] = useState<string>("");

  // Check if user is logged in (simple check - you can enhance this)
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('userRole') === 'citizen';
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [navigate]);

  // Fetch weather data when coordinates are available
  const fetchWeather = async (latitude: number, longitude: number) => {
    try {
      const response = await axios.get(`/weather?lat=${latitude}&lon=${longitude}`);
      if (response.data.success) {
        setWeather(response.data.weather);
      }
    } catch (error) {
      console.error("Weather fetch error:", error);
    }
  };

  // Get city name from coordinates using reverse geocoding
  const getCityName = async (latitude: number, longitude: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
        {
          headers: {
            "User-Agent": "SurgeSense/1.0"
          }
        }
      );
      const data = await response.json();
      const city = data.address?.city || data.address?.town || data.address?.village || "Unknown City";
      const country = data.address?.country || "";
      setCityName(`${city}, ${country}`);
    } catch (error) {
      console.error("City name fetch error:", error);
      setCityName("Unknown Location");
    }
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const latitude = pos.coords.latitude;
        const longitude = pos.coords.longitude;
        setLat(latitude);
        setLon(longitude);
        console.log("User location:", latitude, longitude);
        
        // Fetch weather and city name
        fetchWeather(latitude, longitude);
        getCityName(latitude, longitude);
      },
      (err) => {
        console.error("Location error:", err);
        setLocationError("Unable to get your location");
      }
    );
  }, []);

  return (
    <div style={{ 
      padding: 30, 
      backgroundColor: "#f5f5f5", 
      minHeight: "100vh" 
    }}>
      {/* Dashboard Header */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "30px"
      }}>
        <div>
          <h1 style={{ margin: "0", color: "#333" }}>Citizen Dashboard</h1>
          <p style={{ margin: "5px 0 0 0", color: "#666" }}>Your comprehensive health companion</p>
        </div>
        <button
          onClick={() => {
            localStorage.removeItem('userRole');
            navigate('/login');
          }}
          style={{
            padding: "10px 20px",
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "14px"
          }}
        >
          Logout
        </button>
      </div>
      
      {/* Location Card */}
      <div style={{
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        marginBottom: "20px"
      }}>
        <h3 style={{ margin: "0 0 15px 0", color: "#333" }}>📍 Your Live Location</h3>
        {lat && lon ? (
          <div>
            <p style={{ margin: "5px 0" }}><strong>City:</strong> {cityName || "Loading..."}</p>
            <p style={{ margin: "5px 0" }}><strong>Coordinates:</strong> {lat.toFixed(4)}, {lon.toFixed(4)}</p>
          </div>
        ) : locationError ? (
          <p style={{ color: "#dc3545", margin: "5px 0" }}>{locationError}</p>
        ) : (
          <p style={{ margin: "5px 0" }}>Getting your location...</p>
        )}
      </div>

      {/* Weather Card */}
      {weather && (
        <div style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          marginBottom: "20px"
        }}>
          <h3 style={{ margin: "0 0 15px 0", color: "#333" }}>🌤️ Current Weather</h3>
          <div style={{ display: "flex", gap: 30, flexWrap: "wrap" }}>
            <div>
              <p style={{ margin: "5px 0" }}><strong>Temperature:</strong> {weather.temperature}°C</p>
              <p style={{ margin: "5px 0" }}><strong>Humidity:</strong> {weather.humidity}%</p>
            </div>
            <div>
              <p style={{ margin: "5px 0" }}><strong>Condition:</strong> {weather.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* Medical Facilities Map Section */}
      <div style={{
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        marginBottom: "20px"
      }}>
        <h3 style={{ margin: "0 0 20px 0", color: "#333" }}>🗺️ Nearby Medical Facilities</h3>
        <MapView />
      </div>

      {/* Health Assistant Chatbot Section */}
      <div style={{
        marginTop: 30,
        width: "100%",
        maxWidth: "700px",
        backgroundColor: "white",
        padding: "24px",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        margin: "30px auto 0 auto"
      }}>
        <h2 style={{ 
          margin: "0 0 24px 0", 
          fontSize: "24px", 
          fontWeight: "bold",
          color: "#333",
          textAlign: "center"
        }}>
          🩺 Ask Your Health Assistant
        </h2>
        <p style={{
          margin: "0 0 20px 0",
          fontSize: "14px",
          color: "#666",
          textAlign: "center"
        }}>
          Get comprehensive health guidance with weather-aware recommendations, diet plans, and wellness tips
        </p>
        {/* CitizenChatbot component with structured markdown rendering */}
        <CitizenChatbot />
      </div>
    </div>
  );
}
