import React, { useState, useEffect } from "react";
import "../styles/RecipeGrid.css";
import RecipeCard from "./RecipeCard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Slider } from "./ui/slider";
import { Badge } from "./ui/badge";

// Update this with your actual API URL - typically if running locally:
const API_URL = "http://localhost:5000/api/recipes"; // or whatever port your backend runs on
const SAVED_RECIPES_URL = "http://localhost:5000/api/savedrecipes";

const RecipeGrid = ({
  recipes = [],
  isLoading = false,
  error = "",
  loggedIn = false,
  userId = "",
}) => {
  const [sortBy, setSortBy] = useState("match");
  const [filterTime, setFilterTime] = useState([120]); // Set to max to show all recipes by default
  const [activeView, setActiveView] = useState("grid");
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [backendRecipes, setBackendRecipes] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [fetchError, setFetchError] = useState("");

  // Fetch recipes from backend API
  useEffect(() => {
    const fetchRecipes = async () => {
      setFetching(true);
      try {
        const response = await fetch(API_URL);
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Fetched recipes:", data);
        
        // Transform data if needed to match expected format
        const formattedData = data.map(recipe => ({
          id: recipe._id || recipe.id, // MongoDB uses _id by default
          title: recipe.title,
          image: recipe.image,
          matchPercentage: recipe.matchPercentage || 80, // Default if not provided
          cookingTime: recipe.cookingTime || 30, // Default if not provided
          difficulty: recipe.difficulty || "Medium",
          dietaryTags: recipe.dietaryTags || []
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
  }, []);  // Empty dependency array means it runs once when component mounts

  // Fetch saved recipes when logged in
  useEffect(() => {
    if (loggedIn && userId) {
      const fetchSavedRecipes = async () => {
        try {
          // Adjust this endpoint to match your backend structure
          const response = await fetch(`${SAVED_RECIPES_URL}/${userId}`);
          
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          
          const data = await response.json();
          console.log("Fetched saved recipes:", data);
          
          // Assuming your savedrecipes collection returns recipe IDs associated with the user
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
    // Only apply time filter if it's been explicitly set by the user (less than max value)
    const matchesTime = filterTime[0] >= 120 ? true : recipe.cookingTime <= filterTime[0];
    const matchesSearch =
      !searchTerm ||
      recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (recipe.dietaryTags && recipe.dietaryTags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      ));
    return matchesTime && matchesSearch;
  });

  const handleTimeFilterChange = (value) => setFilterTime(value);

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
          <h3 className="text-xl font-semibold text-destructive mb-2">
            Error Loading Recipes
          </h3>
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
        <Tabs
          defaultValue="grid"
          value={activeView}
          onValueChange={setActiveView}
          className="w-full"
        >
          <div className="recipe-grid-toolbar">
            <TabsList>
              <TabsTrigger value="grid">Grid View</TabsTrigger>
              <TabsTrigger value="list">List View</TabsTrigger>
            </TabsList>

            <div className="recipe-grid-controls">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Search by ingredient or recipe"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="p-2 border rounded"
                />
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">Max Time:</span>
                <div className="w-[150px]">
                  <Slider
                    defaultValue={[120]}
                    max={120}
                    step={5}
                    value={filterTime}
                    onValueChange={handleTimeFilterChange}
                  />
                </div>
                <span className="text-sm">{filterTime[0]} min</span>
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
                  {...recipe}
                  isSaved={savedRecipes.includes(recipe.id || recipe._id)}
                  loggedIn={loggedIn}
                  userId={userId}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="list">
            <div className="flex flex-col space-y-4">
              {filteredRecipes.map((recipe) => (
                <div key={recipe.id || recipe._id} className="recipe-list-item">
                  <div className="recipe-list-image">
                    <img
                      src={recipe.image}
                      alt={recipe.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-4 flex-1">
                    <h3 className="text-lg font-semibold mb-2">
                      {recipe.title}
                    </h3>
                    <div className="flex items-center mb-2">
                      <span className="text-sm font-medium text-green-600 mr-2">
                        {recipe.matchPercentage}% match
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {recipe.cookingTime} min
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {recipe.dietaryTags && recipe.dietaryTags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
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
    </div>
  );
};

export default RecipeGrid;