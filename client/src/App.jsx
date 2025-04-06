import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RecipeDetail from "./components/RecipeDetail";
import RecipeCard from "./components/RecipeCard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RecipeCard />} />
        <Route path="/recipe/:id" element={<RecipeDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
