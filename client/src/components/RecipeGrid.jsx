import React, { useState, useEffect } from "react";
import "../styles/RecipeGrid.css";
import RecipeCard from "./RecipeCard";
import RecipeDetail from "./RecipeDetail";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Slider } from "./ui/slider";
import { Badge } from "./ui/badge";

const API_URL = "http://localhost:5000/api/recipes";
const SAVED_RECIPES_URL = "http://localhost:5000/api/savedrecipes";

const RecipeGrid = ({
  recipes = [],
  isLoading = false,
  error = "",
  loggedIn = false,
  userId = "",
}) => {
  const [sortBy, setSortBy] = useState("match");
  const [filterTime, setFilterTime] = useState([120]);
  const [activeView, setactiveView] = useState("grid");
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [backendRecipes, setBackendRecipes] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [selectedRecipeId, setSelectedRecipeId] = useState(null); // New state for selected recipe

  useEffect(() => {
    const fetchRecipes = async () => {
      setFetching(true);
      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        console.log("Fetched recipes:", data);

        const formattedData = data.map(recipe => ({
          id: recipe._id || recipe.id,
          title: recipe.title,
          image: recipe.image,
          matchPercentage: recipe.matchPercentage || 80,
          cookingTime: recipe.cookingTime || 30,
          difficulty: recipe.difficulty || "Medium",
          dietaryTags: recipe.dietaryTags || [],
          ingredients: recipe.ingredients || [],
        }));

        setBackendRecipes(formattedData);
      } catch (error) {
        console.error("Error fetching recipes:", error);
        setFetchError("Failed to fetch recipes. Please try again later.");
      } finally {
        setFetching(false);
      }
    };

    fetchRecipes();
  }, []);

  useEffect(() => {
    if (loggedIn && userId) {
      const fetchSavedRecipes = async () => {
        try {
          const response = await fetch(`${SAVED_RECIPES_URL}/${userId}`);
          if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
          const data = await response.json();
          console.log("Fetched saved recipes:", data);
          const recipeIds = data.map(item => item.recipeId || item._id);
          setSavedRecipes(recipeIds);
        } catch (error) {
          console.error("Error fetching saved recipes:", error);
        }
      };
      fetchSavedRecipes();
    }
  }, [loggedIn, userId]);

  const displayRecipes = backendRecipes.length > 0 ? backendRecipes : recipes;

  const sortedRecipes = [...displayRecipes].sort((a, b) => {
    if (sortBy === "match") return b.matchPercentage - a.matchPercentage;
    if (sortBy === "time") return a.cookingTime - b.cookingTime;
    return a.title.localeCompare(b.title);
  });

  const filteredRecipes = sortedRecipes.filter((recipe) => {
    const matchesTime = filterTime[0] >= 120 ? true : recipe.cookingTime <= filterTime[0];

    const inputIngredients = searchTerm
      .toLowerCase()
      .split(",")
      .map((ing) => ing.trim())
      .filter(Boolean);

    const matchesIngredients =
      inputIngredients.length === 0 ||
      inputIngredients.every((ing) =>
        recipe.ingredients?.some((recipeIng) =>
          typeof recipeIng === 'string' 
            ? recipeIng.toLowerCase().includes(ing)
            : recipeIng.name.toLowerCase().includes(ing)
        )
      );

    return matchesTime && matchesIngredients;
  });

  const handleTimeFilterChange = (value) => setFilterTime(value);
  
  // New handlers for the RecipeDetail modal
  const handleViewDetails = (recipeId) => {
    setSelectedRecipeId(recipeId);
  };

  const handleCloseDetails = () => {
    setSelectedRecipeId(null);
  };

  const handleSaveRecipe = async (recipeId) => {
    if (!loggedIn) {
      alert("Please log in to save recipes");
      return;
    }
    
    try {
      const isSaved = savedRecipes.includes(recipeId);
      const method = isSaved ? 'DELETE' : 'POST';
      
      const response = await fetch(`${SAVED_RECIPES_URL}/${userId}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ recipeId }),
      });
      
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      
      // Update the saved recipes state
      setSavedRecipes(prev => 
        isSaved 
          ? prev.filter(id => id !== recipeId)
          : [...prev, recipeId]
      );
      
      console.log(`Recipe ${recipeId} ${isSaved ? 'unsaved' : 'saved'} successfully!`);
    } catch (error) {
      console.error("Error updating saved recipe:", error);
    }
  };

  const handleShareRecipe = (recipeId) => {
    console.log(`Sharing recipe ${recipeId}`);
    // Implement sharing functionality here
  };

  const handlePrintRecipe = (recipeId) => {
    console.log(`Printing recipe ${recipeId}`);
    // Implement printing functionality here
  };

  if (fetching || isLoading) {
    return (
      <div className="recipe-grid-container">
        <div className="text-center py-10">
          <h3 className="text-xl font-semibold mb-2">Loading Recipes...</h3>
          <p className="text-muted-foreground">Please wait while we find delicious recipes for you.</p>
        </div>
      </div>
    );
  }

  if (fetchError || error) {
    return (
      <div className="recipe-grid-container">
        <div className="text-center py-10">
          <h3 className="text-xl font-semibold text-destructive mb-2">Error Loading Recipes</h3>
          <p className="text-muted-foreground">{fetchError || error}</p>
        </div>
      </div>
    );
  }

  if (filteredRecipes.length === 0) {
    return (
      <div className="recipe-grid-container">
        <div className="text-center py-10">
          <h3 className="text-xl font-semibold mb-2">No Recipes Found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search criteria or adding different ingredients.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="recipe-grid-container">
      <div className="recipe-grid-header">
        <Tabs defaultValue="grid" value={activeView} onValueChange={setactiveView} className="w-full">
          <div className="recipe-grid-toolbar">
            <TabsList>
              <TabsTrigger value="grid">Grid View</TabsTrigger>
              <TabsTrigger value="list">List View</TabsTrigger>
            </TabsList>

            <div className="recipe-grid-controls">
              <div className="flex items-center space-x-2">
                <div className="w-[150px]">
                  <Slider
                    defaultValue={[120]}
                    max={120}
                    step={5}
                    value={filterTime}
                    onValueChange={handleTimeFilterChange}
                  />
                </div>
              </div>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="match">Best Match</SelectItem>
                  <SelectItem value="time">Cooking Time</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mb-4">
            <Badge variant="outline" className="mr-2">
              {filteredRecipes.length} recipes found
            </Badge>
            {filterTime[0] < 120 && (
              <Badge variant="outline" className="mr-2">
                Under {filterTime[0]} minutes
              </Badge>
            )}
            {searchTerm && (
              <Badge variant="outline" className="mr-2">
                Search: "{searchTerm}"
              </Badge>
            )}
          </div>

          <TabsContent value="grid">
            <div className="recipe-grid">
              {filteredRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id || recipe._id}
                  id={recipe.id || recipe._id}
                  title={recipe.title}
                  image={recipe.image}
                  matchPercentage={recipe.matchPercentage}
                  cookingTime={recipe.cookingTime}
                  dietaryTags={recipe.dietaryTags || []}
                  onViewDetails={handleViewDetails}
                  loggedIn={loggedIn}
                  userId={userId}
                  isSaved={savedRecipes.includes(recipe.id || recipe._id)}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="list">
            <div className="flex flex-col space-y-4">
              {filteredRecipes.map((recipe) => (
                <div 
                  key={recipe.id || recipe._id} 
                  className="recipe-list-item cursor-pointer"
                  onClick={() => handleViewDetails(recipe.id || recipe._id)}
                >
                  <div className="recipe-list-image">
                    <img
                      src={recipe.image}
                      alt={recipe.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-4 flex-1">
                    <h3 className="text-lg font-semibold mb-2">{recipe.title}</h3>
                    <div className="flex items-center mb-2">
                      <span className="text-sm font-medium text-green-600 mr-2">
                        {recipe.matchPercentage}% match
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {recipe.cookingTime} min
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {recipe.dietaryTags &&
                        recipe.dietaryTags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Recipe Detail Modal */}
      {selectedRecipeId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <RecipeDetail
              id={selectedRecipeId}
              isLoggedIn={loggedIn}
              userId={userId}
              onSave={handleSaveRecipe}
              onShare={handleShareRecipe}
              onPrint={handlePrintRecipe}
              onClose={handleCloseDetails}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeGrid;