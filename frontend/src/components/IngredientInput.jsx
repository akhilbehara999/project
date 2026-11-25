import { useState } from "react";

const DAY_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 10, 14];
const SERVINGS_OPTIONS = [1, 2, 3, 4, 5];

export default function IngredientInput({ onGenerate, loading }) {
  const [inputValue, setInputValue] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [daysAvailable, setDaysAvailable] = useState(5);
  const [servings, setServings] = useState(2);

  const addIngredient = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !ingredients.includes(trimmed)) {
      setIngredients([...ingredients, trimmed]);
      setInputValue("");
    }
  };

  const removeIngredient = (item) => {
    setIngredients(ingredients.filter((i) => i !== item));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addIngredient();
    }
  };

  const handleGenerate = () => {
    if (ingredients.length === 0) return;
    onGenerate(ingredients, Number(daysAvailable), Number(servings));
  };

  return (
    <div className="card input-card">
      <h2 className="section-title">🥘 What do you have in the kitchen?</h2>
      <p className="subtitle">
        Type your ingredients and let AI plan your week of meals!
      </p>

      <div className="input-row">
        <input
          type="text"
          className="text-input"
          placeholder="e.g. chicken, potatoes, broccoli, rice..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className="btn btn-secondary" onClick={addIngredient}>
          + Add
        </button>
      </div>

      {ingredients.length > 0 && (
        <div className="tags">
          {ingredients.map((ing) => (
            <span key={ing} className="tag">
              {ing}
              <button
                className="tag-remove"
                onClick={() => removeIngredient(ing)}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="options-row">
        <div className="option-group">
          <label className="option-label">Days available</label>
          <select
            className="select-input"
            value={daysAvailable}
            onChange={(e) => setDaysAvailable(Number(e.target.value))}
          >
            {DAY_OPTIONS.map((d) => (
              <option key={d} value={d}>
                {d} day{d > 1 ? "s" : ""}
              </option>
            ))}
          </select>
        </div>

        <div className="option-group">
          <label className="option-label">Servings per meal</label>
          <select
            className="select-input"
            value={servings}
            onChange={(e) => setServings(Number(e.target.value))}
          >
            {SERVINGS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        className="btn btn-primary full-width"
        onClick={handleGenerate}
        disabled={ingredients.length === 0 || loading}
      >
        {loading ? "🤖 Planning..." : "✨ Generate Meal Plan"}
      </button>
    </div>
  );
}
