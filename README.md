# 🍲 AI Meal Prep Scheduler

A simple, working web app: type the ingredients you have, pick how many days of meals you need, and AI (Google Gemini) generates a weekly meal plan with recipes and a shopping list grouped so items you need soon come first — nothing goes to waste. Save plans and view them later.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | Python + FastAPI + SQLAlchemy + SQLite |
| Frontend | React 18 + Vite |
| AI | Google Gemini API |
| Config | python-dotenv |

## Get an API Key

Create a free key at [aistudio.google.dev/apikey](https://aistudio.google.dev/apikey).

## Setup

### 1. Backend

```bash
cd backend

pip install -r requirements.txt
cp .env.example .env        # then add your GEMINI_API_KEY in .env

python -m uvicorn main:app --reload --port 8000
```

The API will be available at: http://localhost:8000 (docs: http://localhost:8000/docs)

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

The app will be available at: http://localhost:5173

## Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check |
| POST | `/api/mealplan/generate` | Generate a meal plan |
| POST | `/api/plans/save` | Save a generated plan |
| GET | `/api/plans/saved` | Get all saved plans |
| DELETE | `/api/plans/saved/{id}` | Delete a saved plan |

## Run for Production

```bash
# frontend build
cd frontend && npm run build

# serve or serve the backend with the DB
cd backend && uvicorn main:app --port 8000
```
