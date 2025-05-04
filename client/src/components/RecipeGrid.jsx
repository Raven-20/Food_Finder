import React from "react";
import "../styles/RecipeGrid.css";
import RecipeCard from "../components/RecipeCard";

const RecipeGrid = ({ recipes, isLoading, error, loggedIn, userId }) => {
  if (isLoading) {
    return (
      <div className="loading flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4">Searching for recipes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message text-center py-8">
        <h3 className="text-lg font-semibold text-red-500">Something went wrong</h3>
        <p className="mt-2">{error}</p>
      </div>
    );
  }

  // Check if recipes exists and is actually an array
  if (!recipes || !Array.isArray(recipes) || recipes.length === 0) {
    return (
      <div className="no-results text-center py-12">
        <h3 className="text-xl font-semibold">No matching recipes found</h3>
        <p className="mt-2 text-gray-600">Try different ingredients or adjust your filters.</p>
      </div>
    );
  }

  return (
    <div className="recipe-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {recipes.map((recipe) => {
        // Ensure each recipe has a unique ID
        const recipeId = recipe._id || recipe.id || `recipe-${Math.random().toString(36).substr(2, 9)}`;
        
        // Ensure recipe has a title
        const recipeTitle = recipe.name || recipe.title || `Recipe ${recipeId}`;
        
        // Normalize recipe data to ensure consistency
        const normalizedRecipe = {
          id: recipeId,
          title: recipeTitle,
          image: recipe.image || recipe.imageUrl || null,
          matchPercentage: recipe.matchPercentage || recipe.match || null,
          cookingTime: recipe.cookingTime || recipe.prepTime || recipe.time || 30,
          dietaryTags: recipe.dietaryTags || recipe.tags || [],
          ingredients: recipe.ingredients || [],
          instructions: recipe.instructions || []
        };
        
        // Debug log to check what data is being passed
        console.log("Processing recipe:", normalizedRecipe);
        
        return (
          <RecipeCard
            key={normalizedRecipe.id}
            id={normalizedRecipe.id}
            title={normalizedRecipe.title}
            image={normalizedRecipe.image}
            matchPercentage={normalizedRecipe.matchPercentage}
            cookingTime={normalizedRecipe.cookingTime}
            dietaryTags={normalizedRecipe.dietaryTags}
            ingredients={normalizedRecipe.ingredients}
            instructions={normalizedRecipe.instructions}
            isLoggedIn={loggedIn}
            userId={userId}
          />
        );
      })}
    </div>
  );
};

export default RecipeGrid;