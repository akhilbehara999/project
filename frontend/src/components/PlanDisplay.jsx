import { useState } from "react";

const DIFFICULTY_COLOR = {
  Easy: "#22c55e",
  Medium: "#f59e0b",
  Hard: "#ef4444",
};

export default function PlanDisplay({ plan, ingredients, onSave }) {
  const [expandedIdx, setExpandedIdx] = useState(null);
  const [title, setTitle] = useState("");

  // Split the shopping list: items needed soon first, so nothing goes to waste.
  const dueNow = (plan.shopping_list || []).filter(
    (s) => (s.due_within_days || 0) <= 7
  );
  const dueLater = (plan.shopping_list || []).filter(
    (s) => (s.due_within_days || 0) > 7
  );

  return (
    <div className="plan-display">
      <h2 className="plan-title">🍽 Your meal plan</h2>
      <p className="plan-subtitle">
        Ingredients you have: <em>{ingredients.join(", ")}</em>
      </p>

      <div className="meals-grid">
        {(plan.meals || []).map((meal, idx) => (
          <div key={meal.day + idx} className="meal-card">
            <h3 className="meal-day">
              {meal.day} — <span className="meal-desc">{meal.meal}</span>
            </h3>
            <ul className="meal-recipes">
              {(meal.recipes || []).map((r) => (
                <li key={r.title}>
                  {r.title}
                  <span className="meta">
                    {" · "}
                    <span style={{ color: DIFFICULTY_COLOR[r.difficulty] || "#6b7280" }}>
                      ● {r.difficulty}
                    </span>
                    {" · ⏱ " + r.time}
                  </span>
                </li>
              ))}
            </ul>
            {(meal.recipes || []).length > 0 && (
              <button
                className="toggle-btn"
                onClick={() =>
                  setExpandedIdx(expandedIdx === idx ? null : idx)
                }
              >
                {expandedIdx === idx ? "▲ Hide recipes" : "▼ View recipes"}
              </button>
            )}
            {expandedIdx === idx && (
              <div className="recipe-details">
                {(meal.recipes || []).map((r) => (
                  <div key={r.title} className="recipe-section">
                    <h4>{r.title}</h4>
                    <pre className="detail-text">{r.ingredients}</pre>
                    <pre className="detail-text">{r.instructions}</pre>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="shopping-section">
        <h3>🛒 Shopping list — expiring soon first</h3>
        <div className="shopping-groups">
          {dueNow.length > 0 && (
            <div className="shopping-group">
              <h4>Use within this week</h4>
              <ul>
                {dueNow.map((s) => (
                  <li key={s.item}>{s.item}</li>
                ))}
              </ul>
            </div>
          )}
          {dueLater.length > 0 && (
            <div className="shopping-group">
              <h4>Buy later</h4>
              <ul>
                {dueLater.map((s) => (
                  <li key={s.item}>{s.item}</li>
                ))}
              </ul>
            </div>
          )}
          {dueNow.length === 0 && dueLater.length === 0 && (
            <p className="empty-text">You have everything you need!</p>
          )}
        </div>
      </div>

      <div className="save-plan">
        <input
          type="text"
          className="text-input save-input"
          placeholder="Plan title (e.g. Weeknight volume)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button
          className="btn btn-primary"
          onClick={() => onSave(title.trim() || "My meal plan", ingredients)}
        >
          💾 Save this plan
        </button>
      </div>
    </div>
  );
}
