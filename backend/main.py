from typing import List

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

import models
import schemas
from database import engine, get_db
from gemini_service import generate_meal_plan

# Create all DB tables on startup
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Meal Prep Scheduler API", version="1.0.0")

# Allow requests from the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "🍲 AI Meal Prep Scheduler API is running!"}


@app.post("/api/mealplan/generate", response_model=schemas.GeneratePlanResponse)
def generate_plan(
    request: schemas.GeneratePlanRequest,
    db: Session = Depends(get_db),
):
    if not request.ingredients:
        raise HTTPException(
            status_code=400, detail="Please provide at least one ingredient."
        )
    try:
        plan = generate_meal_plan(
            request.ingredients, request.days_available, request.servings
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Gemini error: {exc}")

    return schemas.GeneratePlanResponse(
        meals=[schemas.MealOut(**m) for m in plan.get("meals", [])],
        shopping_list=[
            schemas.ShoppingItemOut(**s) for s in plan.get("shopping_list", [])
        ],
    )


@app.post("/api/plans/save", response_model=schemas.SavedPlanOut)
def save_plan(plan: schemas.SavePlanRequest, db: Session = Depends(get_db)):
    db_plan = models.SavedPlan(
        title=plan.title or "My meal plan",
        ingredients=plan.ingredients,
        plan=plan.plan,
    )
    db.add(db_plan)
    db.commit()
    db.refresh(db_plan)
    return db_plan


@app.get("/api/plans/saved", response_model=List[schemas.SavedPlanOut])
def get_saved_plans(db: Session = Depends(get_db)):
    return db.query(models.SavedPlan).order_by(models.SavedPlan.created_at.desc()).all()


@app.delete("/api/plans/saved/{plan_id}")
def delete_plan(plan_id: int, db: Session = Depends(get_db)):
    plan = db.query(models.SavedPlan).filter(models.SavedPlan.id == plan_id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found.")
    db.delete(plan)
    db.commit()
    return {"message": "Saved plan deleted successfully."}
