import React from "react";
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
  onSave = () => {},
  isSaved = false,
}) => {
  return (
    <Card className="recipe-card">
      <div className="image-container">
        <img
          src={image}
          alt={title}
          className="recipe-image"
        />
        <div className="match-badge">
          <Badge className="match-badge-content">
            {matchPercentage}% Match
          </Badge>
        </div>
      </div>

      <CardHeader className="pb-2">
        <h3 className="text-xl font-semibold line-clamp-2">{title}</h3>
        <div className="flex items-center text-sm text-gray-500">
          <Clock className="h-4 w-4 mr-1" />
          <span>{cookingTime} mins</span>
        </div>
      </CardHeader>

      <CardContent className="pb-2">
        <div className="flex flex-wrap gap-1">
          {dietaryTags.map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter className="flex justify-between pt-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewDetails(id)}
          className="flex items-center gap-1"
        >
          <Eye className="h-4 w-4" />
          Details
        </Button>

        <Button
          variant={isSaved ? "default" : "ghost"}
          size="sm"
          onClick={() => onSave(id)}
          className={`flex items-center gap-1 ${isSaved ? "bg-pink-500 hover:bg-pink-600 text-white" : ""}`}
        >
          <Heart className={`h-4 w-4 ${isSaved ? "fill-white" : ""}`} />
          {isSaved ? "Saved" : "Save"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RecipeCard;
