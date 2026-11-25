import { useCallback, useEffect, useState } from "react";
import IngredientInput from "./components/IngredientInput";
import PlanDisplay from "./components/PlanDisplay";
import SavedPlans from "./components/SavedPlans";
import { generateMealPlan, savePlan, getSavedPlans } from "./api";
import "./App.css";

export default function App() {
  const [activeTab, setActiveTab] = useState("generate");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [plan, setPlan] = useState(null);
  const [savedPlans, setSavedPlans] = useState([]);
  const [lastIngredients, setLastIngredients] = useState([]);

  const fetchSaved = useCallback(async () => {
    try {
      const data = await getSavedPlans();
      setSavedPlans(data);
    } catch {
      /* silently fail */
    }
  }, []);

  useEffect(() => {
    fetchSaved();
  }, [fetchSaved]);

  const handleGenerate = async (ingredients, daysAvailable, servings) => {
    setLoading(true);
    setError("");
    setPlan(null);
    setLastIngredients(ingredients);
    try {
      const data = await generateMealPlan(ingredients, daysAvailable, servings);
      setPlan(data);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (title, ingredients) => {
    try {
      await savePlan({
        title,
        ingredients,
        plan: JSON.stringify(plan),
      });
      await fetchSaved();
    } catch (err) {
      setError("Could not save the plan: " + err.message);
    }
  };

  const handleDelete = (deletedId) => {
    setSavedPlans((prev) => prev.filter((r) => r.id !== deletedId));
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="logo">🍲</div>
          <div>
            <h1 className="app-title">AI Meal Prep Scheduler</h1>
            <p className="app-tagline">
              Plan your week from what you already have
            </p>
          </div>
        </div>
      </header>

      <nav className="tab-bar">
        <button
          className={`tab-btn ${activeTab === "generate" ? "active" : ""}`}
          onClick={() => setActiveTab("generate")}
        >
          ✨ Generate Plan
        </button>
        <button
          className={`tab-btn ${activeTab === "saved" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("saved");
            fetchSaved();
          }}
        >
          💾 Saved Plans
          {savedPlans.length > 0 && (
            <span className="badge">{savedPlans.length}</span>
          )}
        </button>
      </nav>

      <main className="main-content">
        {activeTab === "generate" && (
          <div>
            <IngredientInput onGenerate={handleGenerate} loading={loading} />

            {error && (
              <div className="error-box">
                ⚠️ {error}
              </div>
            )}

            {loading && (
              <div className="loading-box">
                <div className="spinner" />
                <p>Gemini is planning your week of meals...</p>
              </div>
            )}

            {plan && plan.meals && plan.meals.length > 0 && (
              <PlanDisplay
                plan={plan}
                ingredients={lastIngredients}
                onSave={handleSave}
              />
            )}
          </div>
        )}

        {activeTab === "saved" && (
          <div>
            <div className="saved-header">
              <h2 className="section-title">💾 Your Saved Meal Plans</h2>
              <span className="saved-count">
                {savedPlans.length} plan{savedPlans.length !== 1 ? "s" : ""}
              </span>
            </div>
            <SavedPlans plans={savedPlans} onDelete={handleDelete} />
          </div>
        )}
      </main>

      <footer className="app-footer">
        Built with React · FastAPI · SQLite · Gemini API
      </footer>
    </div>
  );
}
