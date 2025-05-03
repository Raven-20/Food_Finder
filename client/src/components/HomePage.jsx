import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, X } from "lucide-react";
import RecipeGrid from "../components/RecipeGrid";
import "../styles/HomePage.css";
import { Link } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState(null);

  const [currentIngredient, setCurrentIngredient] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [userEmail, setUserEmail] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    const token = localStorage.getItem("authToken");
    const storedUserId = localStorage.getItem("userId");

    if (email) setUserEmail(email);
    setLoggedIn(!!token);
    setUserId(storedUserId);

    fetchRecipes(); // initial load
  }, []);

  // New function to fetch all recipes at once
  const fetchRecipes = async () => {
    setIsSearching(true);
    try {
      const response = await fetch("http://localhost:5000/api/recipes");
      if (!response.ok) {
        throw new Error("Failed to fetch recipes");
      }

      const data = await response.json();
      setRecipes(data);
      
      // Initially show all recipes if no search has been performed
      if (!hasSearched) {
        setFilteredRecipes(data);
      } else {
        // Apply filtering if a search has been performed
        filterRecipesByIngredients(data, ingredients);
      }
      
      setError(null);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsSearching(false);
    }
  };

  // New function to filter recipes based on ingredients
  const filterRecipesByIngredients = (recipeList, ingredientsList) => {
    if (ingredientsList.length === 0) {
      // If no ingredients specified, show all recipes
      setFilteredRecipes(recipeList);
      return;
    }

    // Convert search ingredients to lowercase for case-insensitive matching
    const lowerCaseIngredients = ingredientsList.map(ing => ing.toLowerCase());
    
    // Filter recipes that contain ALL the specified ingredients
    const filtered = recipeList.filter(recipe => {
      // Make sure recipe.ingredients exists and is an array
      if (!recipe.ingredients || !Array.isArray(recipe.ingredients)) {
        return false;
      }
      
      // Convert recipe ingredients to lowercase for case-insensitive matching
      const recipeIngredientsList = recipe.ingredients.map(ing => 
        typeof ing === 'string' ? ing.toLowerCase() : 
        (ing.name ? ing.name.toLowerCase() : '')
      );
      
      // Check if ALL search ingredients are included in this recipe
      return lowerCaseIngredients.every(ingredient => 
        recipeIngredientsList.some(recipeIng => recipeIng.includes(ingredient))
      );
    });
    
    setFilteredRecipes(filtered);
  };

  const handleAddIngredient = () => {
    if (currentIngredient.trim() !== "" && !ingredients.includes(currentIngredient.trim())) {
      const newIngredients = [...ingredients, currentIngredient.trim()];
      setIngredients(newIngredients);
      setCurrentIngredient("");
      
      // Filter recipes whenever ingredients change
      filterRecipesByIngredients(recipes, newIngredients);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAddIngredient();
    }
  };

  const handleRemoveIngredient = (index) => {
    const newIngredients = [...ingredients];
    newIngredients.splice(index, 1);
    setIngredients(newIngredients);
    
    // Filter recipes whenever ingredients change
    filterRecipesByIngredients(recipes, newIngredients);
  };

  const handleSearch = () => {
    setHasSearched(true);
    filterRecipesByIngredients(recipes, ingredients);
  };

  const handleFooterLinkClick = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.clear();
    setUserEmail("");
    setIsModalOpen(false);
    navigate("/");
  };

  const renderRecipeGrid = () => {
    if (isSearching) {
      return <div className="loading">Loading recipes...</div>;
    }

    if (error) {
      return (
        <div className="error-message">
          <h3>Something went wrong</h3>
          <p>{error}</p>
        </div>
      );
    }

    if (filteredRecipes.length === 0 && hasSearched) {
      return (
        <div className="no-results">
          <h3>No recipes found with these ingredients</h3>
          <p>Try removing some ingredients or adding different ones.</p>
        </div>
      );
    }

    return (
      <RecipeGrid
        recipes={filteredRecipes}
        isLoading={isSearching}
        error={error}
        loggedIn={loggedIn}
        userId={userId}
      />
    );
  };

  return (
    <div>
      <header className="header">
        <div className="header-container">
          <div className="header-left">
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
                <button className="sign-up" onClick={() => navigate("/signup")}>
                  Sign Up
                </button>
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
          <h2>Discover Delicious Recipes</h2>
          <p>Enter the ingredients you have and get matched recipes!</p>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Type an ingredient and press Enter"
              value={currentIngredient}
              onChange={(e) => setCurrentIngredient(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button onClick={handleAddIngredient}>Add</button>
            <button onClick={handleSearch} className="search-button">Search</button>
          </div>
          
          {ingredients.length > 0 && (
            <div className="ingredients-tags">
              {ingredients.map((ingredient, index) => (
                <div className="ingredient-tag" key={index}>
                  {ingredient}
                  <X 
                    className="remove-ingredient" 
                    size={16} 
                    onClick={() => handleRemoveIngredient(index)}
                  />
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {renderRecipeGrid()}
      </main>

      <footer className="footer">
        <div className="footer-container">
          <div className="footer-top">
            <div className="footer-logo">
              <h3>Food Finder</h3>
              <p>Find recipes for any occasion</p>
            </div>
            <div className="footer-links">
              <Link to="/about">About</Link>
              <Link to="/contact">Contact</Link>
              <Link to="/privacy">Privacy</Link>
              <Link to="/terms">Terms</Link>
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