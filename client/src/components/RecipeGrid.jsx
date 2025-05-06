import React from "react";
import "../styles/RecipeGrid.css";
import RecipeCard from "../components/RecipeCard";

const RecipeGrid = ({ recipes, isLoading, error, loggedIn, userId, favoriteRecipes }) => {
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
      {recipes.map((recipe, index) => {
        const recipeId = recipe._id || recipe.id || `recipe-${index}`;
        const recipeTitle = recipe.name || recipe.title || `Recipe ${index + 1}`;
        const recipeImage = recipe.image || recipe.imageUrl || "/default-recipe.jpg";

        const normalizedRecipe = {
          id: recipeId,
          title: recipeTitle,
          image: recipeImage,
          matchPercentage: recipe.matchPercentage ?? recipe.match ?? null,
          cookingTime: recipe.cookingTime ?? recipe.prepTime ?? recipe.time ?? 30,
          dietaryTags: recipe.dietaryTags ?? recipe.tags ?? [],
          ingredients: recipe.ingredients ?? [],
          instructions: recipe.instructions ?? []
        };

        console.log("Processing recipe:", normalizedRecipe);

        return (
          <RecipeCard
            key={recipeId}
            recipe={normalizedRecipe}
            isLoggedIn={loggedIn}
            userId={userId}
            favoriteRecipes={favoriteRecipes} // Pass favoriteRecipes to each RecipeCard
          />
        );
      })}
    </div>
  );
};

export default RecipeGrid;
