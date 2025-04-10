// server/models/Recipe.js
const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: String,  // Changed from imageUrl to image to match the previous format
  matchPercentage: { type: Number, required: true },
  cookingTime: { type: Number, required: true },
  difficulty: { type: String, required: true },
  dietaryTags: [String],
  ingredients: [
    {
      name: { type: String, required: true },
      amount: { type: String, required: true },
      unit: { type: String, required: true }
    }
  ],
  instructions: [
    {
      step: { type: Number, required: true },
      description: { type: String, required: true }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Recipe', recipeSchema);
