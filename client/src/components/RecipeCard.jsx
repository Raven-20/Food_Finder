import React, { useState, useEffect } from "react";
import "../styles/RecipeCard.css";
import { Card, CardContent, CardFooter, CardHeader } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Clock, Eye, Heart } from "lucide-react";
import { Dialog, DialogContent } from "../components/ui/dialog";
import RecipeDetail from "../components/RecipeDetail";
import { toggleFavorite } from "../lib/recipeApi"; // Assuming this function toggles the favorite status in the backend

const RecipeCard = ({
  id,
  title,
  image,
  matchPercentage,
  cookingTime,
  dietaryTags = [],
  isLoggedIn = false,
  userId = "",
  recipe = {},
  favoriteRecipes = [],
}) => {
  // Fallback and merging values
  const recipeId = recipe.id || id;
  const recipeTitle = recipe.title || title || `Recipe ${recipeId}`;
  const recipeImage = recipe.image || image || "/placeholder-recipe.jpg";
  const recipeMatch = recipe.matchPercentage ?? matchPercentage;
  const recipeTime = recipe.cookingTime ?? cookingTime ?? 30;
  const recipeTags = recipe.dietaryTags || dietaryTags;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(favoriteRecipes.includes(recipeId)); // Check if the recipe is in favorites

  const openRecipeDetails = () => setIsModalOpen(true);
  const closeRecipeDetails = () => setIsModalOpen(false);

  // Toggle the favorite status
  const handleFavoriteClick = async () => {
    try {
      const updatedFavoriteStatus = !isFavorite;
      await toggleFavorite(userId, recipeId, updatedFavoriteStatus); // Toggle favorite status on the backend
      setIsFavorite(updatedFavoriteStatus); // Update the local state
    } catch (error) {
      console.error("Error updating favorite:", error);
    }
  };

  useEffect(() => {
    setIsFavorite(favoriteRecipes.includes(recipeId)); // Update the favorite status when the favorites list changes
  }, [favoriteRecipes, recipeId]);

  return (
    <>
      <Card className="recipe-card">
        <CardHeader className="image-container p-0">
          <div className="recipe-name-banner">
            <h2 className="recipe-title text-lg font-semibold">{recipeTitle}</h2>
          </div>
          <img
            src={recipeImage}
            alt={recipeTitle}
            className="recipe-image"
            onError={(e) => {
              const target = e.target;
              if (!target.dataset.fallback) {
                target.src = "/placeholder-recipe.jpg";
                target.dataset.fallback = true;
              }
            }}
          />
          {typeof recipeMatch === "number" && recipeMatch > 0 && (
            <div className="match-badge">
              <Badge className="match-badge-content">
                {recipeMatch}% Match
              </Badge>
            </div>
          )}
        </CardHeader>

        <CardContent className="card-content">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">{recipeTime} mins</span>
          </div>
          <div className="tags flex flex-wrap gap-1">
            {recipeTags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {recipeTags.length > 3 && (
              <span className="text-xs text-gray-500">
                +{recipeTags.length - 3} more
              </span>
            )}
          </div>
        </CardContent>

        <CardFooter className="card-footer">
          <div className="flex justify-between items-center w-full">
            <Button
              onClick={openRecipeDetails}
              className="flex items-center gap-1"
              variant="secondary"
            >
              <Eye className="h-4 w-4" />
              View Recipe
            </Button>
            <button
              onClick={handleFavoriteClick}
              className={`heart-icon ${isFavorite ? "filled" : ""}`}
            >
              <Heart className="h-5 w-5" />
            </button>
          </div>
        </CardFooter>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="recipe-detail-modal max-w-4xl max-h-[90vh] overflow-y-auto">
          <RecipeDetail
            id={recipeId}
            isLoggedIn={isLoggedIn}
            userId={userId}
            onClose={closeRecipeDetails}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RecipeCard;
