import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";  
import RecipeDetail from "./components/RecipeDetail";
import RecipeCard from "./components/RecipeCard";
import SignUp from "./components/SignUp";   
import SignIn from "./components/SignIn";   
import AboutPage from "./components/AboutPage";
import ContactPage from "./components/ContactPage";
import PrivacyPage from "./components/PrivacyPage";
import TermsPage from "./components/TermsPage";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />  {/* Set HomePage as the landing page */}
        <Route path="/recipes/:id" element={<RecipeDetail />} />
        <Route path="/card" element={<RecipeCard />} />  
        <Route path="/signup" element={<SignUp />} /> 
        <Route path="/signin" element={<SignIn />} />  
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
