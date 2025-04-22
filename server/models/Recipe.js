const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
  title: String,
  image: String,
  cookingTime: Number,
  servings: Number,
  matchPercentage: Number,
  dietaryTags: [String],
  ingredients: [
    {
      name: String,
      amount: Number,
      unit: String,
    },
  ],
  instructions: [
    {
      step: Number,
      description: String,
    },
  ],
});

module.exports = mongoose.model("Recipe", recipeSchema);
