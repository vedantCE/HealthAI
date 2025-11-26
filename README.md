🚑 HealthAI — Setup & Installation Guide

A complete guide to run the HealthAI Full Stack Application on any system.

✅ 1. Requirements
System Requirements

Python 3.11+

Node.js 18+

Gemini API Key

MongoDB Atlas API Key

OPENWEATHER API Key

📦 2. Create and Activate Virtual Environment
Windows
cd backend
python -m venv venv
venv\Scripts\activate

Mac / Linux
cd backend
python3.11 -m venv venv
source venv/bin/activate

📥 3. Install Python Dependencies

If requirements.txt is NOT available, create a new file named:

requirements.txt
fastapi
uvicorn
python-dotenv
pymongo
requests
langchain
langchain-google-genai
google-generativeai

Install packages:
pip install -r requirements.txt

🔑 4. Add Environment Variables (.env)

Inside backend/.env create:

MONGO_URI=your_mongo_connection_string
DB_NAME=HealthAI
GEMINI_API_KEY=your_gemini_api_key
OPENWEATHER_API_KEY=your_openweather_api_key

▶️ 5. Run the Backend

Go to backend folder

cd backend


If venv is NOT active:

venv\Scripts\activate   # Windows
# or
source venv/bin/activate  # Mac/Linux


Run backend:

uvicorn app:app --reload


Backend runs at:
👉 http://127.0.0.1:8000

💻 6. Setup and Run Frontend

Open a new terminal:

cd frontend
npm install
npm install axios
npm install react-router-dom
npm install leaflet react-leaflet
npm install --save-dev @types/leaflet
npm run dev


Frontend runs at:
👉 http://localhost:5173

🧪 7. Features Working Out-of-the-Box

✔️ Login / Signup
✔️ Live location map (Leaflet)
✔️ Gemini-powered health agent
✔️ Weather-aware citizen advice
✔️ Landing page chatbot
✔️ Citizen dashboard AI sections
✔️ MongoDB data storage

❗ Troubleshooting
Backend: Module Not Found

Run:

pip install -r requirements.txt

Frontend: Blank Page

Run:

npm install
npm run dev

Chat agent not working

Check .env → verify:

GEMINI_API_KEY=correct_key
