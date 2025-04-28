import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import "../styles/Pages.css"; // You'll need to create this CSS file

const PrivacyPage = () => {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <header className="page-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <ArrowLeft />
          <span>Back</span>
        </button>
        <h1>Privacy Policy</h1>
      </header>

      <main className="page-content policy-content">
        <p className="last-updated">Last Updated: April 15, 2025</p>
        
        <section className="policy-section">
          <h2>1. Introduction</h2>
          <p>
            Welcome to Food Finder. We are committed to protecting your personal information
            and your right to privacy. This Privacy Policy explains how we collect, use, and
            share information about you when you use our website and services.
          </p>
          <p>
            Please read this Privacy Policy carefully. If you do not agree with our policies
            and practices, you may choose not to use our service. By accessing or using Food Finder,
            you agree to this Privacy Policy.
          </p>
        </section>

        <section className="policy-section">
          <h2>2. Information We Collect</h2>
          <h3>2.1 Personal Information</h3>
          <p>
            When you register for an account, we collect:
          </p>
          <ul>
            <li>Your name</li>
            <li>Email address</li>
            <li>Password (stored in encrypted form)</li>
            <li>Dietary preferences (if provided)</li>
          </ul>

          <h3>2.2 Usage Information</h3>
          <p>
            We automatically collect certain information when you visit, use, or navigate our site:
          </p>
          <ul>
            <li>Device information (browser type, IP address, device type)</li>
            <li>Log data (pages visited, time spent on pages)</li>
            <li>Ingredients searched</li>
            <li>Recipes viewed or saved</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>3. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide and maintain our service</li>
            <li>Personalize your experience</li>
            <li>Improve our website and features</li>
            <li>Communicate with you about updates or changes</li>
            <li>Analyze usage patterns to enhance functionality</li>
            <li>Protect against unauthorized access or legal liability</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>4. How We Share Your Information</h2>
          <p>
            We do not sell or rent your personal information to third parties. We may share 
            information in the following circumstances:
          </p>
          <ul>
            <li>With service providers who help us operate our business</li>
            <li>To comply with legal obligations</li>
            <li>To protect our rights, privacy, safety, or property</li>
            <li>In connection with a business transfer (merger, acquisition, etc.)</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>5. Your Rights</h2>
          <p>
            Depending on where you reside, you may have various rights regarding your personal information:
          </p>
          <ul>
            <li>Access and receive a copy of your data</li>
            <li>Rectify or update your information</li>
            <li>Request deletion of your personal data</li>
            <li>Object to or restrict processing of your data</li>
            <li>Data portability</li>
          </ul>
          <p>
            To exercise these rights, please contact us at privacy@foodfinder.example.
          </p>
        </section>

        <section className="policy-section">
          <h2>6. Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your
            personal information. However, no method of transmission over the Internet or 
            electronic storage is 100% secure, so we cannot guarantee absolute security.
          </p>
        </section>

        <section className="policy-section">
          <h2>7. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any
            changes by posting the new Privacy Policy on this page and updating the "Last Updated"
            date. We encourage you to review this Privacy Policy periodically.
          </p>
        </section>

        <section className="policy-section">
          <h2>8. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at:
          </p>
          <p>
            Email: privacy@foodfinder.example<br />
            Phone: (555) 123-4567<br />
            Address: 123 Culinary Ave, Suite 101, Foodie City, FC 98765
          </p>
        </section>
      </main>

      <footer className="page-footer">
        <p>© {new Date().getFullYear()} Food Finder. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default PrivacyPage;