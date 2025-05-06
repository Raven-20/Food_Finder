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
} from "../lib/utils";
import { getRecipeDetails, toggleFavorite } from "../lib/recipeApi";
import { jsPDF } from "jspdf"; // Import jsPDF\
import { FaFacebook, FaLink } from "react-icons/fa";


const RecipeDetail = ({ id, isLoggedIn, userId, onClose, onFavoriteUpdate }) => {
  const [recipe, setRecipe] = useState(null);
  const [recipeDetails, setRecipeDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [servings, setServings] = useState(4);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

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
        } catch {
          console.log("Note: Detailed recipe info not available, using basic data only");
        }
  
        if (isLoggedIn && userId) {
          try {
            const favoriteData = await checkFavoriteStatus(userId, id);
            setIsFavorite(favoriteData?.isFavorite || false);
          } catch (favErr) {
            console.log("Could not check favorite status:", favErr);
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

  // Show toast message for a few seconds
  const displayToast = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const handleToggleFavorite = async () => {
    if (!isLoggedIn) {
      alert("Please log in to favorite recipes.");
      return;
    }
  
    try {
      setFavoriteLoading(true);
      console.log("Toggling favorite for:", { userId, id, isFavorite });
      
      // Use the new toggleFavorite function from recipeApi.js
      const result = await toggleFavorite(userId, id, !isFavorite);
      
      if (result.success) {
        const newFavoriteStatus = !isFavorite;
        setIsFavorite(newFavoriteStatus);
        
        // Display appropriate toast message
        if (newFavoriteStatus) {
          displayToast("Successfully added to Favorites!");
        } else {
          displayToast("Removed from Favorites");
        }
      
        // Notify parent/global store to add/remove recipe
        if (typeof onFavoriteUpdate === 'function') {
          onFavoriteUpdate({
            recipeId: id,
            isFavorite: newFavoriteStatus,
            recipeSummary: {
              id,
              title: recipe?.title,
              image: recipe?.image,
              prepTime: recipe?.prepTime,
              cookTime: recipe?.cookTime,
            },
          });
        }
      } else {
        throw new Error(result.message || "Failed to update favorite status");
      }      
    } catch (err) {
      console.error("Error toggling favorite:", err);
      displayToast("Failed to update favorite status. Please try again.");
    } finally {
      setFavoriteLoading(false);
    }
  };

  const adjustServings = (increase) => {
    setServings(prev => Math.max(1, prev + (increase ? 1 : -1)));
  };

  // Updated to use regular ingredients instead of scaled ingredients
  const saveRecipeAsPDF = () => {
    const doc = new jsPDF();

    // Title and Image
    doc.setFontSize(18);
    doc.text(combinedRecipe.title, 20, 20);
    const img = new Image();
    img.src = combinedRecipe.image || "/placeholder-recipe.jpg";
    img.onload = () => {
      doc.addImage(img, 'JPEG', 20, 30, 180, 100);

      // Recipe Details
      doc.setFontSize(12);      
      doc.text(`Difficulty: ${combinedRecipe.difficulty}`, 20, 160);

      // Ingredients
      doc.text("Ingredients:", 20, 170);
      let yPos = 180;
      combinedRecipe.ingredients?.forEach((ingredient, idx) => {
        const ingredientText = `${ingredient.amount} ${ingredient.unit} ${ingredient.name}`;
        doc.text(ingredientText, 20, yPos);
        yPos += 10;
      });

      // Instructions
      doc.text("Instructions:", 20, yPos);
      yPos += 10;
      combinedRecipe.instructions?.forEach((stepObj, idx) => {
        const stepText = typeof stepObj === "string" ? stepObj : stepObj.description;
        doc.text(`${idx + 1}. ${stepText}`, 20, yPos);
        yPos += 10;
      });

      // Save the PDF
      doc.save(`${combinedRecipe.title}.pdf`);
    };
  };

  const shareRecipe = async () => {
    const url = window.location.href;

    // Copy the URL to clipboard
    try {
      await navigator.clipboard.writeText(url);
      displayToast("Link copied to clipboard!");
    } catch (err) {
      console.error("Clipboard copy failed:", err);
      alert("Failed to copy link.");
    }

    // Open Facebook Messenger share
    const messengerShareUrl = `https://www.facebook.com/dialog/send?` +
      `link=${encodeURIComponent(url)}` +
      `&app_id=YOUR_FACEBOOK_APP_ID` +
      `&redirect_uri=${encodeURIComponent(url)}`;

    window.open(messengerShareUrl, "_blank");
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

  return (
    <div className="recipe-detail relative">
      {/* Toast Notification */}
      {showToast && (
        <div className="toast-message fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-md shadow-md flex items-center z-50 animate-fade-in">
          <Check className="h-5 w-5 mr-2" />
          {toastMessage}
        </div>
      )}

      <div className="recipe-detail-header mb-4 flex justify-between items-center">
        <Button variant="ghost" onClick={onClose}>
          <ChevronLeft className="h-5 w-5 mr-1" /> Back
        </Button>
        <div className="recipe-actions flex gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleToggleFavorite} 
            className={isFavorite ? "text-red-500" : ""}
            disabled={favoriteLoading}
          >
            {favoriteLoading ? (
              <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
            ) : (
              <Heart className="h-5 w-5" fill={isFavorite ? "currentColor" : "none"} />
            )}
          </Button>
          {/* Copy Link Button */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert("Link copied to clipboard!");
            }}>
            <FaLink className="h-5 w-5" />
          </Button>

          {/* Share to Facebook Button */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              const shareUrl = encodeURIComponent(window.location.href);
              const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`;
              window.open(facebookUrl, "_blank", "noopener,noreferrer");
            }}>
            <FaFacebook className="h-5 w-5 text-blue-600" />
          </Button>
          <Button variant="outline" size="icon" onClick={saveRecipeAsPDF}>
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
            <h1 className="recipe-title text-2xl font-bold mb-2">{combinedRecipe.title}
              {isFavorite && <Badge className="ml-2 bg-red-500 text-white">Favorited</Badge>}
            </h1>
            <div className="flex flex-wrap items-center gap-4 mb-3">
              {combinedRecipe.prepTime > 0 && (
                <div className="flex items-center">
                  <AlarmClock className="h-4 w-4 text-gray-500 mr-1" />
                  <span className="text-sm">{combinedRecipe.prepTime} mins prep</span>
                </div>
              )}
              
              
            </div>
            
            
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
                  {combinedRecipe.ingredients?.map((ingredient, idx) => (
                    <li key={idx} className="ingredient-item flex items-start py-1">
                      <div className="ingredient-amount min-w-[80px] text-sm">
                        {ingredient.amount} {ingredient.unit}
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