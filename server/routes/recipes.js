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

// GET a specific recipe by ID
router.get('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ error: 'Recipe not found' });
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ error: 'Error retrieving recipe' });
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

// Get recipes based on ingredients and dietary filters
router.get('/search', async (req, res) => {
  const { ingredients, dietaryFilters } = req.query;

  try {
    // Convert the ingredients query parameter into an array
    const ingredientsArray = ingredients.split(',');

    // Build the query for ingredients and dietary filters
    let query = {
      ingredients: { $in: ingredientsArray },  // Match any recipe that contains the given ingredients
    };

    // If dietary filters are provided, add them to the query
    if (dietaryFilters) {
      const dietaryTags = dietaryFilters.split(',');
      query.dietaryTags = { $in: dietaryTags };  // Match recipes with any of the selected dietary tags
    }

    // Fetch recipes based on the constructed query
    const recipes = await Recipe.find(query);
    if (recipes.length === 0) {
      return res.status(404).json({ error: 'No recipes found with the given ingredients and filters' });
    }

    res.json(recipes);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching recipes' });
  }
});

module.exports = router;
