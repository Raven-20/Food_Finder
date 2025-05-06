import React, { useEffect, useState } from "react";
import RecipeGrid from "../components/RecipeGrid";

const FavoritesPage = () => {
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/favorites/${userId}`);
        if (!response.ok) throw new Error("Failed to fetch favorites.");
        const data = await response.json();
        setFavoriteRecipes(data.favorites); // ✅ Make sure this matches your backend response
        setError(null);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) fetchFavorites();
  }, [userId]);

  return (
    <div className="favorites-page">
      <h2>Your Favorite Recipes</h2>
      {error && <p className="error">{error}</p>}
      <RecipeGrid
        recipes={favoriteRecipes}
        isLoading={isLoading}
        error={error}
        loggedIn={!!userId}
        userId={userId}
      />
    </div>
  );
};

export default FavoritesPage;
