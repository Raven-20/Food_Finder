import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, User } from "lucide-react"; // User icon for profile
import SearchSection from "../components/SearchSection";
import RecipeGrid from "../components/RecipeGrid";
import "../styles/HomePage.css";

const HomePage = () => {
  const navigate = useNavigate();

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

  const mockRecipes = [/* mock recipe objects */];

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    if (email) setUserEmail(email);
  }, []); // This will run once when the component mounts

  const handleSearch = () => {
    setIsSearching(true);
    setTimeout(() => {
      setRecipes(mockRecipes);
      setIsSearching(false);
      setHasSearched(true);
    }, 1500);
  };

  const handleAddIngredient = (ingredient) => {
    setIngredients([...ingredients, ingredient]);
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

  const handleLogout = () => {
    localStorage.clear();
    setUserEmail("");
    setIsModalOpen(false);
    navigate("/"); // Redirect to the homepage after logging out
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

        <SearchSection
          ingredients={ingredients}
          dietaryFilters={dietaryFilters}
          onAddIngredient={handleAddIngredient}
          onRemoveIngredient={handleRemoveIngredient}
          onToggleFilter={handleToggleFilter}
          onClearAll={handleClearAll}
          onSearch={handleSearch}
        />

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
              <a href="#">About</a>
              <a href="#">Contact</a>
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
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
