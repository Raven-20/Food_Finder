const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
  id: { type: String }, // Optional: consider using mongoose default _id unless this serves a specific purpose
  title: { type: String, required: true },
  image: { type: String },
  matchPercentage: { type: Number },
  cookingTime: { type: Number },
  difficulty: { type: String },
  dietaryTags: [{ type: String }],
  ingredients: [
    {
      name: { type: String, required: true },
      amount: { type: Number, required: true },
      unit: { type: String },
    },
  ],
  instructions: [
    {
      step: { type: Number, required: true },
      description: { type: String, required: true },
    },
  ],
});

module.exports = mongoose.models.Recipe || mongoose.model("Recipe", recipeSchema);
