"""Calls the Gemini API to generate a weekly meal plan from the ingredients you have."""

import json
import os

import requests
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")
MODEL = os.getenv("GEMINI_MODEL", "gemini-3.5-flash-lite")
BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models"
TIMEOUT_SECONDS = 60


def generate_meal_plan(
    ingredients: list[str], days_available: int, servings: int = 2
) -> dict:
    """Ask Gemini to plan a meal for each of the next `days_available` days.

    Returns a dict: {"meals": [...], "shopping_list": [...]}
    """
    if not API_KEY:
        raise Exception(
            "GEMINI_API_KEY is not set. Create a .env file in backend/ with your key."
        )

    prompt = f"""You are a meal planner.

The user has these ingredients on hand:
{", ".join(ingredients)}

Plan a meal for each of the next {days_available} days ({days_available} meals total). For each day provide:
- "day": the day name ("Monday", "Tuesday", ...; if days go beyond 7 use "Day 1", "Day 2", ...)
- "meal": a short description of the main meal
- "recipes": a list of recipes. Each recipe has:
  - "title": recipe name
  - "ingredients": bulleted ingredients string (e.g. "• 1 cup rice\n• 2 tbsp oil")
  - "instructions": numbered steps (e.g. "1. Cook rice\n2. Serve")
  - "time": string like "30 min"
  - "difficulty": "Easy", "Medium" or "Hard"

Also provide "shopping_list": items the user still needs to buy. Each item is
{{"item": "name", "due_within_days": number}} — an estimate of days from now until the item is needed, so that items that go bad sooner come first.

Respond ONLY with valid JSON in this exact shape, no markdown:

{{
  "meals": [
    {{
      "day": "Monday",
      "meal": "Omelette with spinach",
      "recipes": [
        {{
          "title": "Omelette",
          "ingredients": "• 3 eggs\n• handful spinach\n• oil",
          "instructions": "1. Beat eggs.\n2. Cook in oil with spinach.",
          "time": "15 min",
          "difficulty": "Easy"
        }}
      ]
    }}
  ],
  "shopping_list": [
    {{"item": "Lemon", "due_within_days": 2}}
  ]
}}"""

    response = requests.post(
        f"{BASE_URL}/{MODEL}:generateContent",
        headers={
            "x-goog-api-key": API_KEY,
            "Content-Type": "application/json",
        },
        json={
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {"responseMimeType": "application/json"},
        },
        timeout=TIMEOUT_SECONDS,
    )

    if not response.ok:
        raise Exception(f"Gemini API error {response.status_code}: {response.text}")

    data = response.json()
    candidates = data.get("candidates") or []
    if not candidates:
        raise Exception("Gemini returned no candidates.")

    text = (
        candidates[0].get("content", {}).get("parts", [{}])[0].get("text", "").strip()
    )

    # Strip markdown code fences if present
    if text.startswith("```"):
        text = "\n".join(text.split("\n")[1:-1])

    result = _extract_json(text)
    if not isinstance(result, dict):
        raise Exception("Could not parse the meal plan from Gemini's response.")
    return result


def _extract_json(text: str):
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        start = text.find("{")
        end = text.rfind("}")
        if start != -1 and end > start:
            try:
                return json.loads(text[start : end + 1])
            except json.JSONDecodeError:
                return None
        return None
