const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const recipeRoutes = require('./routes/recipes');
const userRoutes = require('./routes/users');
const app = express();
const PORT = process.env.PORT || 5000;

// Import models
const Recipe = require('./models/Recipe');
const User = require('./models/User');

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json()); // Modern replacement for bodyParser.json()

// Mount routes WITH /api prefix
app.use('/api', userRoutes);
app.use('/api/recipes', recipeRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/foodfinder", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB connection error:", err));

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
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});