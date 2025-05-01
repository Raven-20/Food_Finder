const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const recipeRoutes = require('./routes/recipes'); // ✅ correct path
const userRoutes = require('./routes/users');
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json()); // Modern replacement for bodyParser.json()

// Routes
app.use('/api/recipes', recipeRoutes); // ✅ this makes /api/recipes/search work
app.use('/api/users', userRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/foodfinder", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB connection error:", err));

// ===== MODELS =====

// User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  savedRecipes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }]
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

// Recipe Schema
const recipeSchema = new mongoose.Schema({
  title: String,
  image: String,
  matchPercentage: Number,
  cookingTime: Number,
  servings: Number,
  ingredients: [{ name: String, amount: String, unit: String }],
  instructions: [{ step: Number, description: String }],
  dietaryTags: [String]
});

const Recipe = mongoose.models.Recipe || mongoose.model("Recipe", recipeSchema);

// Make models available to route files
app.set('models', {
  User,
  Recipe
});

// Root API route for health check
app.get("/api", (req, res) => {
  res.json({ message: "Food Finder API is running" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Server listening on a port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
