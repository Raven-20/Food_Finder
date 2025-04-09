import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";  // Make sure this path is correct
import RecipeDetail from "./components/RecipeDetail";
import RecipeCard from "./components/RecipeCard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />  {/* Set HomePage as the landing page */}
        <Route path="/recipe/:id" element={<RecipeDetail />} />
        <Route path="/card" element={<RecipeCard />} />  
      </Routes>
    </Router>
  );
}

export default App;
