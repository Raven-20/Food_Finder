// server/models/Recipe.js
const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  ingredients: [String],
  steps: [String],
  imageUrl: String,
  tags: [String]
}, { timestamps: true });

module.exports = mongoose.model('Recipe', recipeSchema);
