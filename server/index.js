// server/index.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// ✅ Load environment variables from .env file at the root level
dotenv.config();

// ✅ Verify if the variable is being read correctly
console.log("MONGO_URI:", process.env.MONGO_URI);

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Routes
const recipeRoutes = require('./routes/recipes');
app.use('/api/recipes', recipeRoutes);

// ✅ MongoDB Connection
const mongoURI = process.env.MONGO_URI;

if (mongoURI) {
  mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => {
      console.log('✅ Connected to MongoDB');
      app.listen(PORT, () => {
        console.log(`🚀 Server running at http://localhost:${PORT}`);
      });
    })
    .catch((err) => {
      console.error('❌ MongoDB connection error:', err.message);
    });
} else {
  console.error('❌ MONGO_URI not defined in .env file!');
  process.exit(1);
}
