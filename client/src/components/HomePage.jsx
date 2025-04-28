import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, User, X, Plus, Filter } from "lucide-react"; // Added X, Plus, Filter icons
import RecipeGrid from "../components/RecipeGrid";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import "../styles/HomePage.css";
import "../styles/SearchSection.css"; // Make sure to import the SearchSection styles as well
import { Link } from "react-router-dom"; // Added Link

const HomePage = () => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState(""); // Added from SearchSection
  
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

  const [userEmail, setUserEmail] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state

  // Mock recipes - normally these would come from the API
  const mockRecipes = [
    {
      id: "1",
      title: "Scrambled Eggs",
      image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&q=80",
      ingredients: ["eggs", "butter", "salt", "pepper", "milk"],
      time: "10 min",
      difficulty: "Easy",
      dietary: ["Gluten-Free"]
    },
    {
      id: "2",
      title: "Avocado Toast",
      image: "https://images.unsplash.com/photo-1588137378633-dea1336ce1e3?w=800&q=80",
      ingredients: ["bread", "avocado", "olive oil", "salt", "pepper", "lemon"],
      time: "5 min",
      difficulty: "Easy",
      dietary: ["Vegetarian", "Vegan"]
    },
    {
      id: "3",
      title: "Simple Pasta",
      image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&q=80",
      ingredients: ["pasta", "tomato sauce", "garlic", "olive oil", "basil"],
      time: "20 min",
      difficulty: "Easy",
      dietary: ["Vegetarian"]
    }
  ];

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    if (email) setUserEmail(email);
  }, []); // This will run once when the component mounts

  // Functions from SearchSection component
  const handleAddIngredient = () => {
    const trimmed = inputValue.trim();
    if (trimmed) {
      const newIngredient = {
        id: Date.now().toString(),
        name: trimmed
      };
      setIngredients([...ingredients, newIngredient]);
      setInputValue("");
    }
  };

   // Function to handle footer link clicks
   const handleFooterLinkClick = (path) => {
    // You can add any additional logic here if needed
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

  // Updated search handler that filters recipes based on ingredients
  const handleSearch = () => {
    setIsSearching(true);
    
    // In a real app, this would be an API call
    // For now, simulate an API delay and filter the mock recipes
    setTimeout(() => {
      // Convert ingredient names to lowercase for case-insensitive matching
      const searchIngredients = ingredients.map(ing => 
        ing && ing.name ? ing.name.toLowerCase() : ""
      ).filter(name => name !== ""); // Filter out empty strings
      
      // Get active dietary filters
      const activeDietaryFilters = dietaryFilters
        .filter(filter => filter.active)
        .map(filter => filter.name);
      
      // Filter the mock recipes that contain ANY of the searched ingredients
      const filteredRecipes = mockRecipes.filter(recipe => {
        // If no ingredients are provided, don't filter by ingredients
        if (searchIngredients.length === 0) {
          return true;
        }
        
        // Check if the recipe contains any of the searched ingredients
        const hasIngredient = searchIngredients.some(searchIng => 
          recipe.ingredients.some(recipeIng => 
            recipeIng.toLowerCase().includes(searchIng)
          )
        );
        
        // Check dietary preferences if any are selected
        const matchesDietary = activeDietaryFilters.length === 0 || 
          activeDietaryFilters.some(filter => 
            recipe.dietary.includes(filter)
          );
        
        return hasIngredient && matchesDietary;
      });
      
      setRecipes(filteredRecipes);
      setIsSearching(false);
      setHasSearched(true);
    }, 1500);
  };

  const handleLogout = () => {
    localStorage.clear();
    setUserEmail("");
    setIsModalOpen(false);
    navigate("/"); // Redirect to the homepage after logging out
  };

  // Render the search section (formerly SearchSection component)
  const renderSearchSection = () => {
    return (
      <div className="search-section">
        <div className="search-header">
          <h2>Find Recipes with Your Ingredients</h2>
        </div>

        <div className="search-controls">
          <div className="input-wrapper">
            <Search className="search-icon" />
            <Input
              type="text"
              placeholder="Add an ingredient..."
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
              </div>
            </PopoverContent>
          </Popover>

          <Button onClick={handleSearch} className="bg-primary text-white">
            Search Recipes
          </Button>

          {ingredients.length > 0 && (
            <Button variant="ghost" onClick={handleClearAll}>
              Clear All
            </Button>
          )}
        </div>

        {ingredients.length > 0 && (
          <div className="ingredient-tags">
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
        >
          <h2>Find Recipes With What You Have</h2>
          <p>
            Enter ingredients you already have at home, and we'll suggest delicious recipes you can make right now.
          </p>
        </motion.div>

        {/* Render the search section here */}
        {renderSearchSection()}

        {hasSearched ? (
          <RecipeGrid
            recipes={recipes}
            isLoading={isSearching}
            isAuthenticated={!!userEmail}
          />
        ) : (
          <div className="placeholder">
            <img
              src="https://images.unsplash.com/photo-1495195134817-aeb325a55b65?w=800&q=80"
              alt="Cooking ingredients"
            />
            <h3>Ready to discover new recipes?</h3>
            <p>
              Add ingredients above and hit search to find recipes that match what you have in your kitchen.
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