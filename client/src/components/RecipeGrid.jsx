import React from "react";
import "../styles/RecipeGrid.css";
import { Link } from "react-router-dom";

const RecipeGrid = ({ recipes, isLoading, error, loggedIn, userId }) => {
  if (isLoading) {
    return <div className="loading">Searching for recipes...</div>;
  }

  if (error) {
    return (
      <div className="error-message">
        <h3>Something went wrong</h3>
        <p>{error}</p>
      </div>
    );
  }

  // Check if recipes exists and is actually an array
  if (!recipes || !Array.isArray(recipes) || recipes.length === 0) {
    return (
      <div className="no-results">
        <h3>No matching recipes found</h3>
        <p>Try different ingredients or adjust your filters.</p>
      </div>
    );
  }

  return (
    <div className="recipe-grid">
      {recipes.map((recipe) => (
        <Link
          key={recipe._id || recipe.id} // Use _id if available, otherwise fall back to id
          to={`/recipe/${recipe._id || recipe.id}`}
          className="recipe-card"
        >
          <img
            src={recipe.image}
            alt={recipe.name}
            className="recipe-card-image"
          />
          <div className="recipe-card-content">
            <h3>{recipe.name}</h3>
            <p className="recipe-card-description">
              {recipe.description?.substring(0, 80)} Details...
            </p>
            {loggedIn && (
              <p className="recipe-card-owner">
                Saved by: {userId === recipe.userId ? "You" : "Another user"}
              </p>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
};

export default RecipeGrid;