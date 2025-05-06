const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const recipeRoutes = require('./routes/recipes');
const userRoutes = require('./routes/users');
const favoriteRoutes = require('./routes/favorites'); // ✅ Updated favorites route

const app = express();
const PORT = process.env.PORT || 5000;

// Import models
const Recipe = require('./models/Recipe');
const User = require('./models/User');

// Middleware
app.use(cors());
app.use(bodyParser.json()); // Legacy compatibility
app.use(express.json());    // Preferred modern usage

// Mount API routes
app.use('/api', userRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api', favoriteRoutes); // ✅ /api/recipes/:id/favorite and /api/favorites/:userId

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/foodfinder", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// Set models for potential access in route files
app.set('models', {
  User,
  Recipe
});

// API root for testing
app.get("/api", (req, res) => {
  res.json({ message: "Food Finder API is running" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
