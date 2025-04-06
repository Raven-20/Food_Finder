// server/routes/recipes.js
const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');

// GET all recipes
router.get('/', async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST a new recipe (for testing)
router.post('/', async (req, res) => {
  try {
    const recipe = new Recipe(req.body);
    await recipe.save();
    res.status(201).json(recipe);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
