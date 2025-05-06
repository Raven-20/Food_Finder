import React, { useEffect, useState } from "react";
import RecipeGrid from "../components/RecipeGrid";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FavoritesPage = () => {
  const navigate = useNavigate();
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(""); // ✅ Add successMessage state
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/favorites/${userId}`);
        if (!response.ok) throw new Error("Failed to fetch favorites.");
        const data = await response.json();
        setFavoriteRecipes(data.favorites);
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

  // ✅ Remove from favorites handler using DELETE request
  const handleRemoveFavorite = async (recipeId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/favorites/${userId}/${recipeId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to remove favorite.");

      // Update local state
      setFavoriteRecipes((prev) => prev.filter((r) => r._id !== recipeId));

      // Show success message
      setSuccessMessage("Dish successfully Removed!");
      
      // Hide the message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000); 
    } catch (err) {
      console.error("Error removing favorite:", err);
      alert("Could not remove favorite. Please try again.");
    }
  };

  return (
    <div className="favorites-page p-4">
      <button className="back-button mb-4 flex items-center gap-2" onClick={() => navigate(-1)}>
        <ArrowLeft />
        <span>Back</span>
      </button>
      <h2 className="text-xl font-bold mb-4">Your Favorite Recipes</h2>
      {error && <p className="error text-red-600">{error}</p>}

      {/* Display success message */}
      {successMessage && (
        <div className="success-message p-2 bg-green-500 text-white rounded mb-4">
          {successMessage}
        </div>
      )}

      <RecipeGrid
        recipes={favoriteRecipes}
        isLoading={isLoading}
        error={error}
        loggedIn={!!userId}
        userId={userId}
        onRemoveFavorite={handleRemoveFavorite}
      />
    </div>
  );
};

export default FavoritesPage;
