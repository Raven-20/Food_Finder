const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect("mongodb://localhost:27017/foodfinder", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const User = mongoose.model("User", userSchema);

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

const Recipe = mongoose.model("Recipe", recipeSchema);

// Saved Recipe Schema - tracks saved recipes for each user
const savedRecipeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  recipeId: { type: mongoose.Schema.Types.ObjectId, ref: "Recipe", required: true },
});

const SavedRecipe = mongoose.model("SavedRecipe", savedRecipeSchema);

// SignUp Route
app.post("/api/signup", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// SignIn Route
app.post("/api/signin", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Create a JWT token
    const token = jwt.sign({ userId: user._id }, "your_jwt_secret", { expiresIn: "1h" });

    res.status(200).json({ message: "Signed in successfully", token });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get Recipe by ID
app.get("/api/recipe/:id", async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });
    res.status(200).json(recipe);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving recipe" });
  }
});

// Get All Recipes
app.get("/api/recipes", async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.status(200).json(recipes);
  } catch (err) {
    res.status(500).json({ message: "Error fetching recipes" });
  }
});

// Get Recipe by ID
app.get("/api/recipes/:id", async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });
    res.status(200).json(recipe);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving recipe" });
  }
});

// Get Saved Recipes for a User
app.get("/api/users/:userId/saved-recipes", async (req, res) => {
  const { userId } = req.params;

  try {
    const savedRecipes = await SavedRecipe.find({ userId })
      .populate("recipeId")
      .select("recipeId");

    res.status(200).json(savedRecipes.map(saved => saved.recipeId));
  } catch (err) {
    res.status(500).json({ message: "Error retrieving saved recipes" });
  }
});

// Save Recipe to User's Saved Recipes
app.post("/api/users/:userId/save-recipe", async (req, res) => {
  const { userId } = req.params;
  const { recipeId } = req.body;

  try {
    // Check if the recipe is already saved
    const existingSavedRecipe = await SavedRecipe.findOne({ userId, recipeId });
    if (existingSavedRecipe) return res.status(400).json({ message: "Recipe already saved" });

    // Save the recipe
    const savedRecipe = new SavedRecipe({ userId, recipeId });
    await savedRecipe.save();

    res.status(201).json({ message: "Recipe saved successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error saving recipe" });
  }
});

// Remove Recipe from User's Saved Recipes
app.delete("/api/users/:userId/remove-saved-recipe", async (req, res) => {
  const { userId } = req.params;
  const { recipeId } = req.body;

  try {
    const removedRecipe = await SavedRecipe.findOneAndDelete({ userId, recipeId });
    if (!removedRecipe) return res.status(404).json({ message: "Saved recipe not found" });

    res.status(200).json({ message: "Recipe removed from saved list" });
  } catch (err) {
    res.status(500).json({ message: "Error removing saved recipe" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
