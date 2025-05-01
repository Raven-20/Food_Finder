const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Recipe = require('../models/Recipe'); // Import Recipe model for validation

// GET user's saved recipes
router.get('/:userId/saved', async (req, res) => {
  const { userId } = req.params;
  
  try {
    // Find the user
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    // Get the saved recipe IDs
    const savedRecipeIds = user.savedRecipes || [];
    
    // Option 1: Just return the IDs
    // res.json(savedRecipeIds);
    
    // Option 2: Return the full recipe objects (more useful for frontend)
    const savedRecipes = await Recipe.find({ _id: { $in: savedRecipeIds } });
    res.json(savedRecipes);
    
  } catch (err) {
    console.error(`Error fetching saved recipes for user ${userId}:`, err);
    res.status(500).json({ error: 'Failed to fetch saved recipes' });
  }
});

// POST to save a recipe to a user's saved list
router.post('/:userId/saved', async (req, res) => {
  const { userId } = req.params;
  const { recipeId } = req.body; // Recipe ID to save
  
  if (!recipeId) {
    return res.status(400).json({ message: 'Recipe ID is required' });
  }
  
  try {
    // Find the user
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    // Validate that the recipe exists
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    
    // Check if the recipe is already saved
    if (user.savedRecipes && user.savedRecipes.includes(recipeId)) {
      return res.status(400).json({ message: 'Recipe already saved' });
    }
    
    // Initialize savedRecipes array if it doesn't exist
    if (!user.savedRecipes) {
      user.savedRecipes = [];
    }
    
    // Save the recipe
    user.savedRecipes.push(recipeId);
    await user.save();
    
    res.status(201).json({ message: 'Recipe saved successfully', savedRecipes: user.savedRecipes });
  } catch (err) {
    console.error(`Error saving recipe for user ${userId}:`, err);
    
    // Handle case where ID format is invalid
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    
    res.status(500).json({ error: 'Failed to save recipe' });
  }
});

// DELETE to unsave a recipe from a user's saved list
router.delete('/:userId/saved', async (req, res) => {
  const { userId } = req.params;
  const { recipeId } = req.body; // Recipe ID to unsave
  
  if (!recipeId) {
    return res.status(400).json({ message: 'Recipe ID is required' });
  }
  
  try {
    // Find the user
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    // Check if user has any saved recipes
    if (!user.savedRecipes || user.savedRecipes.length === 0) {
      return res.status(400).json({ message: 'No saved recipes to remove' });
    }
    
    // Check if the recipe is in the saved list
    if (!user.savedRecipes.includes(recipeId)) {
      return res.status(400).json({ message: 'Recipe not in saved list' });
    }
    
    // Remove the recipe from saved recipes
    user.savedRecipes = user.savedRecipes.filter(id => id.toString() !== recipeId);
    await user.save();
    
    res.status(200).json({ message: 'Recipe unsaved successfully', savedRecipes: user.savedRecipes });
  } catch (err) {
    console.error(`Error unsaving recipe for user ${userId}:`, err);
    
    // Handle case where ID format is invalid
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    
    res.status(500).json({ error: 'Failed to unsave recipe' });
  }
});

module.exports = router;