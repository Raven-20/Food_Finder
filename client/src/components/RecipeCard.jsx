import React, { useState, useEffect, useRef } from "react";
import "../styles/RecipeCard.css";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { 
  Clock, 
  Heart, 
  Eye, 
  Printer, 
  Share2, 
  Star 
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogClose,
} from "../components/ui/dialog";
import RecipeDetail from "../components/RecipeDetail";

const RecipeCard = ({
  id,
  title,
  image,
  matchPercentage = 0,
  cookingTime = 30,
  dietaryTags = [],
  isLoggedIn = false,
  userId = "",
}) => {
  // Remove default title value to avoid the same name showing up
  // If no title is provided, create a fallback based on ID
  const displayTitle = title || `Recipe ${id}`;
  
  const [isSaved, setIsSaved] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (isLoggedIn && userId && id) {
      fetchSavedRecipes();
      fetchFavorites();
    }
  }, [isLoggedIn, userId, id]);

  useEffect(() => {
    // Close dropdown when clicking outside
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsShareMenuOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

  const fetchFavorites = async () => {
    try {
      const response = await fetch(`/api/users/${userId}/favorites`);
      const favorites = await response.json();
      if (Array.isArray(favorites) && favorites.includes(id)) {
        setIsFavorite(true);
      }
    } catch (error) {
      console.error("Error fetching favorites:", error);
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

  const handleFavorite = async () => {
    if (!isLoggedIn) {
      alert("Please log in to add recipes to favorites");
      return;
    }

    try {
      const method = isFavorite ? "DELETE" : "POST";
      const response = await fetch(`/api/users/${userId}/favorites`, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ recipeId: id }),
      });

      if (response.ok) {
        setIsFavorite(!isFavorite);
      } else {
        console.error("Failed to update favorites");
      }
    } catch (error) {
      console.error("Error updating favorites:", error);
    }
  };

  const printRecipe = () => {
    if (!isLoggedIn) {
      alert("Please log in to print recipes");
      return;
    }

    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    
    // Fetch complete recipe data
    fetch(`/api/recipes/${id}`)
      .then(response => response.json())
      .then(recipe => {
        const printContent = `
          <!DOCTYPE html>
          <html>
            <head>
              <title>${recipe.title || displayTitle}</title>
              <style>
                body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
                h1 { text-align: center; margin-bottom: 20px; }
                .recipe-image { max-width: 100%; height: auto; display: block; margin: 0 auto 20px; }
                .meta { display: flex; justify-content: space-between; margin-bottom: 20px; color: #666; }
                h2 { margin-top: 30px; margin-bottom: 10px; }
                .ingredients { margin-bottom: 30px; }
                .ingredients li { margin-bottom: 8px; }
                .instructions li { margin-bottom: 15px; }
                .tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 30px; }
                .tag { background: #eee; padding: 4px 8px; border-radius: 4px; font-size: 12px; }
                @media print {
                  .no-print { display: none; }
                }
              </style>
            </head>
            <body>
              <h1>${recipe.title || displayTitle}</h1>
              <img src="${recipe.image || '/placeholder-recipe.jpg'}" alt="${recipe.title || displayTitle}" class="recipe-image" />
              
              <div class="meta">
                <div>Cook Time: ${recipe.cookingTime || cookingTime} mins</div>
                <div>Servings: ${recipe.servings || 4}</div>
              </div>
              
              <h2>Ingredients</h2>
              <ul class="ingredients">
                ${(recipe.ingredients || []).map(ingredient => 
                  `<li>${ingredient.amount || ''} ${ingredient.unit || ''} ${ingredient.name || ''}</li>`
                ).join('')}
              </ul>
              
              <h2>Instructions</h2>
              <ol class="instructions">
                ${(recipe.instructions || []).map(instruction => 
                  `<li>${instruction.description || ''}</li>`
                ).join('')}
              </ol>
              
              <div class="tags">
                ${(recipe.dietaryTags || dietaryTags || []).map(tag => 
                  `<span class="tag">${tag}</span>`
                ).join('')}
              </div>
              
              <button class="no-print" onclick="window.print(); setTimeout(() => window.close(), 500);">Print</button>
            </body>
          </html>
        `;
        
        printWindow.document.open();
        printWindow.document.write(printContent);
        printWindow.document.close();
      })
      .catch(error => {
        console.error("Error fetching recipe for printing:", error);
        printWindow.close();
        alert("Error preparing recipe for printing");
      });
  };

  const shareRecipe = (platform) => {
    if (!isLoggedIn) {
      alert("Please log in to share recipes");
      return;
    }

    const recipeUrl = `${window.location.origin}/recipes/${id}`;
    
    switch (platform) {
      case 'messenger':
        // Facebook Messenger sharing
        window.open(`https://www.facebook.com/dialog/send?app_id=YOUR_FACEBOOK_APP_ID&link=${encodeURIComponent(recipeUrl)}&redirect_uri=${encodeURIComponent(window.location.origin)}`, '_blank');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(`Check out this recipe: ${displayTitle} ${recipeUrl}`)}`, '_blank');
        break;
      case 'email':
        window.open(`mailto:?subject=${encodeURIComponent(`Recipe: ${displayTitle}`)}&body=${encodeURIComponent(`Check out this recipe I found: ${displayTitle} ${recipeUrl}`)}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(recipeUrl)
          .then(() => alert("Recipe link copied to clipboard!"))
          .catch(() => alert("Failed to copy link"));
        break;
      default:
        console.error("Unknown sharing platform");
    }
    
    // Close the dropdown after selection
    setIsShareMenuOpen(false);
  };

  const toggleShareMenu = () => {
    setIsShareMenuOpen(!isShareMenuOpen);
  };

  const openRecipeDetails = () => setIsModalOpen(true);
  const closeRecipeDetails = () => setIsModalOpen(false);

  // Create a mockData object for the detail component if needed
  const recipeData = {
    id,
    title: displayTitle,
    image,
    matchPercentage,
    cookingTime,
    dietaryTags,
    // We'll add minimal mock data for the detail view
    servings: 4,
    ingredients: [
      { name: "Loading ingredients...", amount: "", unit: "" }
    ],
    instructions: [
      { step: 1, description: "Loading instructions..." }
    ]
  };

  return (
    <>
      <Card className="recipe-card">
        <CardHeader className="image-container p-0">
          <div className="recipe-name-banner">
            <h2 className="recipe-title text-lg font-semibold">{displayTitle}</h2>
          </div>
          <img 
            src={image || "/placeholder-recipe.jpg"} 
            alt={displayTitle} 
            className="recipe-image" 
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/placeholder-recipe.jpg";
            }}
          />
          {matchPercentage > 0 && (
            <div className="match-badge">
              <Badge className="match-badge-content">{matchPercentage}% Match</Badge>
            </div>
          )}
        </CardHeader>

        <CardContent className="card-content">
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
            View Recipe
          </Button>

          {isLoggedIn && (
            <div className="flex gap-2">
              {/* Save button */}
              <Button
                onClick={handleSave}
                className="flex items-center gap-1"
                variant={isSaved ? "default" : "outline"}
                size="icon"
                title={isSaved ? "Saved" : "Save"}
                aria-label={isSaved ? "Saved" : "Save recipe"}
              >
                <Heart className={`h-4 w-4 ${isSaved ? "fill-current text-red-500" : ""}`} />
              </Button>
              
              {/* Favorite button */}
              <Button
                onClick={handleFavorite}
                className="flex items-center gap-1"
                variant={isFavorite ? "default" : "outline"}
                size="icon"
                title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                aria-label={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
              >
                <Star className={`h-4 w-4 ${isFavorite ? "fill-current text-yellow-500" : ""}`} />
              </Button>
              
              {/* Print button */}
              <Button
                onClick={printRecipe}
                className="flex items-center gap-1"
                variant="outline"
                size="icon"
                title="Print Recipe"
                aria-label="Print recipe"
              >
                <Printer className="h-4 w-4" />
              </Button>
              
              {/* Share button with custom dropdown */}
              <div className="relative" ref={dropdownRef}>
                <Button
                  onClick={toggleShareMenu}
                  className="flex items-center gap-1"
                  variant="outline"
                  size="icon"
                  title="Share Recipe"
                  aria-label="Share recipe"
                  aria-expanded={isShareMenuOpen}
                  aria-haspopup="true"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
                
                {isShareMenuOpen && (
                  <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <button
                      onClick={() => shareRecipe('messenger')}
                      className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Facebook Messenger
                    </button>
      
                    <button
                      onClick={() => shareRecipe('copy')}
                      className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Copy Link
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardFooter>
      </Card>

      {/* Recipe Detail Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="recipe-detail-modal max-w-4xl max-h-[90vh] overflow-y-auto">
          <RecipeDetail
            id={id}
            isLoggedIn={isLoggedIn}
            userId={userId}
            onSave={(recipeId, saveStatus) => setIsSaved(saveStatus)}
            onFavorite={(recipeId, favoriteStatus) => setIsFavorite(favoriteStatus)}
            onPrint={printRecipe}
            onShare={shareRecipe}
            onClose={closeRecipeDetails}
            mockData={recipeData} // Pass initial data to prevent loading state
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RecipeCard;