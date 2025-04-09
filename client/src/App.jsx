import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";  
import RecipeDetail from "./components/RecipeDetail";
import RecipeCard from "./components/RecipeCard";
import SignUp from "./components/SignUp";   
import SignIn from "./components/SignIn";   


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />  {/* Set HomePage as the landing page */}
        <Route path="/recipe/:id" element={<RecipeDetail />} />
        <Route path="/card" element={<RecipeCard />} />  
        <Route path="/signup" element={<SignUp />} />  {/* ✅ Sign Up page route */}
        <Route path="/signin" element={<SignIn />} />  {/* ✅ Sign In page route */}
      </Routes>
    </Router>
  );
}

export default App;
