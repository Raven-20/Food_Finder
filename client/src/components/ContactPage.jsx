import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Phone, MapPin, Send } from "lucide-react";
import "../styles/Pages.css"; // You'll need to create this CSS file

const ContactPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you'd send this data to your backend
    console.log("Form data submitted:", formData);
    setIsSubmitted(true);
    // Reset form after "submission"
    setTimeout(() => {
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
      setIsSubmitted(false);
    }, 3000);
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <ArrowLeft />
          <span>Back</span>
        </button>
        <h1>Contact Us</h1>
      </header>

      <main className="page-content">
        <section className="contact-info">
          <h2>Get In Touch</h2>
          <p>
            Have questions, suggestions, or feedback? We'd love to hear from you!
            Use the form below or reach out directly through any of our channels.
          </p>

          <div className="contact-methods">
            <div className="contact-method">
              <Mail size={24} />
              <div>
                <h3>Email</h3>
                <p>support@foodfinder.example</p>
              </div>
            </div>
            
            <div className="contact-method">
              <Phone size={24} />
              <div>
                <h3>Phone</h3>
                <p>(555) 123-4567</p>
              </div>
            </div>
            
            <div className="contact-method">
              <MapPin size={24} />
              <div>
                <h3>Address</h3>
                <p>123 Culinary Ave, Suite 101<br />Foodie City, FC 98765</p>
              </div>
            </div>
          </div>
        </section>

        <section className="contact-form-section">
          <h2>Send Us a Message</h2>
          {isSubmitted ? (
            <div className="form-success">
              <h3>Thank you for your message!</h3>
              <p>We'll get back to you as soon as possible.</p>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
              
              <button type="submit" className="submit-button">
                <Send size={16} />
                Send Message
              </button>
            </form>
          )}
        </section>
      </main>

      <footer className="page-footer">
        <p>© {new Date().getFullYear()} Food Finder. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default ContactPage;