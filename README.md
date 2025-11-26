✅ 1. Requirements

System Requirements

Python 3.11+
Gemini API Key
MongoDB API Key
OPENWEATHER_API_KEY

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

Make sure requirements.txt exists with if not requirement.txt avalaible in backend 
folder create it 

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

🔑 4. Add Environment Variables (.env)

Inside backend/.env create:

MONGO_URI=your_mongo_connection_string
DB_NAME=HealthAI
GEMINI_API_KEY=your_gemini_api_key

▶️ 5. Run the Backend
1.cd backend
2.if venv not activate then paste this: venv\Scripts\activate
3.uvicorn app:app --reload


Server runs at:
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

React app runs at:
👉 http://localhost:5173

🧪 7. Features Working Out-of-the-Box

🔐 Login / Signup

🗺 Live location map (Leaflet)

🧠 Gemini-powered health agent

🌦 Weather-aware citizen advice

💬 Landing page chatbot

🏥 Citizen dashboard AI sections

📡 MongoDB data storage

❗ Troubleshooting
If backend fails because module not found:

Run:

pip install -r requirements.txt

If frontend shows blank page:

Run:

npm install
npm run dev

If chat agent fails:

Check .env contains the correct Gemini key.
