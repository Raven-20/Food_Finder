import React, { useState, useEffect } from "react";
import "../styles/RecipeDetail.css";
import "../styles/card.css";
import { getRecipeById } from "../lib/recipeApi";
import {
  Share2,
  Clock,
  Users,
  Bookmark,
  BookmarkCheck,
  Printer,
  Heart,
} from "lucide-react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";

const RecipeDetail = ({ id, isLoggedIn, userId, onSave, onShare, onPrint, onClose }) => {
  const [recipe, setRecipe] = useState(null);
  const [saved, setSaved] = useState(false);
  const [liked, setLiked] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("ingredients");

  useEffect(() => {
    const fetchRecipeData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch recipe details
        const recipeData = await getRecipeById(id);
        
        // If user is logged in, check if this recipe is saved
        if (isLoggedIn && userId) {
          const savedRecipes = await getUserSavedRecipes(userId);
          setSaved(savedRecipes.includes(id));
        }
        
        setRecipe(recipeData);
      } catch (error) {
        console.error("Error fetching recipe data:", error);
        setError("Failed to load recipe details. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchRecipeData();
    }
  }, [id, isLoggedIn, userId]);

  const handleSave = async () => {
    if (!isLoggedIn) {
      alert("Please log in to save recipes");
      return;
    }
    
    try {
      if (saved) {
        await unsaveRecipe(userId, id);
      } else {
        await saveRecipe(userId, id);
      }
      
      setSaved(!saved);
      if (onSave) onSave(id, !saved);
    } catch (error) {
      console.error("Error updating saved status:", error);
      alert("Failed to update saved status. Please try again.");
    }
  };

  const handleLike = () => {
    setLiked(!liked);
    // You can implement API calls for liking recipes here
  };

  const handleShare = () => {
    setIsShareDialogOpen(true);
    if (onShare) onShare(id);
  };

  const handlePrint = () => {
    if (onPrint) onPrint(id);
    // You could implement actual print functionality here
    window.print();
  };

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4">Loading recipe details...</p>
        </div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-500">{error || "Recipe not found"}</p>
          <Button className="mt-4" onClick={onClose}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="recipe-detail-container">
      <div className="image-wrapper">
        <img src={recipe.image} alt={recipe.title} className="recipe-image" />
        <div className="match-percentage">
          <Badge variant="secondary" className="bg-white/80 text-black">
            {recipe.matchPercentage}% Match
          </Badge>
        </div>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold">{recipe.title}</h1>
            <div className="flex flex-wrap gap-2 mt-2">
              {recipe.dietaryTags.map((tag, index) => (
                <Badge key={index} variant="outline">{tag}</Badge>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={handleLike}>
              <Heart className={`h-4 w-4 ${liked ? "fill-red-500 text-red-500" : ""}`} />
            </Button>
            {isLoggedIn && (
              <Button variant="outline" size="icon" onClick={handleSave}>
                {saved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
              </Button>
            )}
            <Button variant="outline" size="icon" onClick={handleShare}>
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handlePrint}>
              <Printer className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-6 mb-6">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <span>{recipe.cookingTime} mins</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-muted-foreground" />
            <span>{recipe.servings} servings</span>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Tabs Navigation */}
        <div className="recipe-tabs">
          <div className="tab-list flex border-b">
            <button 
              className={`tab-button px-4 py-2 font-medium ${activeTab === 'ingredients' ? 'border-b-2 border-primary text-primary' : 'text-gray-500'}`}
              onClick={() => handleTabChange('ingredients')}
            >       
            </button>
            <button 
              className={`tab-button px-4 py-2 font-medium ${activeTab === 'instructions' ? 'border-b-2 border-primary text-primary' : 'text-gray-500'}`}
              onClick={() => handleTabChange('instructions')}
            >
            </button>
          </div>

          {/* Ingredients Tab Content */}
          <div className={`tab-content mt-6 ${activeTab === 'ingredients' ? 'block' : 'hidden'}`}>
            <Card>
              <CardHeader>
                <CardTitle>Ingredients</CardTitle>
                
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index} className="ingredient-item flex justify-between py-2 border-b border-gray-100 last:border-0">
                      <span>{ingredient.name}</span>
                      <span className="text-muted-foreground">
                        {ingredient.amount} {ingredient.unit}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Instructions Tab Content */}
          <div className={`tab-content mt-6 ${activeTab === 'instructions' ? 'block' : 'hidden'}`}>
            <Card>
              <CardHeader>
                <CardTitle>Instructions</CardTitle>
                <CardDescription>Step by step cooking guide</CardDescription>
              </CardHeader>
              <CardContent>
                <ol className="space-y-4">
                  {recipe.instructions.map((instruction) => (
                    <li key={instruction.step} className="flex gap-4">
                      <div className="step-number flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-medium">
                        {instruction.step}
                      </div>
                      <div className="flex-1 pt-1">{instruction.description}</div>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <Button variant="outline" onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;