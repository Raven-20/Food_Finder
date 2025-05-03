// lib/recipeApi.js

// Define the base URL for your API
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api' // In production, use relative path
  : 'http://localhost:5000/api'; // Using your existing port (5000)

/**
 * Helper function to handle API responses consistently
 */
async function handleApiResponse(response, errorMessage) {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: errorMessage }));
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
 * Get user's saved recipes
 */
export async function getUserSavedRecipes(userId) {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/saved`);
    return await handleApiResponse(response, "Failed to load saved recipes");
  } catch (error) {
    console.error(`Error fetching saved recipes for user ${userId}:`, error);
    throw error;
  }
}

/**
 * Save a recipe for a user
 */
export async function saveRecipe(userId, recipeId) {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/saved`, {
      method: "POST",
      body: JSON.stringify({ recipeId }),
      headers: { "Content-Type": "application/json" },
    });
    return await handleApiResponse(response, "Failed to save recipe");
  } catch (error) {
    console.error(`Error saving recipe ${recipeId} for user ${userId}:`, error);
    throw error;
  }
}

/**
 * Remove a saved recipe for a user
 */
export async function unsaveRecipe(userId, recipeId) {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/saved`, {
      method: "DELETE",
      body: JSON.stringify({ recipeId }),
      headers: { "Content-Type": "application/json" },
    });
    return await handleApiResponse(response, "Failed to unsave recipe");
  } catch (error) {
    console.error(`Error removing saved recipe ${recipeId} for user ${userId}:`, error);
    throw error;
  }
}

// Export all functions as a default object as well for convenience
export default {
  fetchAllRecipes,
  getRecipeById,
  getUserSavedRecipes,
  saveRecipe,
  unsaveRecipe,
};