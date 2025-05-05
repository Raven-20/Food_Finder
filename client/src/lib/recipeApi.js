// lib/recipeApi.js

// Define the base URL for your API
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api' // In production, use relative path
  : 'http://localhost:5000/api'; // Use your local backend server

/**
 * Helper function to handle API responses consistently
 */
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

/**
 * Get all recipes
 */
export async function fetchAllRecipes() {
  try {
    const response = await fetch(`${API_BASE_URL}/recipes`);
    return await handleApiResponse(response, "Failed to fetch recipes");
  } catch (error) {
    console.error('Error fetching recipes:', error);
    throw error;
  }
}

/**
 * Get a recipe by its ID
 */
export async function getRecipeById(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/recipes/${id}`);
    return await handleApiResponse(response, "Recipe not found");
  } catch (error) {
    console.error(`Error fetching recipe with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Fetches detailed recipe information from the API
 * @param {string} recipeId - ID of the recipe to fetch
 * @returns {Promise<Object>} - Promise resolving to recipe details
 */
export const getRecipeDetails = async (recipeId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/recipes/${recipeId}/details`);
    return await handleApiResponse(response, "Failed to fetch recipe details");
  } catch (error) {
    console.error(`Error fetching recipe details with ID ${recipeId}:`, error);
    throw error;
  }
};

// Export all functions as a default object as well for convenience
export default {
  fetchAllRecipes,
  getRecipeById,
  getRecipeDetails,
};
