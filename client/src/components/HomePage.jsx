import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, User, X, Plus, Filter, Percent } from "lucide-react";
import RecipeGrid from "../components/RecipeGrid";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import "../styles/HomePage.css";
import "../styles/SearchSection.css";
import { Link } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState("");
  
  const [ingredients, setIngredients] = useState([]);
  const [dietaryFilters, setDietaryFilters] = useState([
    { id: "1", name: "Vegetarian", active: false },
    { id: "2", name: "Vegan", active: false },
    { id: "3", name: "Gluten-Free", active: false },
    { id: "4", name: "Dairy-Free", active: false },
    { id: "5", name: "Nut-Free", active: false },
  ]);
  const [recipes, setRecipes] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [sortMethod, setSortMethod] = useState("bestMatch");

  const [userEmail, setUserEmail] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);

  // API URL - hardcoded for now, but could be stored in a config file
  const API_URL = 'http://localhost:5000/api';
  
  // Mock recipes for development/fallback when API is not available
  const mockRecipes = [
    {
      id: "1",
      title: "Scrambled Eggs",
      image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&q=80",
      cookingTime: 10,
      difficulty: "Easy",
      matchPercentage: 93,
      dietaryTags: ["Gluten-Free"],
      ingredients: [
        { name: "eggs", amount: 3, unit: "pcs" },
        { name: "butter", amount: 1, unit: "tbsp" },
        { name: "salt", amount: 0.25, unit: "tsp" },
        { name: "pepper", amount: 0.25, unit: "tsp" },
        { name: "milk", amount: 2, unit: "tbsp" }
      ],
      instructions: [
        { step: 1, description: "Crack eggs into a bowl and whisk with milk." },
        { step: 2, description: "Melt butter in a pan over medium heat." },
        { step: 3, description: "Add egg mixture and stir continuously." },
        { step: 4, description: "Season with salt and pepper." },
        { step: 5, description: "Serve warm." }
      ]
    },
    {
      id: "2",
      title: "Avocado Toast",
      image: "https://images.unsplash.com/photo-1588137378633-dea1336ce1e3?w=800&q=80",
      cookingTime: 5,
      difficulty: "Easy",
      matchPercentage: 89,
      dietaryTags: ["Vegetarian", "Vegan"],
      ingredients: [
        { name: "bread", amount: 2, unit: "slices" },
        { name: "avocado", amount: 1, unit: "pc" },
        { name: "olive oil", amount: 1, unit: "tsp" },
        { name: "salt", amount: 0.25, unit: "tsp" },
        { name: "pepper", amount: 0.25, unit: "tsp" },
        { name: "lemon", amount: 0.5, unit: "pc" }
      ],
      instructions: [
        { step: 1, description: "Toast the bread slices." },
        { step: 2, description: "Mash avocado with lemon juice, salt, and pepper." },
        { step: 3, description: "Spread avocado mixture on toast." },
        { step: 4, description: "Drizzle with olive oil and serve." }
      ]
    },
    {
      id: "3",
      title: "Simple Pasta",
      image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&q=80",
      cookingTime: 20,
      difficulty: "Easy",
      matchPercentage: 84,
      dietaryTags: ["Vegetarian"],
      ingredients: [
        { name: "pasta", amount: 200, unit: "g" },
        { name: "tomato sauce", amount: 1, unit: "cup" },
        { name: "garlic", amount: 2, unit: "cloves" },
        { name: "olive oil", amount: 1, unit: "tbsp" },
        { name: "basil", amount: 5, unit: "leaves" }
      ],
      instructions: [
        { step: 1, description: "Cook pasta in salted boiling water." },
        { step: 2, description: "Sauté garlic in olive oil." },
        { step: 3, description: "Add tomato sauce and simmer." },
        { step: 4, description: "Drain pasta and mix with sauce." },
        { step: 5, description: "Garnish with fresh basil." }
      ]
    },
    {
      id: "4",
      title: "Vegetable Stir Fry",
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80",
      cookingTime: 25,
      difficulty: "Medium",
      matchPercentage: 81,
      dietaryTags: ["Vegetarian", "Vegan", "Gluten-Free"],
      ingredients: [
        { name: "rice", amount: 1, unit: "cup" },
        { name: "bell pepper", amount: 1, unit: "pc" },
        { name: "broccoli", amount: 1, unit: "cup" },
        { name: "carrots", amount: 2, unit: "pcs" },
        { name: "soy sauce", amount: 2, unit: "tbsp" },
        { name: "garlic", amount: 2, unit: "cloves" },
        { name: "ginger", amount: 1, unit: "tsp" }
      ],
      instructions: [
        { step: 1, description: "Cook rice according to package instructions." },
        { step: 2, description: "Chop all vegetables." },
        { step: 3, description: "Stir fry garlic and ginger in a wok." },
        { step: 4, description: "Add vegetables and soy sauce." },
        { step: 5, description: "Cook until tender and serve with rice." }
      ]
    },
    {
      id: "5",
      title: "Pancakes",
      image: "https://images.unsplash.com/photo-1565299543923-37dd37887442?w=800&q=80",
      cookingTime: 15,
      difficulty: "Easy",
      matchPercentage: 90,
      dietaryTags: [],
      ingredients: [
        { name: "flour", amount: 1, unit: "cup" },
        { name: "eggs", amount: 2, unit: "pcs" },
        { name: "milk", amount: 1, unit: "cup" },
        { name: "butter", amount: 2, unit: "tbsp" },
        { name: "sugar", amount: 1, unit: "tbsp" },
        { name: "baking powder", amount: 1, unit: "tsp" }
      ],
      instructions: [
        { step: 1, description: "Mix all dry ingredients together." },
        { step: 2, description: "Add eggs and milk, mix well." },
        { step: 3, description: "Heat butter in a pan." },
        { step: 4, description: "Pour batter and cook pancakes until golden." }
      ]
    },
    {
      id: "6",
      title: "Spaghetti Carbonara",
      image: "https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=800&q=80",
      cookingTime: 15,
      difficulty: "Easy",
      matchPercentage: 95,
      dietaryTags: ["Gluten"],
      ingredients: [
        { name: "spaghetti", amount: 200, unit: "g" },
        { name: "eggs", amount: 2, unit: "pcs" },
        { name: "parmesan cheese", amount: 50, unit: "g" },
        { name: "pancetta", amount: 100, unit: "g" },
        { name: "black pepper", amount: 0.5, unit: "tsp" },
        { name: "salt", amount: 1, unit: "tsp" },
        { name: "olive oil", amount: 1, unit: "tbsp" },
        { name: "garlic", amount: 1, unit: "clove" }
      ],
      instructions: [
        { step: 1, description: "Cook spaghetti in salted water until al dente." },
        { step: 2, description: "Sauté pancetta with garlic in olive oil." },
        { step: 3, description: "Whisk eggs with cheese and pepper." },
        { step: 4, description: "Combine pasta with pancetta, then remove from heat and add egg mixture." },
        { step: 5, description: "Toss well and serve immediately." },
        { step: 6, description: "Garnish with extra cheese and pepper." },
        { step: 7, description: "Enjoy your carbonara!" }
      ]
    }
  ];  

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    const token = localStorage.getItem("authToken");
    const userId = localStorage.getItem("userId");
  
    if (email) setUserEmail(email);
    if (typeof setLoggedIn === "function") {
      setLoggedIn(!!token);
    }
  
    if (userId && typeof setUserId === "function") {
      setUserId(userId);
    }
  }, []);
  

  const handleAddIngredient = () => {
    const trimmed = inputValue.trim().toLowerCase();
    if (trimmed && !ingredients.some(ing => ing.name.toLowerCase() === trimmed)) {
      const newIngredient = {
        id: Date.now().toString(),
        name: trimmed
      };
      setIngredients([...ingredients, newIngredient]);
      setInputValue("");
    }
  };

  const handleFooterLinkClick = (path) => {
    navigate(path);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddIngredient();
    }
  };

  const handleRemoveIngredient = (id) => {
    setIngredients(ingredients.filter((ing) => ing.id !== id));
  };

  const handleToggleFilter = (id) => {
    setDietaryFilters(
      dietaryFilters.map((filter) =>
        filter.id === id ? { ...filter, active: !filter.active } : filter
      )
    );
  };

  const handleClearAll = () => {
    setIngredients([]);
    setDietaryFilters(dietaryFilters.map((filter) => ({ ...filter, active: false })));
  };

  // Updated search handler that tries to fetch from the backend API and falls back to local processing
  const handleSearch = async () => {
    setIsSearching(true);
    setError(null);
    
    try {
      // Extract ingredient names and active dietary filters
      const searchIngredients = ingredients.map(ing => ing.name);
      const activeDietaryFilters = dietaryFilters
        .filter(filter => filter.active)
        .map(filter => filter.name);
      
      // Create the request body
      const requestBody = {
        ingredients: searchIngredients,
        dietaryFilters: activeDietaryFilters,  // Updated to match backend
        sortBy: sortMethod
      };
      
      try {
        // Try to make the API call first
        const response = await fetch(`${API_URL}/recipes/search`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : ''
          },
          body: JSON.stringify(requestBody)
        });
        
        if (response.ok) {
          const data = await response.json();
          
          // Ensure the data format matches your expected response
          setRecipes(data); // Assuming the response is an array of recipes
          setHasSearched(true);
          setIsSearching(false);
          return; // Exit early if API call was successful
        } else {
          throw new Error('API call failed');
        }
      } catch (apiError) {
        console.log("API not available, falling back to local data");
        // If there's an API error, we'll just fall through to the local processing
      }
      
      // Fallback to local processing if API call failed
      console.log("Using local mock data instead");
      
      // Local processing logic remains the same
      const filteredRecipes = mockRecipes
        .map(recipe => {
          // Extract only the ingredient names from recipe objects
          const recipeIngredientsLower = recipe.ingredients.map(ing => ing.name.toLowerCase());
          
          // Count matching ingredients
          const matchingIngredients = searchIngredients.filter(searchIng => 
            recipeIngredientsLower.some(recipeIng => 
              recipeIng.includes(searchIng.toLowerCase()) || searchIng.toLowerCase().includes(recipeIng)
            )
          );
          
          // Calculate match percentage
          const matchPercentage = searchIngredients.length > 0 
            ? Math.round((matchingIngredients.length / recipe.ingredients.length) * 100)
            : 0;
          
          // Calculate missing ingredients
          const missingIngredients = recipe.ingredients
            .filter(ingredient => 
              !searchIngredients.some(searchIng => 
                ingredient.name.toLowerCase().includes(searchIng.toLowerCase()) || 
                searchIng.toLowerCase().includes(ingredient.name.toLowerCase())
              )
            )
            .map(ingredient => ingredient.name); // Extract just the name for missing ingredients
          
          return {
            ...recipe,
            matchPercentage,
            matchingIngredientsCount: matchingIngredients.length,
            missingIngredientsCount: missingIngredients.length,
            missingIngredients
          };
        })
        .filter(recipe => {
          // If no ingredients are provided, don't filter by ingredients
          const ingredientMatch = searchIngredients.length === 0 || recipe.matchingIngredientsCount > 0;
          
          // Check dietary preferences if any are selected
          const dietaryMatch = activeDietaryFilters.length === 0 || 
            activeDietaryFilters.every(filter => recipe.dietaryTags.includes(filter));
          
          return ingredientMatch && dietaryMatch;
        });
      
      // Sort according to chosen method
      const sortedRecipes = sortRecipes(filteredRecipes, sortMethod);
      
      setRecipes(sortedRecipes);
      setHasSearched(true);
    } catch (err) {
      console.error('Error processing recipes:', err);
      setError('Failed to process recipes. Please try again later.');
      setRecipes([]);
    } finally {
      setIsSearching(false);
    }
  };
  

  // Function to sort recipes based on selected method
  const sortRecipes = (recipes, method) => {
    switch(method) {
      case "bestMatch":
        // Sort by match percentage (highest first)
        return [...recipes].sort((a, b) => b.matchPercentage - a.matchPercentage);
      case "fewestMissing":
        // Sort by fewest missing ingredients
        return [...recipes].sort((a, b) => a.missingIngredientsCount - b.missingIngredientsCount);
      case "quickest":
        // Sort by cooking time (use cookingTime property directly)
        return [...recipes].sort((a, b) => a.cookingTime - b.cookingTime);
      default:
        return recipes;
    }
  };

  // This function will re-sort the existing recipes or trigger a new search
  const handleSortChange = (value) => {
    setSortMethod(value);
    if (hasSearched) {
      // Try to re-sort locally first if we have recipes
      if (recipes.length > 0) {
        const sortedRecipes = sortRecipes([...recipes], value);
        setRecipes(sortedRecipes);
      } else {
        // If we don't have recipes yet, make a new search
        handleSearch();
      }
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setUserEmail("");
    setIsModalOpen(false);
    navigate("/");
  };

  // Render the search section
  const renderSearchSection = () => {
    return (
      <div className="search-section">
        <div className="search-header">         
          <p className="search-subtitle">Add your available ingredients and we'll show you what you can cook!</p>
        </div>

        <div className="search-controls">
          <div className="input-wrapper">
            <Search className="search-icon" />
            <Input
              type="text"
              placeholder="Add an ingredient you have..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="ingredient-input"
            />
          </div>
          <Button onClick={handleAddIngredient}>
            <Plus className="icon" />
            Add
          </Button>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <Filter className="icon" />
                Filters
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="filter-popover">
                <h4>Dietary Preferences</h4>
                <p>Select your dietary restrictions.</p>
                <div className="checkboxes">
                  {dietaryFilters.map((filter) => (
                    <div key={filter.id} className="checkbox-row">
                      <Checkbox
                        id={filter.id}
                        checked={filter.active}
                        onCheckedChange={() => handleToggleFilter(filter.id)}
                      />
                      <Label htmlFor={filter.id}>{filter.name}</Label>
                    </div>
                  ))}
                </div>
                
                <div className="sort-options">
                  <h4>Sort Results By</h4>
                  <RadioGroup value={sortMethod} onValueChange={handleSortChange}>
                    <div className="radio-row">
                      <RadioGroupItem value="bestMatch" id="bestMatch" />
                      <Label htmlFor="bestMatch">Best Match</Label>
                    </div>
                    <div className="radio-row">
                      <RadioGroupItem value="fewestMissing" id="fewestMissing" />
                      <Label htmlFor="fewestMissing">Fewest Missing Ingredients</Label>
                    </div>
                    <div className="radio-row">
                      <RadioGroupItem value="quickest" id="quickest" />
                      <Label htmlFor="quickest">Quickest to Make</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Button onClick={handleSearch} className="bg-primary text-white">
            Find Recipes
          </Button>

          {ingredients.length > 0 && (
            <Button variant="ghost" onClick={handleClearAll}>
              Clear All
            </Button>
          )}
        </div>

        {ingredients.length > 0 && (
          <div className="ingredient-tags">
            <h4>Your Ingredients:</h4>
            {ingredients.map((ingredient) => (
              <Badge key={ingredient.id} variant="secondary" className="tag">
                {ingredient.name}
                <X
                  className="remove-icon"
                  onClick={() => handleRemoveIngredient(ingredient.id)}
                />
              </Badge>
            ))}
          </div>
        )}

        {dietaryFilters.some((filter) => filter.active) && (
          <div className="active-filters">
            <span>Active filters:</span>
            {dietaryFilters
              .filter((filter) => filter.active)
              .map((filter) => (
                <Badge key={filter.id} variant="outline" className="tag">
                  {filter.name}
                </Badge>
              ))}
          </div>
        )}
      </div>
    );
  };

  // Recipe grid with data from the backend
const renderEnhancedRecipeGrid = () => {
  if (isSearching) {
    return <div className="loading">Searching for recipes...</div>;
  }
  
  if (error) {
    return (
      <div className="error-message">
        <h3>Something went wrong</h3>
        <p>{error}</p>
      </div>
    );
  }
  
  if (recipes.length === 0 && hasSearched) {
    return (
      <div className="no-results">
        <h3>No matching recipes found</h3>
        <p>Try adding different ingredients or removing some filters.</p>
      </div>
    );
  }
  
  return (
    <RecipeGrid 
      recipes={recipes} 
      isLoading={isSearching}
      error={error}
      loggedIn={loggedIn} // Make sure you have this state variable
      userId={userId} // Make sure you have this state variable
    />
  );
};

  return (
    <div>
      <header className="header">
        <div className="header-container">
          <div className="header-left">
            <Search className="search-icon" />
            <h1 className="logo">Food Finder</h1>
          </div>
          <div className="auth-buttons">
            {userEmail ? (
              <div className="profile-section">
                <User
                  className="profile-icon"
                  onClick={() => setIsModalOpen(!isModalOpen)}
                />
                {isModalOpen && (
                  <div className="profile-modal">
                    <p>{userEmail}</p>
                    <button onClick={() => alert("Settings modal placeholder")}>Settings</button>
                    <button onClick={handleLogout}>Sign Out</button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button onClick={() => navigate("/signin")}>Sign In</button>
                <button className="sign-up" onClick={() => navigate("/signup")}>Sign Up</button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="hero">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="hero-content"
        >
          <h2>What's in Your Kitchen Today?</h2>
          <p>
            Tell us what ingredients you have at home, and we'll show you delicious recipes you can make right now!
          </p>
        </motion.div>

        {renderSearchSection()}

        {hasSearched ? (
          renderEnhancedRecipeGrid()
        ) : (
          <div className="placeholder">
            <img
              src="https://images.unsplash.com/photo-1547573854-74d2a71d0826?w=800&q=80"
              alt="Cooking ingredients"
            />
            <h3>Ready to cook with what you have?</h3>
            <p>
              Add your available ingredients above and hit search to find recipes that match what's in your kitchen.
            </p>
          </div>
        )}
      </main>

      <footer className="footer">
        <div className="footer-container">
          <div className="footer-top">
            <div className="footer-logo">
              <h3>Food Finder</h3>
              <p>Find recipes with ingredients you already have</p>
            </div>
            <div className="footer-links">
              <Link to="/about" onClick={() => handleFooterLinkClick('/about')}>About</Link>
              <Link to="/contact" onClick={() => handleFooterLinkClick('/contact')}>Contact</Link>
              <Link to="/privacy" onClick={() => handleFooterLinkClick('/privacy')}>Privacy</Link>
              <Link to="/terms" onClick={() => handleFooterLinkClick('/terms')}>Terms</Link>
            </div>
          </div>
          <div className="footer-bottom">
            © {new Date().getFullYear()} Food Finder. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;