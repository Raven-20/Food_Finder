import React, { useState, useEffect } from "react";
import { Heart, Clock, Users, X, ChefHat, AlertTriangle } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import "../styles/RecipeDetail.css";

const RecipeDetail = ({ 
  id, 
  isLoggedIn, 
  userId, 
  onSave, 
  onClose,
  mockData // Initial data to prevent loading state
}) => {
  const [recipe, setRecipe] = useState(mockData || null);
  const [isLoading, setIsLoading] = useState(!mockData);
  const [error, setError] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [activeTab, setActiveTab] = useState("ingredients");

  useEffect(() => {
    if (id) {
      fetchRecipeDetails();
      if (isLoggedIn && userId) {
        checkIfSaved();
      }
    }
  }, [id, isLoggedIn, userId]);

  const fetchRecipeDetails = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/recipes/${id}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch recipe details: ${response.statusText}`);
      }
      
      const data = await response.json();
      setRecipe(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching recipe details:", err);
      setError(err.message || "Failed to load recipe details");
      // Keep the mock data if there's an error
      if (!recipe && mockData) {
        setRecipe(mockData);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const checkIfSaved = async () => {
    try {
      const response = await fetch(`/api/users/${userId}/saved-recipes`);
      const savedRecipes = await response.json();
      
      if (Array.isArray(savedRecipes) && savedRecipes.includes(id)) {
        setIsSaved(true);
      }
    } catch (error) {
      console.error("Error checking saved status:", error);
    }
  };

  const handleSave = async () => {
    if (!isLoggedIn) {
      alert("Please log in to save recipes");
      return;
    }

    try {
      const method = isSaved ? "DELETE" : "POST";
      const response = await fetch(`/api/users/${userId}/saved-recipes`, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ recipeId: id }),
      });

      if (response.ok) {
        const newSavedStatus = !isSaved;
        setIsSaved(newSavedStatus);
        // Notify parent component about saved status change
        if (onSave) {
          onSave(id, newSavedStatus);
        }
      } else {
        console.error("Failed to update saved status");
      }
    } catch (error) {
      console.error("Error saving recipe:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="recipe-detail-loading">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-center">Loading recipe details...</p>
      </div>
    );
  }

  if (error && !recipe) {
    return (
      <div className="recipe-detail-error">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto" />
        <h3 className="text-lg font-semibold text-red-500 mt-4 text-center">Failed to load recipe</h3>
        <p className="mt-2 text-center">{error}</p>
        <Button onClick={onClose} className="mt-4 mx-auto block">Close</Button>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="recipe-detail-not-found">
        <h3 className="text-lg font-semibold text-center">Recipe not found</h3>
        <Button onClick={onClose} className="mt-4 mx-auto block">Close</Button>
      </div>
    );
  }

  const {
    title,
    image,
    cookingTime = 30,
    servings = 4,
    dietaryTags = [],
    ingredients = [],
    instructions = [],
    description = "A delicious recipe that's sure to please.",
    nutritionInfo = null
  } = recipe;

  // Format the ingredients for display
  const displayIngredients = Array.isArray(ingredients) 
    ? ingredients.map((ing, index) => {
        if (typeof ing === 'string') {
          return { id: index, name: ing, amount: '', unit: '' };
        }
        return { 
          id: index, 
          name: ing.name || ing.ingredient || 'Ingredient', 
          amount: ing.amount || ing.quantity || '', 
          unit: ing.unit || ing.measure || '' 
        };
      })
    : [];

  // Format the instructions for display
  const displayInstructions = Array.isArray(instructions)
    ? instructions.map((inst, index) => {
        if (typeof inst === 'string') {
          return { step: index + 1, description: inst };
        }
        return {
          step: inst.step || index + 1,
          description: inst.description || inst.text || 'Step description'
        };
      })
    : [];

  return (
    <div className="recipe-detail">
      <div className="recipe-detail-header">
        <button className="close-button" onClick={onClose}>
          <X className="h-6 w-6" />
        </button>
        <h2 className="recipe-detail-title text-2xl font-bold">{title}</h2>
      </div>

      <div className="recipe-detail-content">
        <div className="recipe-detail-image-container">
          <img 
            src={image || "/placeholder-recipe.jpg"} 
            alt={title} 
            className="recipe-detail-image" 
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/placeholder-recipe.jpg";
            }}
          />
        </div>

        <div className="recipe-detail-meta">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1">
              <Clock className="h-5 w-5 text-gray-500" />
              <span>{cookingTime} mins</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-5 w-5 text-gray-500" />
              <span>{servings} servings</span>
            </div>
            
            {isLoggedIn && (
              <Button
                onClick={handleSave}
                className="ml-auto flex items-center gap-1"
                variant={isSaved ? "default" : "outline"}
              >
                <Heart className={`h-5 w-5 ${isSaved ? "fill-current text-red-500" : ""}`} />
                {isSaved ? "Saved" : "Save"}
              </Button>
            )}
          </div>

          <div className="tags flex flex-wrap gap-2 mb-4">
            {dietaryTags.map((tag, index) => (
              <Badge key={index} variant="outline">{tag}</Badge>
            ))}
          </div>

          <p className="recipe-description mb-6">{description}</p>

          <div className="recipe-detail-tabs">
            <div className="tab-buttons flex border-b mb-4">
              <button 
                className={`tab-button py-2 px-4 ${activeTab === 'ingredients' ? 'active border-b-2 border-primary font-medium' : ''}`}
                onClick={() => setActiveTab('ingredients')}
              >
                Ingredients
              </button>
              <button 
                className={`tab-button py-2 px-4 ${activeTab === 'instructions' ? 'active border-b-2 border-primary font-medium' : ''}`}
                onClick={() => setActiveTab('instructions')}
              >
                Instructions
              </button>
              {nutritionInfo && (
                <button 
                  className={`tab-button py-2 px-4 ${activeTab === 'nutrition' ? 'active border-b-2 border-primary font-medium' : ''}`}
                  onClick={() => setActiveTab('nutrition')}
                >
                  Nutrition
                </button>
              )}
            </div>

            <div className="tab-content">
              {activeTab === 'ingredients' && (
                <div className="ingredients-content">
                  <h3 className="text-lg font-medium mb-3">Ingredients</h3>
                  <ul className="ingredients-list">
                    {displayIngredients.map((ing) => (
                      <li key={ing.id} className="ingredient-item py-2 border-b border-gray-100 flex items-center">
                        <span className="ingredient-amount">{ing.amount} {ing.unit}</span>
                        <span className="ingredient-name ml-2">{ing.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeTab === 'instructions' && (
                <div className="instructions-content">
                  <h3 className="text-lg font-medium mb-3">Instructions</h3>
                  <ol className="instructions-list">
                    {displayInstructions.map((inst) => (
                      <li key={inst.step} className="instruction-item py-3 flex">
                        <div className="instruction-step-number flex-shrink-0 flex items-center justify-center rounded-full bg-primary/10 text-primary h-8 w-8 mr-3">
                          {inst.step}
                        </div>
                        <div className="instruction-text">{inst.description}</div>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {activeTab === 'nutrition' && nutritionInfo && (
                <div className="nutrition-content">
                  <h3 className="text-lg font-medium mb-3">Nutrition Information</h3>
                  <div className="nutrition-grid grid grid-cols-2 gap-4">
                    {Object.entries(nutritionInfo).map(([key, value]) => (
                      <div key={key} className="nutrition-item p-3 border rounded-md">
                        <div className="nutrition-label text-sm text-gray-500">{key}</div>
                        <div className="nutrition-value font-medium">{value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;