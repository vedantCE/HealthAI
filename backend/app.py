from fastapi import FastAPI, Query
from pydantic import BaseModel
from pymongo import MongoClient
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

# Import utility functions for weather and location services
from utils.weather_api import get_weather
from utils.location_api import find_nearby_clinics
from utils.overpass_api import find_medical_places
from agents.citizen_agent import generate_citizen_response
from agents.landing_agent import generate_landing_response


load_dotenv()

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],  # Vite default ports
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# MongoDB
client = MongoClient(os.getenv("MONGO_URI"))
db = client["SurgeSense"]  #databse je create thay tenu name 
users = db["users"]

print("Mongo connected successfully")

# Seed users once
if users.count_documents({}) == 0:
    users.insert_many([
        {"email": "citizen@manuals", "password": "1234", "role": "citizen"},
        {"email": "hospital@manuals", "password": "9999", "role": "hospital"},
    ])
    print("Users seeded")


class LoginModel(BaseModel):
    email: str
    password: str


class CitizenAIModel(BaseModel):
    message: str
    lat: float
    lon: float


class LandingAIModel(BaseModel):
    message: str
    lat: float
    lon: float


@app.post("/login")
def login(data: LoginModel):
    print("Login request received:", data.email)

    user = users.find_one({
        "email": data.email,
        "password": data.password
    })

    if not user:
        print("Invalid credentials")
        return {"success": False, "message": "Invalid email or password"}

    print("Login successful as:", user["role"])
    return {
        "success": True,
        "role": user["role"],
        "message": f"Successfully logged in as {user['role']}"
    }


@app.get("/weather")
def get_weather_data(
    lat: float = Query(..., description="Latitude coordinate"),
    lon: float = Query(..., description="Longitude coordinate")
):
    """
    Get current weather data for given GPS coordinates
    Uses OpenWeatherMap API to fetch temperature, humidity, and weather description
    
    Args:
        lat: Latitude coordinate (required)
        lon: Longitude coordinate (required)
    
    Returns:
        JSON response with weather data or error status
    """
    print(f"Weather request for coordinates: {lat}, {lon}")
    
    # Call weather utility function with coordinates
    weather_data = get_weather(lat, lon)
    
    if weather_data:
        return {
            "success": True,
            "weather": weather_data
        }
    else:
        return {
            "success": False,
            "message": "Failed to fetch weather data"
        }


@app.get("/clinics")
def get_nearby_clinics(
    lat: float = Query(..., description="Latitude coordinate"),
    lon: float = Query(..., description="Longitude coordinate")
):
    """
    Find nearby clinics and hospitals for given GPS coordinates
    Uses OpenStreetMap Nominatim API to search for healthcare facilities
    
    Args:
        lat: Latitude coordinate (required)
        lon: Longitude coordinate (required)
    
    Returns:
        JSON response with list of nearby clinics or error status
    """
    print(f"Clinic search request for coordinates: {lat}, {lon}")
    
    # Call location utility function with coordinates
    clinics = find_nearby_clinics(lat, lon)
    
    return {
        "success": True,
        "clinics": clinics
    }


@app.get("/nearby-medical")
def get_nearby_medical_facilities(
    lat: float = Query(..., description="Latitude coordinate"),
    lon: float = Query(..., description="Longitude coordinate")
):
    """
    Find nearby medical facilities (clinics, hospitals, pharmacies) using Overpass API
    
    This endpoint uses the Overpass API to search for medical facilities within
    a 1500-meter radius of the provided GPS coordinates. Overpass API provides
    more comprehensive and accurate results than other geocoding services.
    
    Args:
        lat: Latitude coordinate (required, float)
        lon: Longitude coordinate (required, float)
    
    Returns:
        JSON response with list of nearby medical facilities including:
        - name: Facility name
        - lat/lon: Exact coordinates
        - type: clinic, hospital, or pharmacy
        - address: Street address if available
    """
    print(f"Medical facilities search request for coordinates: {lat}, {lon}")
    
    # Validate coordinate ranges
    if not (-90 <= lat <= 90):
        return {
            "success": False,
            "message": "Invalid latitude. Must be between -90 and 90"
        }
    
    if not (-180 <= lon <= 180):
        return {
            "success": False,
            "message": "Invalid longitude. Must be between -180 and 180"
        }
    
    # Call Overpass API utility function with coordinates
    medical_places = find_medical_places(lat, lon)
    
    print(f"Returning {len(medical_places)} medical facilities")
    
    return {
        "success": True,
        "places": medical_places
    }


@app.post("/citizenai")
def citizen_ai_assistant(data: CitizenAIModel):
    """
    AI Health Assistant for citizens using LangChain + Gemini 2.0 Flash
    Provides structured, weather-aware health advice based on user questions and location
    
    Args:
        data: CitizenAIModel containing message, lat, and lon
    
    Returns:
        JSON response with structured health advice including weather considerations
    """
    print(f"Citizen AI request: '{data.message}' at location: {data.lat}, {data.lon}")
    
    try:
        # Get weather data for location-aware health advice
        weather_data = get_weather(data.lat, data.lon)
        
        if not weather_data:
            # Use default weather if API fails
            weather_data = {
                "temperature": 25,
                "humidity": 60,
                "description": "moderate conditions"
            }
            print("Using default weather data due to API failure")
        
        # Generate structured response using LangChain citizen agent
        response = generate_citizen_response(data.message, weather_data)
        
        print("LangChain Citizen Agent: response generated successfully")
        
        return {
            "success": True,
            "response": response,
            "weather": weather_data,
            "location": {
                "lat": data.lat,
                "lon": data.lon
            }
        }
        
    except Exception as e:
        print(f"Citizen AI error: {str(e)}")
        return {
            "success": False,
            "message": "Health assistant temporarily unavailable. Please try again or consult a healthcare provider.",
            "location": {
                "lat": data.lat,
                "lon": data.lon
            }
        }


@app.post("/landingai")
def landing_ai_assistant(data: LandingAIModel):
    """
    AI Wellness Assistant for landing page visitors
    Provides short, friendly wellness tips without requiring login
    
    Args:
        data: LandingAIModel containing message, lat, and lon
    
    Returns:
        JSON response with short wellness advice
    """
    print(f"Landing AI request: '{data.message}' at location: {data.lat}, {data.lon}")
    
    try:
        # Generate short, friendly response using Landing Agent
        response = generate_landing_response(data.message, data.lat, data.lon)
        
        print("Landing AI response generated successfully")
        
        return {
            "success": True,
            "response": response,
            "location": {
                "lat": data.lat,
                "lon": data.lon
            }
        }
        
    except Exception as e:
        print(f"Landing AI error: {str(e)}")
        return {
            "success": False,
            "message": "Wellness assistant temporarily unavailable. Please try again!",
            "location": {
                "lat": data.lat,
                "lon": data.lon
            }
        }
