import { useState } from "react";
import { deletePlan } from "../api";

function parsePlan(planJson) {
  try {
    const parsed = JSON.parse(planJson);
    return {
      meals: parsed.meals || [],
      shopping_list: parsed.shopping_list || [],
    };
  } catch {
    return { meals: [], shopping_list: [] };
  }
}

export default function SavedPlans({ plans, onDelete }) {
  const [expandedId, setExpandedId] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this saved meal plan?")) return;
    setDeleting(id);
    try {
      await deletePlan(id);
      onDelete(id);
    } catch (err) {
      alert("Failed to delete: " + err.message);
    } finally {
      setDeleting(null);
    }
  };

  if (plans.length === 0) {
    return (
      <div className="card empty-state">
        <p className="empty-text">No saved meal plans yet.</p>
        <p className="empty-sub">
          Generate a plan and save it to view it later!
        </p>
      </div>
    );
  }

  return (
    <div className="saved-list">
      {plans.map((plan) => {
        const parsed = parsePlan(plan.plan);
        const isOpen = expandedId === plan.id;
        return (
          <div key={plan.id} className="saved-card">
            <div className="saved-header">
              <div>
                <h3 className="recipe-title">{plan.title}</h3>
                <p className="saved-ingredients">{plan.ingredients}</p>
              </div>
              <span className="date-badge">
                📅{" "}
                {new Date(plan.created_at).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>

            <button
              className="toggle-btn"
              onClick={() => setExpandedId(isOpen ? null : plan.id)}
            >
              {isOpen ? "▲ Hide plan" : "▼ View plan"}
            </button>

            {isOpen && (
              <div className="recipe-details">
                {(parsed.meals || []).map((meal, i) => (
                  <div key={meal.day + i} className="saved-meal">
                    <strong>{meal.day}</strong> — {meal.meal}
                  </div>
                ))}
                <div className="saved-shopping">
                  <strong>Shopping list</strong>
                  <ul>
                    {(parsed.shopping_list || []).map((s) => (
                      <li key={s.item}>{s.item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            <button
              className="btn btn-delete"
              onClick={() => handleDelete(plan.id)}
              disabled={deleting === plan.id}
            >
              {deleting === plan.id ? "..." : "🗑 Delete"}
            </button>
          </div>
        );
      })}
    </div>
  );
}
