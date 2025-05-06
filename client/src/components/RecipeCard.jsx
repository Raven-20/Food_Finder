import React, { useState } from "react";
import "../styles/RecipeCard.css";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Clock, Eye, Heart } from "lucide-react";
import {
  Dialog,
  DialogContent,
} from "../components/ui/dialog";
import RecipeDetail from "../components/RecipeDetail";

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
  isFavorite = false,
  onRemoveFavorite = null, // ✅ Optional removal handler
}) => {
  // Fallback and merging values
  const recipeId = recipe.id || id;
  const recipeTitle = recipe.title || title || `Recipe ${recipeId}`;
  const recipeImage = recipe.image || image || "/placeholder-recipe.jpg";
  const recipeMatch = recipe.matchPercentage ?? matchPercentage;
  const recipeTime = recipe.cookingTime ?? cookingTime ?? 30;
  const recipeTags = recipe.dietaryTags || dietaryTags;

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openRecipeDetails = () => setIsModalOpen(true);
  const closeRecipeDetails = () => setIsModalOpen(false);

  const handleFavoriteClick = () => {
    if (onRemoveFavorite && typeof onRemoveFavorite === "function") {
      onRemoveFavorite(recipeId); // ✅ Trigger removal
    }
  };

  return (
    <>
      <Card className="recipe-card relative">
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
          
          {isFavorite && onRemoveFavorite && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleFavoriteClick}
              className="absolute top-2 right-2 bg-white/80 hover:bg-white/90 rounded-full"
              title="Remove from Favorites"
            >
              <Heart className="h-5 w-5 text-red-500 fill-red-500" />
            </Button>
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
          <Button
            onClick={openRecipeDetails}
            className="flex items-center gap-1 w-full"
            variant="secondary"
          >
            <Eye className="h-4 w-4" />
            View Recipe
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="recipe-detail-modal max-w-4xl max-h-[90vh] overflow-y-auto">
          <RecipeDetail
            id={recipeId}
            recipe={recipe}
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
