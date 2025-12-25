// src/components/Landing.jsx
import "./Landing.css";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">

      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-left">
          <h1 className="hero-title">🌾Farmer AI Compliance And Disease Alert System (F-ACDA)</h1>
          <p className="hero-subtitle">
            Farmer AI–Crop Disease Analyzer
          </p>

          <p className="hero-text">
            F-ACDA helps farmers detect crop diseases at an early stage using
            Artificial Intelligence. By simply uploading a crop image, farmers
            receive disease insights, risk levels, and preventive actions —
            all in simple language.
          </p>

          <button className="hero-btn" onClick={() => navigate("/home")}>
            Get Started 🚀
          </button>
        </div>

        <div className="hero-right">
          <h3>Why Farmers Need F-ACDA?</h3>
          <ul>
            <li>✔ Early disease detection saves crops</li>
            <li>✔ Reduces unnecessary pesticide usage</li>
            <li>✔ Weather-aware farming decisions</li>
            <li>✔ Easy to use even for non-technical users</li>
          </ul>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section light">
        <h2 className="section-title">How F-ACDA Works</h2>

        <div className="steps">
          <div className="step-card">
            <h3>📸 Step 1: Upload Crop Image</h3>
            <p>
              The farmer uploads a clear photo of the affected crop leaf.
              This image becomes the primary input for AI analysis.
            </p>
          </div>

          <div className="step-card">
            <h3>🧠 Step 2: AI Disease Analysis</h3>
            <p>
              The system uses Gemini AI to analyze visual patterns such as
              spots, discoloration, or fungal growth to identify possible
              diseases.
            </p>
          </div>

          <div className="step-card">
            <h3>🌦️ Step 3: Weather-Aware Advisory</h3>
            <p>
              Weather data (temperature, humidity, rainfall) is combined
              with AI results to generate realistic and safe recommendations.
            </p>
          </div>
        </div>
      </section>

      {/* WHAT FARMER GETS */}
      <section className="section dark">
        <h2 className="section-title">What the Farmer Receives</h2>

        <div className="info-grid">
          <div className="info-card">
            <h4>🦠 Disease Status</h4>
            <p>
              Identifies whether a disease is detected or not, along with
              possible causes.
            </p>
          </div>

          <div className="info-card">
            <h4>⚠ Risk Level</h4>
            <p>
              Shows Low, Medium, or High risk so farmers can prioritize actions.
            </p>
          </div>

          <div className="info-card">
            <h4>🌱 Actionable Advice</h4>
            <p>
              Provides step-by-step preventive and corrective measures in
              farmer-friendly language.
            </p>
          </div>

          <div className="info-card">
            <h4>🌦️ Weather Alerts</h4>
            <p>
              Warns farmers if weather conditions may worsen the disease.
            </p>
          </div>
        </div>
      </section>

      {/* TECHNOLOGY TRANSPARENCY */}
      <section className="section light">
        <h2 className="section-title">Technology Used</h2>
        <p className="tech-text">
          F-ACDA is built using modern and reliable technologies to ensure
          accuracy and scalability:
        </p>

        <ul className="tech-list">
          <li>✔ React (Frontend)</li>
          <li>✔ Node.js & Express (Backend)</li>
          <li>✔ Gemini AI (Image-based disease analysis)</li>
          <li>✔ Weather API (Climate-aware advisory)</li>
          <li>✔ MongoDB (Data storage)</li>
        </ul>
      </section>

      {/* FINAL CTA */}
      <section className="footer-cta">
        <h2>Start Smart Farming Today</h2>
        <p>
          Upload your crop image and get instant AI-powered disease analysis
          tailored for your farm.
        </p>

        <button className="hero-btn" onClick={() => navigate("/home")}>
          Analyze My Crop 🌿
        </button>
      </section>

    </div>
  );
}
