import React, { useState, useEffect } from "react";
import "../styles/RecipeCard.css";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Clock, Heart, Eye, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogClose,
} from "./ui/dialog";
import RecipeDetail from "./RecipeDetail";

const RecipeCard = ({
  id = "1",
  title = "Delicious Pasta Primavera",
  image = "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=500&q=80",
  matchPercentage = 85,
  cookingTime = 30,
  dietaryTags = ["Vegetarian", "Gluten-Free"],
  isLoggedIn = false,
  userId = "",
}) => {
  const [isSaved, setIsSaved] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (isLoggedIn && userId && id) {
      fetchSavedRecipes();
    }
  }, [isLoggedIn, userId, id]);

  const fetchSavedRecipes = async () => {
    try {
      const response = await fetch(`/api/users/${userId}/saved-recipes`);
      const savedRecipes = await response.json();
      if (Array.isArray(savedRecipes) && savedRecipes.includes(id)) {
        setIsSaved(true);
      }
    } catch (error) {
      console.error("Error fetching saved recipes:", error);
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
        setIsSaved(!isSaved);
      } else {
        console.error("Failed to save recipe");
      }
    } catch (error) {
      console.error("Error saving recipe:", error);
    }
  };

  const openRecipeDetails = () => setIsModalOpen(true);
  const closeRecipeDetails = () => setIsModalOpen(false);

  return (
    <>
      <Card className="recipe-card">
        <CardHeader className="image-container p-0">
          <img src={image} alt={title} className="recipe-image" />
          <div className="match-badge">
            <Badge className="match-badge-content">{matchPercentage}% Match</Badge>
          </div>
        </CardHeader>

        <CardContent className="card-content">
          <h2 className="text-lg font-semibold mb-2">{title}</h2>
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">{cookingTime} mins</span>
          </div>
          <div className="tags flex flex-wrap gap-1">
            {(dietaryTags || []).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">{tag}</Badge>
            ))}
          </div>
        </CardContent>

        <CardFooter className="card-footer">
          <Button
            onClick={openRecipeDetails}
            className="flex items-center gap-1"
            variant="secondary"
          >
            <Eye className="h-4 w-4" />
            Details
          </Button>

          {isLoggedIn && (
            <Button
              onClick={handleSave}
              className="flex items-center gap-1"
              variant={isSaved ? "default" : "outline"}
            >
              <Heart className={`h-4 w-4 ${isSaved ? "fill-current text-red-500" : ""}`} />
              {isSaved ? "Saved" : "Save"}
            </Button>
          )}
        </CardFooter>
      </Card>

      {/* Recipe Detail Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="recipe-detail-modal">
          <div className="modal-header flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">{title}</h2>
            <DialogClose asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={closeRecipeDetails}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogClose>
          </div>
          <div className="modal-content">
            <RecipeDetail
              id={id}
              isLoggedIn={isLoggedIn}
              userId={userId}
              onSave={(recipeId, saveStatus) => setIsSaved(saveStatus)}
              onClose={closeRecipeDetails}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RecipeCard;