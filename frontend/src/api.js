const BASE_URL = "http://localhost:8000";

export const generateMealPlan = async (
  ingredients,
  daysAvailable = 5,
  servings = 2
) => {
  const res = await fetch(`${BASE_URL}/api/mealplan/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ingredients,
      days_available: daysAvailable,
      servings,
    }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Failed to generate the meal plan");
  }
  return res.json();
};

export const savePlan = async (plan) => {
  const res = await fetch(`${BASE_URL}/api/plans/save`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(plan),
  });
  if (!res.ok) throw new Error("Failed to save the plan");
  return res.json();
};

export const getSavedPlans = async () => {
  const res = await fetch(`${BASE_URL}/api/plans/saved`);
  if (!res.ok) throw new Error("Failed to fetch saved plans");
  return res.json();
};

export const deletePlan = async (id) => {
  const res = await fetch(`${BASE_URL}/api/plans/saved/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete plan");
  return res.json();
};
