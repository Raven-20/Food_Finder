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
import { Clock, Heart, Eye } from "lucide-react";

const RecipeCard = ({
  id = "1",
  title = "Delicious Pasta Primavera",
  image = "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=500&q=80",
  matchPercentage = 85,
  cookingTime = 30,
  dietaryTags = ["Vegetarian", "Gluten-Free"],
  onViewDetails = () => {},
  loggedIn = false,
  userId = "",
}) => {
  const [isSaved, setIsSaved] = useState(false);

  // Use an effect hook to check if the recipe is saved for the logged-in user
  useEffect(() => {
    if (loggedIn) {
      fetchSavedRecipes();
    }
  }, [loggedIn]);

  const fetchSavedRecipes = async () => {
    try {
      const response = await fetch(`/api/users/${userId}/saved-recipes`);
      const savedRecipes = await response.json();
      if (savedRecipes.includes(id)) {
        setIsSaved(true);
      }
    } catch (error) {
      console.error("Error fetching saved recipes:", error);
    }
  };

  // Function to handle saving the recipe
  const handleSave = async () => {
    if (!loggedIn) {
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

  return (
    <Card>
      <CardHeader>
        <img src={image} alt={title} className="recipe-image" />
        <Badge>{matchPercentage}% Match</Badge>
      </CardHeader>
      <CardContent>
        <h2>{title}</h2>
        <div className="flex items-center">
          <Clock className="icon" />
          <span>{cookingTime} mins</span>
        </div>
        <div className="tags">
          {dietaryTags.map((tag, index) => (
            <Badge key={index}>{tag}</Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={() => onViewDetails(id)} className="flex items-center gap-1">
          <Eye className="icon" />
          Details
        </Button>
        {loggedIn && (
          <Button onClick={handleSave} className="flex items-center gap-1">
            <Heart className="icon" />
            {isSaved ? "Saved" : "Save"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default RecipeCard;
