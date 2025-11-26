import { useState, useEffect, useRef } from "react";
import axios from "axios";

// Configure axios for landing page chatbot
axios.defaults.baseURL = "http://127.0.0.1:8000";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export default function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message to landing agent (simple wellness advice)
  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: message
    };

    setMessages(prev => [...prev, userMessage]);
    setLoading(true);
    
    const currentMessage = message;
    setMessage("");

    try {
      // Get user location for weather-aware responses (optional)
      let userLat = 0;
      let userLon = 0;
      
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 3000 });
        });
        userLat = position.coords.latitude;
        userLon = position.coords.longitude;
      } catch (locationError) {
        console.log("Location not available for landing chatbot");
      }

      // Call landing agent endpoint
      const response = await axios.post("/landingai", {
        message: currentMessage,
        lat: userLat,
        lon: userLon
      });

      if (response.data.success) {
        const aiMessage: ChatMessage = {
          role: "assistant",
          content: response.data.response
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        const errorMessage: ChatMessage = {
          role: "assistant",
          content: "Hi! I'm here to help with quick wellness tips. Try asking about sleep, stress, or healthy habits!"
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error("Landing chatbot error:", error);
      const errorMessage: ChatMessage = {
        role: "assistant",
        content: "Hi! I'm here to help with quick wellness tips. Try asking about sleep, stress, or healthy habits!"
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Chat Icon */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          width: "60px",
          height: "60px",
          backgroundColor: "#007bff",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: "0 4px 12px rgba(0,123,255,0.3)",
          zIndex: 1000,
          transition: "transform 0.2s"
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
        onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
      >
        <span style={{ fontSize: "24px", color: "white" }}>
          {isOpen ? "✕" : "💬"}
        </span>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div style={{
          position: "fixed",
          bottom: "90px",
          right: "20px",
          width: "350px",
          height: "450px",
          backgroundColor: "white",
          borderRadius: "12px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden"
        }}>
          {/* Header */}
          <div style={{
            padding: "16px",
            backgroundColor: "#007bff",
            color: "white",
            fontWeight: "bold",
            fontSize: "16px"
          }}>
            💡 Quick Wellness Tips
          </div>

          {/* Messages */}
          <div style={{
            flex: 1,
            padding: "16px",
            overflowY: "auto",
            backgroundColor: "#f8f9fa"
          }}>
            {messages.length === 0 && (
              <div style={{
                textAlign: "center",
                color: "#666",
                fontSize: "14px",
                marginTop: "20px"
              }}>
                👋 Hi! Ask me for quick wellness tips like "reduce stress" or "better sleep"
              </div>
            )}

            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  marginBottom: "12px",
                  display: "flex",
                  justifyContent: msg.role === "user" ? "flex-end" : "flex-start"
                }}
              >
                <div
                  style={{
                    maxWidth: "80%",
                    padding: "8px 12px",
                    borderRadius: "12px",
                    backgroundColor: msg.role === "user" ? "#007bff" : "white",
                    color: msg.role === "user" ? "white" : "#333",
                    fontSize: "13px",
                    lineHeight: "1.4",
                    boxShadow: msg.role === "assistant" ? "0 1px 3px rgba(0,0,0,0.1)" : "none"
                  }}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div style={{
                display: "flex",
                justifyContent: "flex-start",
                marginBottom: "12px"
              }}>
                <div style={{
                  padding: "8px 12px",
                  borderRadius: "12px",
                  backgroundColor: "white",
                  color: "#666",
                  fontSize: "13px"
                }}>
                  Thinking...
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{
            padding: "16px",
            borderTop: "1px solid #e9ecef",
            display: "flex",
            gap: "8px"
          }}>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask for wellness tips..."
              disabled={loading}
              style={{
                flex: 1,
                padding: "8px 12px",
                border: "1px solid #ddd",
                borderRadius: "20px",
                fontSize: "13px",
                outline: "none"
              }}
            />
            <button
              onClick={handleSendMessage}
              disabled={loading || !message.trim()}
              style={{
                padding: "8px 16px",
                backgroundColor: loading || !message.trim() ? "#ccc" : "#007bff",
                color: "white",
                border: "none",
                borderRadius: "20px",
                fontSize: "13px",
                cursor: loading || !message.trim() ? "not-allowed" : "pointer"
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}