const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
  id: String, // added to match the sample
  title: String,
  image: String,
  matchPercentage: Number,
  cookingTime: Number,
  difficulty: String, // added to match the sample
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

module.exports = mongoose.models.Recipe || mongoose.model("Recipe", recipeSchema);
            