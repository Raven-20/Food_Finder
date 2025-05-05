import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Tailwind utility helper
 * Combines conditional classes using `clsx` and merges them using `tailwind-merge`
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Standardized fetch wrapper for API calls
 * Handles content-type headers, JSON parsing, and error checking
 *
 * @param {string} url - API endpoint
 * @param {Object} options - fetch options
 * @returns {Promise<any>}
 */
export const fetchApi = async (url, options = {}) => {
  try {
    const method = options.method?.toUpperCase();

    if (["POST", "PUT", "PATCH"].includes(method)) {
      options.headers = {
        "Content-Type": "application/json",
        ...options.headers,
      };

      if (options.body && typeof options.body !== "string") {
        options.body = JSON.stringify(options.body);
      }
    }

    const response = await fetch(url, options);

    if (response.status === 204) return null;

    const contentType = response.headers.get("content-type");

    if (contentType?.includes("application/json")) {
      const data = await response.json();
      if (!response.ok) {
        const error = new Error(data.message || "API request failed");
        error.status = response.status;
        error.data = data;
        throw error;
      }
      return data;
    } else {
      if (!response.ok) {
        throw new Error(`API request failed with status: ${response.status}`);
      }
      return await response.text();
    }
  } catch (error) {
    if (error.status) throw error;
    console.error("API request failed:", error);
    throw new Error("Network error or invalid JSON response");
  }
};

/**
 * Safe JSON parsing
 */
export const safeJsonParse = (str, fallback = null) => {
  try {
    return JSON.parse(str);
  } catch (error) {
    console.error("JSON parse error:", error);
    return fallback;
  }
};

/**
 * Safe JSON stringify
 */
export const safeJsonStringify = (value, fallback = "{}") => {
  try {
    return JSON.stringify(value);
  } catch (error) {
    console.error("JSON stringify error:", error);
    return fallback;
  }
};

/**
 * =======================
 * API Endpoints
 * =======================
 */

/**
 * Get full recipe details
 * Used in: RecipeDetail.jsx
 */
export const getRecipe = async (id) => {
  return fetchApi(`/api/recipes/${id}`);
};

/**
 * Check if a recipe is favorited by the user
 * Used in: RecipeDetail.jsx
 */
export const checkFavoriteStatus = async (userId, recipeId) => {
  return fetchApi(`/api/users/${userId}/favorites?recipeId=${recipeId}`);
};

/**
 * Check if a recipe is saved by the user
 * Used in: RecipeDetail.jsx
 */
export const checkSavedStatus = async (userId, recipeId) => {
  return fetchApi(`/api/users/${userId}/saved?recipeId=${recipeId}`);
};

/**
 * Toggle recipe favorite status
 * Used in: RecipeDetail.jsx
 */
export const toggleFavoriteStatus = async (userId, recipeId, isFavorite) => {
  const method = isFavorite ? "DELETE" : "POST";
  return fetchApi(`/api/users/${userId}/favorites`, {
    method,
    body: { recipeId },
  });
};

/**
 * Toggle recipe saved status
 * Used in: RecipeDetail.jsx
 */
export const toggleSavedStatus = async (userId, recipeId, isSaved) => {
  const method = isSaved ? "DELETE" : "POST";
  return fetchApi(`/api/users/${userId}/saved`, {
    method,
    body: { recipeId },
  });
};
