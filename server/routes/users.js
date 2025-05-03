const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Recipe = require('../models/Recipe'); // Import Recipe model for validation
const jwt = require('jsonwebtoken'); // For token generation
const bcrypt = require('bcrypt'); // For password checking

const JWT_SECRET = 'yourSecretKey'; // Ideally, use environment variables

// Sign in route
router.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });

    // Return both token and userId
    res.json({ token, userId: user._id });
  } catch (err) {
    console.error('Error during sign-in:', err);
    res.status(500).json({ message: 'Server error during sign-in' });
  }
});

// Sign up route
router.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the user
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    // Create JWT token
    const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn: '1h' });

    // Respond with token and userId
    res.status(201).json({ token, userId: newUser._id });

  } catch (err) {
    console.error('Error during sign-up:', err);
    res.status(500).json({ message: 'Server error during sign-up' });
  }
});


// ------------------- GET USER'S SAVED RECIPES -------------------
router.get('/:userId/saved', async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const savedRecipeIds = user.savedRecipes || [];
    const savedRecipes = await Recipe.find({ _id: { $in: savedRecipeIds } });

    res.json(savedRecipes);
  } catch (err) {
    console.error(`Error fetching saved recipes for user ${userId}:`, err);
    res.status(500).json({ error: 'Failed to fetch saved recipes' });
  }
});

// ------------------- SAVE A RECIPE -------------------
router.post('/:userId/saved', async (req, res) => {
  const { userId } = req.params;
  const { recipeId } = req.body;

  if (!recipeId) {
    return res.status(400).json({ message: 'Recipe ID is required' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const recipe = await Recipe.findById(recipeId);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

    if (user.savedRecipes && user.savedRecipes.includes(recipeId)) {
      return res.status(400).json({ message: 'Recipe already saved' });
    }

    if (!user.savedRecipes) user.savedRecipes = [];

    user.savedRecipes.push(recipeId);
    await user.save();

    res.status(201).json({ message: 'Recipe saved successfully', savedRecipes: user.savedRecipes });
  } catch (err) {
    console.error(`Error saving recipe for user ${userId}:`, err);
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    res.status(500).json({ error: 'Failed to save recipe' });
  }
});

// ------------------- UNSAVE A RECIPE -------------------
router.delete('/:userId/saved', async (req, res) => {
  const { userId } = req.params;
  const { recipeId } = req.body;

  if (!recipeId) {
    return res.status(400).json({ message: 'Recipe ID is required' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!user.savedRecipes || user.savedRecipes.length === 0) {
      return res.status(400).json({ message: 'No saved recipes to remove' });
    }

    if (!user.savedRecipes.includes(recipeId)) {
      return res.status(400).json({ message: 'Recipe not in saved list' });
    }

    user.savedRecipes = user.savedRecipes.filter(id => id.toString() !== recipeId);
    await user.save();

    res.status(200).json({ message: 'Recipe unsaved successfully', savedRecipes: user.savedRecipes });
  } catch (err) {
    console.error(`Error unsaving recipe for user ${userId}:`, err);
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    res.status(500).json({ error: 'Failed to unsave recipe' });
  }
});

module.exports = router;
