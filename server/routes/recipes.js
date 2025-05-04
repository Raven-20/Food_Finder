const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');

// Debug middleware: Logs each request method and path
router.use((req, res, next) => {
  console.log(`[${req.method}] ${req.originalUrl}`);
  if (req.method === 'POST') {
    console.log('Request body:', JSON.stringify(req.body));
  }
  next();
});

// GET all recipes or filter by ingredients
router.get('/', async (req, res) => {
  try {
    const { ingredients } = req.query;

    let recipes;

    if (ingredients) {
      // Split the ingredients string by commas, trim whitespace, and convert to lowercase
      const ingredientsArray = ingredients
        .split(',')
        .map((ing) => ing.trim().toLowerCase());

      // Find recipes where the ingredients field contains all the specified ingredients
      recipes = await Recipe.find({
        ingredients: {
          $all: ingredientsArray, // Match all specified ingredients
        },
      });
    } else {
      recipes = await Recipe.find(); // Return all recipes if no ingredients query is provided
    }

    // Return the filtered recipes
    res.status(200).json(recipes);
  } catch (err) {
    console.error('Error fetching recipes:', err);
    res.status(500).json({ message: 'Error fetching recipes' });
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

// GET a single recipe by ID - ENHANCED with complete recipe details
router.get('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    
    // Ensure ingredients are in the expected format for the frontend
    // This will depend on your MongoDB schema, but we need to make sure it matches
    // what the frontend expects (array of objects with name, amount, unit)
    const formattedRecipe = {
      ...recipe.toObject(),
      ingredients: recipe.ingredients?.map(ing => {
        // If ingredients are already in the correct format, return as is
        if (ing && typeof ing === 'object' && ing.name) {
          return ing;
        }
        // Otherwise, try to format them correctly
        // This assumes ingredient might be a string like "1 cup flour"
        // You may need to adjust this based on your actual data structure
        const parts = typeof ing === 'string' ? ing.split(' ') : [];
        return {
          name: parts.length > 2 ? parts.slice(2).join(' ') : ing,
          amount: parts[0] || '',
          unit: parts[1] || ''
        };
      }) || [],
      
      // Ensure instructions are in the expected format for the frontend
      // (array of objects with step number and description)
      instructions: recipe.instructions?.map((inst, index) => {
        // If instructions are already in the correct format, return as is
        if (inst && typeof inst === 'object' && inst.step) {
          return inst;
        }
        // Otherwise, format them correctly
        return {
          step: index + 1,
          description: inst || ''
        };
      }) || []
    };
    
    console.log('Sending formatted recipe:', JSON.stringify(formattedRecipe, null, 2));
    res.status(200).json(formattedRecipe);
  } catch (err) {
    console.error(`Error retrieving recipe ${req.params.id}:`, err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Invalid recipe ID format' });
    }
    res.status(500).json({ message: 'Error retrieving recipe' });
  }
});

module.exports = router;