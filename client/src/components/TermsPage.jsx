import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import "../styles/Pages.css"; // You'll need to create this CSS file

const TermsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <header className="page-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <ArrowLeft />
          <span>Back</span>
        </button>
        <h1>Terms of Service</h1>
      </header>

      <main className="page-content policy-content">
        <p className="last-updated">Last Updated: April 15, 2025</p>
        
        <section className="policy-section">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing or using Food Finder services, including our website, you agree to be bound by these 
            Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, 
            you are prohibited from using or accessing this site.
          </p>
        </section>

        <section className="policy-section">
          <h2>2. Use License</h2>
          <p>
            Permission is granted to temporarily access the materials on Food Finder's website for personal, 
            non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and 
            under this license you may not:
          </p>
          <ul>
            <li>Modify or copy the materials</li>
            <li>Use the materials for any commercial purpose</li>
            <li>Attempt to decompile or reverse engineer any software contained on the site</li>
            <li>Remove any copyright or other proprietary notations from the materials</li>
            <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
          </ul>
          <p>
            This license shall automatically terminate if you violate any of these restrictions and may be 
            terminated by Food Finder at any time.
          </p>
        </section>

        <section className="policy-section">
          <h2>3. User Accounts</h2>
          <p>
            When you create an account with us, you must provide accurate, complete, and up-to-date information. 
            You are responsible for safeguarding the password that you use to access the service and for any 
            activities or actions under your password.
          </p>
          <p>
            You agree not to disclose your password to any third party. You must notify us immediately upon 
            becoming aware of any breach of security or unauthorized use of your account.
          </p>
        </section>

        <section className="policy-section">
          <h2>4. User Content</h2>
          <p>
            Our service may allow you to post, link, store, share, or otherwise make available certain 
            information, text, graphics, videos, or other material. You are responsible for the content you 
            post and its legality.
          </p>
          <p>
            By posting content, you grant Food Finder a non-exclusive, royalty-free, transferable, sublicensable, 
            worldwide license to use, display, reproduce, and distribute your content in connection with our service.
          </p>
        </section>

        <section className="policy-section">
          <h2>5. Accuracy of Materials</h2>
          <p>
            The materials appearing on Food Finder's website could include technical, typographical, or 
            photographic errors. Food Finder does not warrant that any of the materials on its website are 
            accurate, complete, or current. Food Finder may make changes to the materials contained on its 
            website at any time without notice.
          </p>
        </section>

        <section className="policy-section">
          <h2>6. Links</h2>
          <p>
            Food Finder has not reviewed all of the sites linked to its website and is not responsible for the 
            contents of any such linked site. The inclusion of any link does not imply endorsement by Food Finder 
            of the site. Use of any such linked website is at the user's own risk.
          </p>
        </section>

        <section className="policy-section">
          <h2>7. Disclaimer</h2>
          <p>
            The materials on Food Finder's website are provided on an 'as is' basis. Food Finder makes no 
            warranties, expressed or implied, and hereby disclaims and negates all other warranties including, 
            without limitation, implied warranties or conditions of merchantability, fitness for a particular 
            purpose, or non-infringement of intellectual property or other violation of rights.
          </p>
        </section>

        <section className="policy-section">
          <h2>8. Limitations</h2>
          <p>
            In no event shall Food Finder or its suppliers be liable for any damages (including, without 
            limitation, damages for loss of data or profit, or due to business interruption) arising out of the 
            use or inability to use the materials on Food Finder's website, even if Food Finder or a Food Finder 
            authorized representative has been notified orally or in writing of the possibility of such damage.
          </p>
        </section>

        <section className="policy-section">
          <h2>9. Governing Law</h2>
          <p>
            These terms and conditions are governed by and construed in accordance with the laws of the United States, 
            and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
          </p>
        </section>

        <section className="policy-section">
          <h2>10. Changes to Terms</h2>
          <p>
            Food Finder reserves the right, at its sole discretion, to modify or replace these Terms at any time. 
            What constitutes a material change will be determined at our sole discretion. By continuing to access 
            or use our service after those revisions become effective, you agree to be bound by the revised terms.
          </p>
        </section>

        <section className="policy-section">
          <h2>11. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at:
          </p>
          <p>
            Email: sybilcelestra@gmail.com<br />
            Phone: 09686500761<br />
            Address: Unit 3 Oprra, Foodie City
          </p>
        </section>
      </main>

      <footer className="page-footer">
        <p>© {new Date().getFullYear()} Food Finder. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default TermsPage;