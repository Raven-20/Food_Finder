const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Recipe = require('../models/Recipe');

// ✅ POST /api/recipes/:id/favorite - Toggle favorite status for a recipe
router.post('/recipes/:id/favorite', async (req, res) => {
  try {
    const { userId } = req.body;
    const { id: recipeId } = req.params;

    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required field: userId' 
      });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Check if recipe exists
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ 
        success: false, 
        message: 'Recipe not found' 
      });
    }

    // Toggle favorite
    const index = user.favorites.indexOf(recipeId);
    let isFavorite;

    if (index === -1) {
      user.favorites.push(recipeId);
      isFavorite = true;
    } else {
      user.favorites.splice(index, 1);
      isFavorite = false;
    }

    await user.save();

    return res.status(200).json({ 
      success: true,
      isFavorite,
      message: isFavorite ? 'Recipe added to favorites' : 'Recipe removed from favorites'
    });

  } catch (error) {
    console.error('Error toggling favorite:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to update favorite status',
      error: error.message
    });
  }
});

// ✅ GET /api/favorites/:userId - Get all favorites for a user
router.get('/favorites/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).populate('favorites');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.status(200).json({
      success: true,
      favorites: user.favorites,
    });

  } catch (error) {
    console.error('Error fetching favorites:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch favorites',
      error: error.message,
    });
  }
});

// ✅ DELETE /api/favorites/:userId/:recipeId - Explicitly remove a recipe from favorites
router.delete('/favorites/:userId/:recipeId', async (req, res) => {
  try {
    const { userId, recipeId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const index = user.favorites.indexOf(recipeId);
    if (index === -1) {
      return res.status(400).json({
        success: false,
        message: 'Recipe is not in favorites',
      });
    }

    user.favorites.splice(index, 1);
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Recipe removed from favorites',
    });

  } catch (error) {
    console.error('Error removing favorite:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to remove favorite',
      error: error.message,
    });
  }
});

module.exports = router;
