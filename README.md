# 🚀 HealthAI – Full Setup Guide

This README explains how to run both **backend** and **frontend** of the HealthAI project, including all required installations, environment variables, and commands.

---

## ✅ 1. System Requirements
- **Python 3.11+**
- **Node.js 18+**
- **MongoDB Connection URI**
- **Gemini API Key**
- **OpenWeather API Key (optional)**

---

## 📦 2. Create and Activate Virtual Environment

### **Windows**
```bash
cd backend
python -m venv venv
venv\Scripts\activate

Mac / Linux
cd backend
python3.11 -m venv venv
source venv/bin/activate

📥 3. Install Python Dependencies
Ensure requirements.txt exists in /backend

If missing, create a file named requirements.txt containing:

fastapi
uvicorn
python-dotenv
pymongo
requests
langchain
langchain-google-genai
google-generativeai

Then install:
pip install -r requirements.txt

🔑 4. Add Environment Variables

Create file:

backend/.env


Add:

MONGO_URI=your_mongo_connection_string
DB_NAME=HealthAI
GEMINI_API_KEY=your_gemini_api_key
OPENWEATHER_API_KEY=your_openweather_key   # optional

▶️ 5. Run the Backend
cd backend
source venv/bin/activate   # Mac/Linux
# OR
venv\Scripts\activate      # Windows

uvicorn app:app --reload


Backend will start at:
👉 http://127.0.0.1:8000

💻 6. Setup and Run Frontend

Open new terminal:

cd frontend
npm install
npm install axios
npm install react-router-dom
npm install leaflet react-leaflet
npm install --save-dev @types/leaflet
npm run dev


Frontend runs at:
👉 http://localhost:5173

🧪 7. Features Included
✔ Backend Features

FastAPI server

MongoDB integration

Gemini AI Citizen Health Agent

Weather-aware health advice

Landing page chatbot

✔ Frontend Features

User Login (Citizen / Hospital)

Live Location Map (Leaflet)

Citizen Dashboard with section-wise AI advice

Floating AI Chatbot on Landing Page

❗ Troubleshooting
❌ Backend error: ModuleNotFoundError

Fix:

pip install -r requirements.txt

❌ Frontend blank screen

Fix:

npm install
npm run dev

❌ Gemini not responding

Check:

GEMINI_API_KEY in .env is correct

❌ MongoDB connection failed

Verify:

MONGO_URI must include username/password
