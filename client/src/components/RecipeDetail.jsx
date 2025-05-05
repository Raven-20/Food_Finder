import React, { useState, useEffect } from "react";
import "../styles/RecipeDetail.css";
import { Button } from "../components/ui/button";
import {
  Clock,
  Users,
  ChevronLeft,
  Heart,
  Share2,
  PlusCircle,
  MinusCircle,
  Printer,
  AlarmClock,
  Utensils,
  Check,
  Thermometer
} from "lucide-react";
import { Badge } from "../components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  getRecipe,
  checkFavoriteStatus,
  toggleFavoriteStatus,
} from "../lib/utils";
import { getRecipeDetails } from "../lib/recipeApi";

const RecipeDetail = ({ id, isLoggedIn, userId, onClose }) => {
  const [recipe, setRecipe] = useState(null);
  const [recipeDetails, setRecipeDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [servings, setServings] = useState(4);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchRecipeData = async () => {
      try {
        setIsLoading(true);
        const data = await getRecipe(id);
        setRecipe(data);
        setServings(data.defaultServings || 4);

        try {
          const details = await getRecipeDetails(id);
          if (details) {
            setRecipeDetails(details);
          }
        } catch (detailsErr) {
          console.log("Note: Detailed recipe info not available, using basic data only");
        }

        if (isLoggedIn && userId) {
          try {
            const favoriteData = await checkFavoriteStatus(userId, id);
            setIsFavorite(favoriteData.isFavorite);
          } catch (favErr) {
            console.log("Could not check favorite status");
          }
        }
      } catch (err) {
        console.error("Error fetching recipe:", err);
        setError(err.message || "Failed to load recipe");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipeData();
  }, [id, isLoggedIn, userId]);

  const toggleFavorite = async () => {
    if (!isLoggedIn) {
      alert("Please log in to favorite recipes.");
      return;
    }

    try {
      await toggleFavoriteStatus(userId, id, isFavorite);
      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error("Error toggling favorite:", err);
      alert("Failed to update favorite status");
    }
  };

  const adjustServings = (increase) => {
    setServings(prev => Math.max(1, prev + (increase ? 1 : -1)));
  };

  const printRecipe = () => window.print();

  const shareRecipe = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: recipe?.title,
          text: `Check out this recipe: ${recipe?.title}`,
          url: window.location.href,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-96">
        <h3 className="text-lg font-semibold text-red-500 mb-2">Error Loading Recipe</h3>
        <p className="text-gray-600">{error}</p>
        <Button onClick={onClose} className="mt-4">Go Back</Button>
      </div>
    );
  }

  if (!recipe) return null;

  const combinedRecipe = {
    ...recipe,
    ...(recipeDetails || {}),
    prepTime: recipeDetails?.prepTime || recipe.prepTime || 0,
    cookTime: recipeDetails?.cookTime || recipe.cookingTime || 0,
    difficulty: recipeDetails?.difficulty || "Medium",
    notes: recipeDetails?.notes || "",
    nutritionInfo: recipeDetails?.nutritionInfo || {},
  };

  const scaledIngredients = combinedRecipe.ingredients?.map((ingredient) => {
    if (typeof ingredient.amount === "number") {
      return {
        ...ingredient,
        scaledAmount:
          (ingredient.amount / combinedRecipe.defaultServings) * servings,
      };
    }
    return ingredient;
  });

  return (
    <div className="recipe-detail">
      <div className="recipe-detail-header mb-4 flex justify-between items-center">
        <Button variant="ghost" onClick={onClose}>
          <ChevronLeft className="h-5 w-5 mr-1" /> Back
        </Button>
        <div className="recipe-actions flex gap-2">
          <Button variant="outline" size="icon" onClick={toggleFavorite} className={isFavorite ? "text-red-500" : ""}>
            <Heart className="h-5 w-5" fill={isFavorite ? "currentColor" : "none"} />
          </Button>
          <Button variant="outline" size="icon" onClick={shareRecipe}>
            <Share2 className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon" onClick={printRecipe}>
            <Printer className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="recipe-grid">
        <div className="recipe-image-container">
          <img
            src={combinedRecipe.image || "/placeholder-recipe.jpg"}
            alt={combinedRecipe.title}
            className="recipe-detail-image rounded-lg shadow-md"
            onError={(e) => {
              const target = e.target;
              if (!target.dataset.fallback) {
                target.src = "/placeholder-recipe.jpg";
                target.dataset.fallback = true;
              }
            }}
          />

          <div className="recipe-meta mt-4">
            <h1 className="recipe-title text-2xl font-bold mb-2">{combinedRecipe.title}</h1>
            <div className="flex flex-wrap items-center gap-4 mb-3">
              {combinedRecipe.prepTime > 0 && (
                <div className="flex items-center">
                  <AlarmClock className="h-4 w-4 text-gray-500 mr-1" />
                  <span className="text-sm">{combinedRecipe.prepTime} mins prep</span>
                </div>
              )}
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-gray-500 mr-1" />
                <span className="text-sm">{combinedRecipe.cookTime} mins cook</span>
              </div>
              {combinedRecipe.difficulty && (
                <div className="flex items-center">
                  <Utensils className="h-4 w-4 text-gray-500 mr-1" />
                  <span className="text-sm">{combinedRecipe.difficulty}</span>
                </div>
              )}
            </div>
            <div className="flex items-center mb-3">
              <Users className="h-4 w-4 text-gray-500 mr-1" />
              <div className="servings-control flex items-center">
                <Button variant="ghost" size="icon" className="h-6 w-6 p-0" onClick={() => adjustServings(false)} disabled={servings <= 1}>
                  <MinusCircle className="h-4 w-4" />
                </Button>
                <span className="text-sm mx-2">{servings} servings</span>
                <Button variant="ghost" size="icon" className="h-6 w-6 p-0" onClick={() => adjustServings(true)}>
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {combinedRecipe.dietaryTags?.length > 0 && (
              <div className="tags flex flex-wrap gap-1 mb-4">
                {combinedRecipe.dietaryTags.map((tag, index) => (
                  <Badge key={index} variant="outline">{tag}</Badge>
                ))}
              </div>
            )}
            {combinedRecipe.description && (
              <p className="recipe-description text-gray-700 mb-4">{combinedRecipe.description}</p>
            )}
          </div>
        </div>

        <div className="recipe-content">
          <Tabs defaultValue="ingredients" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
              <TabsTrigger value="instructions">Instructions</TabsTrigger>
            </TabsList>

            <TabsContent value="ingredients" className="mt-4">
              <div className="h-[400px] overflow-y-auto pr-4">
                <ul className="ingredients-list space-y-2">
                  {scaledIngredients?.map((ingredient, idx) => (
                    <li key={idx} className="ingredient-item flex items-start py-1">
                      <div className="ingredient-amount min-w-[80px] text-sm">
                        {typeof ingredient.scaledAmount === "number"
                          ? ingredient.scaledAmount.toFixed(1).replace(/\.0$/, "")
                          : ingredient.amount} {ingredient.unit}
                      </div>
                      <div className="ingredient-name">{ingredient.name}</div>
                    </li>
                  ))}
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="instructions" className="mt-4">
              <div className="h-[400px] overflow-y-auto pr-4">
                <ol className="instructions-list space-y-4">
                  {combinedRecipe.instructions?.map((stepObj, idx) => (
                    <li key={idx} className="instruction-step">
                      <div className="step-number bg-gray-100 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium float-left mr-3 mt-1">
                        {idx + 1}
                      </div>
                      <div className="step-text">
                        {typeof stepObj === "string" ? stepObj : stepObj.description}
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </TabsContent>

          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;
