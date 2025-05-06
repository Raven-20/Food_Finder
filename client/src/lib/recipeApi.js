// lib/recipeApi.js

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api'
  : 'http://localhost:5000/api';

async function handleApiResponse(response, errorMessage) {
  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = { message: errorMessage };
    }
    throw new Error(errorData.message || errorMessage);
  }
  return await response.json();
}

export async function fetchAllRecipes() {
  try {
    const response = await fetch(`${API_BASE_URL}/recipes`);
    return await handleApiResponse(response, "Failed to fetch recipes");
  } catch (error) {
    console.error('Error fetching recipes:', error);
    throw error;
  }
}

export async function getRecipeById(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/recipes/${id}`);
    return await handleApiResponse(response, "Recipe not found");
  } catch (error) {
    console.error(`Error fetching recipe with ID ${id}:`, error);
    throw error;
  }
}

export const getRecipeDetails = async (recipeId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/recipes/${recipeId}/details`);
    return await handleApiResponse(response, "Failed to fetch recipe details");
  } catch (error) {
    console.error(`Error fetching recipe details with ID ${recipeId}:`, error);
    throw error;
  }
};

// ✅ Updated toggleFavorite to match backend route: POST /recipes/:id/favorite
export const toggleFavorite = async (userId, recipeId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/recipes/${recipeId}/favorite`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });

    return await handleApiResponse(response, "Failed to update favorite status");
  } catch (error) {
    console.error('Error toggling favorite:', error);
    throw error;
  }
};

export const getUserFavorites = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/favorites/${userId}`);
    return await handleApiResponse(response, "Failed to fetch favorites");
  } catch (error) {
    console.error('Error fetching favorites:', error);
    throw error;
  }
};

export const getFavoriteRecipes = async (userId) => {
  try {
    const favorites = await getUserFavorites(userId);
    
    if (!favorites || !favorites.length) {
      return [];
    }

    const response = await fetch(`${API_BASE_URL}/recipes/batch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ids: favorites.map(fav => fav.recipeId)
      }),
    });

    return await handleApiResponse(response, "Failed to fetch favorite recipes");

    /*
    // Alternative if batch fetching is not supported
    const recipePromises = favorites.map(fav => getRecipeById(fav.recipeId));
    const recipes = await Promise.all(recipePromises);
    return recipes;
    */
  } catch (error) {
    console.error('Error fetching favorite recipes:', error);
    throw error;
  }
};

export default {
  fetchAllRecipes,
  getRecipeById,
  getRecipeDetails,
  toggleFavorite,
  getUserFavorites,
  getFavoriteRecipes,
};
