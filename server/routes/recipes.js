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
      const ingredientsArray = ingredients
        .split(',')
        .map((ing) => ing.trim().toLowerCase());
    
      recipes = await Recipe.find({
        $and: ingredientsArray.map((ingredient) => ({
          "ingredients.name": {
            $regex: new RegExp(ingredient, "i") // partial, case-insensitive match
          }
        }))
      });
    } else {
      recipes = await Recipe.find();
    }

    // Format the recipes
    const formattedRecipes = recipes.map((recipe) => ({
      id: recipe._id.toString(),
      title: recipe.title || 'Untitled Recipe',
      image: recipe.image || '',
      matchPercentage: recipe.matchPercentage || 90,
      cookingTime: recipe.cookingTime || 30,
      servings: recipe.servings || 4,
    }));

    res.status(200).json(formattedRecipes);
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

// GET a single recipe by ID
router.get('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

    res.status(200).json({
      id: recipe._id.toString(),
      title: recipe.title || 'Untitled Recipe',
      image: recipe.image || '',
      matchPercentage: recipe.matchPercentage || 95,
      cookingTime: recipe.cookingTime || 30,
      servings: recipe.servings || 4,
    });
  } catch (err) {
    console.error(`Error retrieving recipe ${req.params.id}:`, err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Invalid recipe ID format' });
    }
    res.status(500).json({ message: 'Error retrieving recipe' });
  }
});

// ✅ NEW: GET detailed recipe info (for /details route)
router.get('/:id/details', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

    const formattedRecipe = {
      ...recipe.toObject(),
      id: recipe._id.toString(),
      title: recipe.title || 'Untitled Recipe',
      image: recipe.image || '',
      matchPercentage: recipe.matchPercentage || 95,
      cookingTime: recipe.cookingTime || 30,
      servings: recipe.servings || 4,
      dietaryTags: Array.isArray(recipe.dietaryTags) ? recipe.dietaryTags : [],
      description: recipe.description || 'A delicious recipe that\'s sure to please.',
      nutritionInfo: recipe.nutritionInfo || null,

      ingredients: (recipe.ingredients || []).map((ing, index) => {
        if (typeof ing === 'string') {
          const parts = ing.split(/\s+/);
          const hasAmount = !isNaN(parseFloat(parts[0]));
          return {
            id: index,
            name: hasAmount ? parts.slice(2).join(' ') : ing,
            amount: hasAmount ? parts[0] : '',
            unit: hasAmount && parts.length > 1 ? parts[1] : ''
          };
        } else if (ing && typeof ing === 'object') {
          return {
            id: index,
            name: ing.name || ing.ingredient || 'Ingredient',
            amount: ing.amount || ing.quantity || '',
            unit: ing.unit || ing.measure || ''
          };
        }
        return { id: index, name: 'Ingredient', amount: '', unit: '' };
      }),

      instructions: (recipe.instructions || []).map((inst, index) => {
        if (typeof inst === 'string') {
          return { step: index + 1, description: inst };
        } else if (inst && typeof inst === 'object') {
          return {
            step: inst.step || index + 1,
            description: inst.description || inst.text || 'Step description'
          };
        }
        return { step: index + 1, description: 'Step description' };
      })
    };

    console.log('Sending detailed recipe:', JSON.stringify(formattedRecipe, null, 2));
    res.status(200).json(formattedRecipe);
  } catch (err) {
    console.error(`Error retrieving detailed recipe ${req.params.id}:`, err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Invalid recipe ID format' });
    }
    res.status(500).json({ message: 'Error retrieving detailed recipe' });
  }
});

module.exports = router;
