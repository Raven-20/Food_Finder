import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import "../styles/Pages.css"; // You'll need to create this CSS file

const AboutPage = () => {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <header className="page-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <ArrowLeft />
          <span>Back</span>
        </button>
        <h1>About Food Finder</h1>
      </header>

      <main className="page-content">
        <section className="about-section">
          <h2>Our Mission</h2>
          <p>
            Food Finder was created with a simple goal: to help people reduce food waste
            and discover delicious recipes using ingredients they already have at home.
            We believe that cooking should be accessible, enjoyable, and sustainable.
          </p>
        </section>

        <section className="about-section">
          <h2>How It Works</h2>
          <p>
            Our platform uses intelligent recipe matching to suggest dishes based on
            the ingredients you input. Simply tell us what's in your pantry, fridge,
            or kitchen cupboards, and we'll show you what you can make without an
            extra trip to the grocery store.
          </p>
          <p>
            You can also see recipes that have  dietary preferences like vegetarian,
            vegan, gluten-free, and more, ensuring that everyone can find suitable
            meal options regardless of dietary restrictions.
          </p>
        </section>

        <section className="about-section">
          <h2>Our Story</h2>
          <p>
            Food Finder began in 2025 when I was struggling with the common
            "what's for dinner?" dilemma, realized how much food was wasted because
            people didn't know what to cook with ingredients they already had.
          </p>
          <p>
            After thinking of development and recipe curation, Food Finder launched with
            the mission to help home cooks everywhere make the most of what they have,
            reduce waste, and enjoy delicious, home-cooked meals.
          </p>
        </section>

        <section className="about-section">
          <h2>Our Team</h2>
          <div className="team-members">
            <div className="team-member">
              <div className="team-member-photo" style={{ backgroundColor: "#f0f0f0" }}>SMC</div>
              <h3>Sybil Mae Celestra</h3>
              <p>Founder & Recipe Curator</p>
            </div>
            <div className="team-member">
              <div className="team-member-photo" style={{ backgroundColor: "#f0f0f0" }}>SC</div>
              <h3>Sybil Celestra</h3>
              <p>Head of Technology</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="page-footer">
        <p>© {new Date().getFullYear()} Food Finder. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AboutPage;