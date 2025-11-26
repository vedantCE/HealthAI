import { useNavigate } from "react-router-dom";
import FloatingChatbot from "../components/FloatingChatbot";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={{
      backgroundColor: "#f5f5f5",
      minHeight: "100vh",
      padding: "40px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      position: "relative"
    }}>
      {/* Login Button */}
      <div style={{
        position: "absolute",
        top: "20px",
        right: "20px"
      }}>
        <button
          onClick={() => navigate("/login")}
          style={{
            padding: "12px 24px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "600",
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0,123,255,0.3)"
          }}
        >
          Login
        </button>
      </div>

      {/* Main Title Section */}
      <div style={{
        textAlign: "center",
        marginBottom: "40px",
        marginTop: "60px"
      }}>
        <h1 style={{
          fontSize: "48px",
          fontWeight: "bold",
          color: "#333",
          margin: "0 0 16px 0"
        }}>
          🏥 SurgeSense
        </h1>
        <p style={{
          fontSize: "20px",
          color: "#666",
          margin: "0",
          maxWidth: "500px"
        }}>
          Your intelligent health companion providing instant medical guidance and location-based healthcare services
        </p>
      </div>

      {/* Services Overview */}
      <div style={{
        width: "100%",
        maxWidth: "800px",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "20px",
        marginBottom: "40px"
      }}>
        <div style={{
          backgroundColor: "white",
          padding: "24px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          textAlign: "center"
        }}>
          <div style={{ fontSize: "32px", marginBottom: "12px" }}>🤖</div>
          <h3 style={{ margin: "0 0 8px 0", color: "#333" }}>AI Health Assistant</h3>
          <p style={{ margin: "0", color: "#666", fontSize: "14px" }}>
            Get instant wellness tips and health guidance
          </p>
        </div>
        
        <div style={{
          backgroundColor: "white",
          padding: "24px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          textAlign: "center"
        }}>
          <div style={{ fontSize: "32px", marginBottom: "12px" }}>🗺️</div>
          <h3 style={{ margin: "0 0 8px 0", color: "#333" }}>Find Medical Facilities</h3>
          <p style={{ margin: "0", color: "#666", fontSize: "14px" }}>
            Locate nearby hospitals, clinics, and pharmacies
          </p>
        </div>
        
        <div style={{
          backgroundColor: "white",
          padding: "24px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          textAlign: "center"
        }}>
          <div style={{ fontSize: "32px", marginBottom: "12px" }}>🌤️</div>
          <h3 style={{ margin: "0 0 8px 0", color: "#333" }}>Weather-Aware Care</h3>
          <p style={{ margin: "0", color: "#666", fontSize: "14px" }}>
            Health advice tailored to current weather conditions
          </p>
        </div>
      </div>

      {/* Call to Action */}
      <div style={{
        textAlign: "center",
        marginTop: "20px"
      }}>
        <button
          onClick={() => navigate("/login")}
          style={{
            padding: "16px 32px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "600",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(40,167,69,0.3)",
            marginRight: "16px"
          }}
        >
          Get Started
        </button>
        <p style={{
          marginTop: "16px",
          color: "#666",
          fontSize: "14px"
        }}>
          💬 Try our quick wellness chatbot (bottom-right) or login for comprehensive health guidance
        </p>
      </div>

      {/* Footer Information */}
      <div style={{
        marginTop: "40px",
        textAlign: "center",
        color: "#888",
        fontSize: "12px",
        maxWidth: "500px"
      }}>
        <p>
          SurgeSense provides AI-powered health guidance, location-based medical facility search, 
          and weather-aware wellness recommendations.
        </p>
      </div>

      {/* Floating Chatbot - Only on Landing Page */}
      <FloatingChatbot />
    </div>
  );
}