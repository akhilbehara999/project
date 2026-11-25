from datetime import datetime
from typing import List

from pydantic import BaseModel, Field


class GeneratePlanRequest(BaseModel):
    ingredients: List[str] = Field(..., min_length=1)
    days_available: int = Field(5, ge=1, le=14)
    servings: int = Field(2, ge=1, le=8)


class RecipeOut(BaseModel):
    title: str
    ingredients: str
    instructions: str
    time: str
    difficulty: str


class MealOut(BaseModel):
    day: str
    meal: str
    recipes: List[RecipeOut] = Field(default_factory=list)


class ShoppingItemOut(BaseModel):
    item: str
    due_within_days: int = Field(3, ge=1, le=30)


class GeneratePlanResponse(BaseModel):
    meals: List[MealOut] = Field(default_factory=list)
    shopping_list: List[ShoppingItemOut] = Field(default_factory=list)


class SavePlanRequest(BaseModel):
    title: str
    ingredients: str
    plan: str


class SavedPlanOut(BaseModel):
    id: int
    title: str
    ingredients: str
    plan: str
    created_at: datetime

    model_config = {"from_attributes": True}
