import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { User, X } from "lucide-react";
import RecipeGrid from "../components/RecipeGrid";
import "../styles/HomePage.css";

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

  const fetchRecipes = async (ingredientQuery = "") => {
    setIsSearching(true);
    try {
      const url = ingredientQuery
        ? `http://localhost:5000/api/recipes?ingredients=${encodeURIComponent(ingredientQuery)}`
        : "http://localhost:5000/api/recipes";

      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch recipes");

      const data = await response.json();
      setRecipes(data);
      setFilteredRecipes(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddIngredient = () => {
    const trimmed = currentIngredient.trim();
    if (trimmed !== "" && !ingredients.includes(trimmed)) {
      const updated = [...ingredients, trimmed];
      setIngredients(updated);
      setCurrentIngredient("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAddIngredient();
    }
  };

  const handleRemoveIngredient = (index) => {
    const updated = [...ingredients];
    updated.splice(index, 1);
    setIngredients(updated);

    // Optional: re-trigger search if ingredients were previously searched
    if (hasSearched) {
      const query = updated.join(",");
      fetchRecipes(query);
    }
  };

  const handleSearch = () => {
    setHasSearched(true);
    const query = ingredients.join(",");
    fetchRecipes(query);
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
                    <button onClick={() => navigate("/favorites")}>Favorites</button>
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
