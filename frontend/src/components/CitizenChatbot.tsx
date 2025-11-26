import { useState, useEffect, useRef } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Configure axios base URL for backend API calls
axios.defaults.baseURL = "http://127.0.0.1:8000";

// Interface for chat messages with role-based typing
interface MessageType {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function CitizenChatbot() {
  // State for user input message
  const [message, setMessage] = useState<string>("");
  
  // State for chat conversation history with structured message types
  const [messages, setMessages] = useState<MessageType[]>([]);
  
  // State for loading indicator while waiting for AI response
  const [loading, setLoading] = useState<boolean>(false);
  
  // State for user's GPS coordinates for location-aware health advice
  const [userLat, setUserLat] = useState<number | null>(null);
  const [userLon, setUserLon] = useState<number | null>(null);
  
  // State for location access status
  const [locationError, setLocationError] = useState<string>("");
  
  // Ref for auto-scrolling to latest message in chat container
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Function to scroll chat container to bottom (latest message)
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Effect to auto-scroll when new messages are added
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Effect to get user's location when component mounts
  useEffect(() => {
    // Geolocation API gets user's current GPS coordinates
    // Required for weather-aware health recommendations
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        setUserLat(lat);
        setUserLon(lon);
        console.log("CitizenChatbot: location detected", lat, lon);
      },
      (error) => {
        console.error("CitizenChatbot: geolocation error", error);
        setLocationError("Location access denied. Health advice may be limited.");
      }
    );
  }, []);

  // Function to send message to citizen health agent backend
  const handleSendMessage = async () => {
    // Validate input
    if (!message.trim()) {
      alert("Please enter a health question");
      return;
    }

    console.log("CitizenChatbot: sending message", message);
    
    // Add user message to chat immediately for better UX
    const userMessage: MessageType = {
      role: "user",
      content: message,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);
    
    // Clear input field and store current message
    const currentMessage = message;
    setMessage("");

    try {
      // Send POST request to citizen AI endpoint with location data
      const response = await axios.post("/citizenai", {
        message: currentMessage,
        lat: userLat || 0,
        lon: userLon || 0
      });
      
      console.log("CitizenChatbot: received AI response", response.data);

      if (response.data.success) {
        // Add structured AI response to chat
        const aiMessage: MessageType = {
          role: "assistant",
          content: response.data.response,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, aiMessage]);
      } else {
        // Handle API error response
        const errorMessage: MessageType = {
          role: "assistant",
          content: "I'm having trouble processing your request. Please try again or consult a healthcare provider directly.",
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, errorMessage]);
      }
      
    } catch (error) {
      console.error("CitizenChatbot: API error", error);
      
      // Add error message to chat
      const errorMessage: MessageType = {
        role: "assistant",
        content: "I'm currently unavailable. Please try again later or contact a healthcare provider for urgent concerns.",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  // Handle Enter key press in input field
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div style={{
      width: "100%",
      backgroundColor: "#f5f5f5",
      padding: "0",
      borderRadius: "12px"
    }}>
      {/* Location Status */}
      {locationError && (
        <div style={{ 
          fontSize: "12px", 
          color: "#ff6b6b",
          marginBottom: "10px",
          textAlign: "center"
        }}>
          {locationError}
        </div>
      )}
      
      {userLat && userLon && (
        <div style={{ 
          fontSize: "12px", 
          color: "#28a745",
          marginBottom: "10px",
          textAlign: "center"
        }}>
          ✓ Location-aware health guidance enabled
        </div>
      )}

      {/* Chat Container */}
      <div style={{
        backgroundColor: "white",
        borderRadius: "12px",
        padding: "20px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
      }}>
        {/* Messages Area with structured markdown rendering */}
        <div style={{
          maxHeight: "350px",
          overflowY: "auto",
          marginBottom: "20px",
          padding: "10px"
        }}>
          {messages.length === 0 && (
            <div style={{
              textAlign: "center",
              color: "#999",
              fontSize: "14px",
              padding: "30px"
            }}>
              👩‍⚕️ Ask me about your health concerns and get comprehensive, weather-aware guidance with diet plans, wellness tips, and more.
            </div>
          )}
          
          {/* Render chat messages with proper markdown formatting */}
          {messages.map((msg, index) => (
            <div
              key={index}
              style={{
                marginBottom: "16px",
                display: "flex",
                justifyContent: msg.role === "user" ? "flex-end" : "flex-start"
              }}
            >
              <div
                style={{
                  maxWidth: msg.role === "user" ? "70%" : "100%",
                  padding: msg.role === "user" ? "12px 16px" : "0",
                  borderRadius: msg.role === "user" ? "18px" : "0",
                  backgroundColor: msg.role === "user" ? "#007bff" : "transparent",
                  color: msg.role === "user" ? "white" : "#333",
                  fontSize: "14px",
                  lineHeight: "1.5"
                }}
              >
                {msg.role === "user" ? (
                  <div>{msg.content}</div>
                ) : (
                  // Use ReactMarkdown for structured AI responses with proper formatting
                  <div style={{
                    backgroundColor: "#f8f9fa",
                    padding: "16px",
                    borderRadius: "12px",
                    border: "1px solid #e9ecef"
                  }}>
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        // Custom styling for section headings
                        h1: ({children}) => (
                          <h1 style={{
                            fontSize: "18px",
                            fontWeight: "bold",
                            color: "#333",
                            margin: "16px 0 8px 0",
                            borderBottom: "2px solid #007bff",
                            paddingBottom: "4px"
                          }}>
                            {children}
                          </h1>
                        ),
                        h2: ({children}) => (
                          <h2 style={{
                            fontSize: "16px",
                            fontWeight: "bold",
                            color: "#444",
                            margin: "14px 0 6px 0"
                          }}>
                            {children}
                          </h2>
                        ),
                        // Custom styling for bullet points
                        ul: ({children}) => (
                          <ul style={{
                            margin: "8px 0",
                            paddingLeft: "20px",
                            listStyleType: "disc"
                          }}>
                            {children}
                          </ul>
                        ),
                        li: ({children}) => (
                          <li style={{
                            margin: "4px 0",
                            lineHeight: "1.4"
                          }}>
                            {children}
                          </li>
                        ),
                        // Custom styling for paragraphs
                        p: ({children}) => (
                          <p style={{
                            margin: "6px 0",
                            lineHeight: "1.4"
                          }}>
                            {children}
                          </p>
                        ),
                        // Custom styling for strong text
                        strong: ({children}) => (
                          <strong style={{
                            fontWeight: "600",
                            color: "#333"
                          }}>
                            {children}
                          </strong>
                        )
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {/* Loading indicator */}
          {loading && (
            <div style={{
              display: "flex",
              justifyContent: "flex-start",
              marginBottom: "16px"
            }}>
              <div style={{
                padding: "12px 16px",
                borderRadius: "18px",
                backgroundColor: "#f8f9fa",
                color: "#666",
                fontSize: "14px",
                border: "1px solid #e9ecef"
              }}>
                🤔 Analyzing your health concern and current weather conditions...
              </div>
            </div>
          )}
          
          {/* Auto-scroll target */}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div style={{ display: "flex", gap: "12px", alignItems: "flex-end" }}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Describe your health concern (e.g., headache, fatigue, stress)..."
            disabled={loading}
            style={{
              flex: 1,
              padding: "14px 16px",
              border: "2px solid #e9ecef",
              borderRadius: "8px",
              fontSize: "14px",
              outline: "none",
              backgroundColor: loading ? "#f5f5f5" : "white",
              transition: "border-color 0.2s",
              fontFamily: "inherit"
            }}
            onFocus={(e) => e.target.style.borderColor = "#007bff"}
            onBlur={(e) => e.target.style.borderColor = "#e9ecef"}
          />
          
          <button
            onClick={handleSendMessage}
            disabled={loading || !message.trim()}
            style={{
              padding: "14px 24px",
              backgroundColor: loading || !message.trim() ? "#ccc" : "#007bff",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: loading || !message.trim() ? "not-allowed" : "pointer",
              minWidth: "80px",
              transition: "background-color 0.2s"
            }}
          >
            {loading ? "..." : "Ask"}
          </button>
        </div>
      </div>

      {/* Medical Disclaimer */}
      <div style={{
        fontSize: "11px",
        color: "#888",
        textAlign: "center",
        marginTop: "12px",
        lineHeight: "1.3"
      }}>
        ⚠️ This provides general wellness guidance only. Always consult healthcare professionals for medical advice.
      </div>
    </div>
  );
}