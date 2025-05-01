const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');

// Debug middleware: Logs each request method and path
router.use((req, res, next) => {
  console.log(`[${req.method}] ${req.originalUrl}`);
  next();
});

// GET all recipes
router.get('/', async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.status(200).json(recipes);
  } catch (err) {
    console.error('Error fetching all recipes:', err);
    res.status(500).json({ message: 'Error fetching recipes' });
  }
});

// POST /search - MUST be above /:id
router.post('/search', async (req, res) => {
  try {
    const { ingredients = [], dietaryFilters = [], sortBy = 'match' } = req.body;

    if (!Array.isArray(ingredients)) {
      return res.status(400).json({ message: 'Ingredients must be an array' });
    }
    if (!Array.isArray(dietaryFilters)) {
      return res.status(400).json({ message: 'Dietary filters must be an array' });
    }

    // Build query
    let query = {};

    if (ingredients.length > 0) {
      query['ingredients.name'] = {
        $in: ingredients.map(i => new RegExp(i, 'i')) // Case-insensitive
      };
    }

    if (dietaryFilters.length > 0) {
      query.dietaryTags = { $in: dietaryFilters };
    }

    let recipes = await Recipe.find(query);

    // Compute match data
    recipes = recipes.map(recipe => {
      const recipeObj = recipe.toObject();

      const recipeIngredientsLower = recipeObj.ingredients.map(ing =>
        ing.name.toLowerCase()
      );

      const matchingIngredients = ingredients.filter(searchIng =>
        recipeIngredientsLower.some(recipeIng =>
          recipeIng.includes(searchIng.toLowerCase()) ||
          searchIng.toLowerCase().includes(recipeIng)
        )
      );

      const matchPercentage = recipeObj.ingredients.length === 0
        ? 0
        : Math.round((matchingIngredients.length / recipeObj.ingredients.length) * 100);

      const missingIngredients = recipeObj.ingredients
        .filter(ingredient =>
          !ingredients.some(searchIng =>
            ingredient.name.toLowerCase().includes(searchIng.toLowerCase()) ||
            searchIng.toLowerCase().includes(ingredient.name.toLowerCase())
          )
        )
        .map(ingredient => ingredient.name);

      return {
        ...recipeObj,
        matchPercentage,
        matchingIngredientsCount: matchingIngredients.length,
        missingIngredientsCount: missingIngredients.length,
        missingIngredients
      };
    });

    // Sort
    switch (sortBy) {
      case 'match':
        recipes.sort((a, b) => b.matchPercentage - a.matchPercentage);
        break;
      case 'missing':
        recipes.sort((a, b) => a.missingIngredientsCount - b.missingIngredientsCount);
        break;
      case 'name':
        recipes.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        return res.status(400).json({ message: 'Invalid sortBy value' });
    }

    res.status(200).json({ recipes });
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ message: 'Error searching recipes' });
  }
});

// POST a new recipe
router.post('/', async (req, res) => {
  try {
    const recipe = new Recipe(req.body);
    await recipe.save();
    res.status(201).json(recipe);
  } catch (err) {
    console.error('Error creating recipe:', err);
    res.status(400).json({ error: err.message });
  }
});

// GET a single recipe by ID
router.get('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    res.status(200).json(recipe);
  } catch (err) {
    console.error(`Error retrieving recipe ${req.params.id}:`, err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Invalid recipe ID format' });
    }
    res.status(500).json({ message: 'Error retrieving recipe' });
  }
});

module.exports = router;
