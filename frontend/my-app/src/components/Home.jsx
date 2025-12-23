import { useState } from "react";
import "./Home.css";
import { analyzeCrop } from "./analyze"; // import the function

function Home() {
  const [result, setResult] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="container">
      <h1>Farmer AI Compliance & Disease Alert Agent (F-ACDA)</h1>
      <p className="subtitle">
        Upload a crop image to get instant disease & compliance guidance
      </p>

      <label>Crop Image</label>
      <div className="file-box">
        <input type="file" accept="image/*" onChange={handleImageChange} />
      </div>

      {/* IMAGE PREVIEW */}
      {preview && (
        <div className="image-preview">
          <img src={preview} alt="Crop Preview" />
        </div>
      )}

      <button onClick={() => analyzeCrop(setResult)}>Analyze Crop</button>

      {result && (
        <div id="result">
          <h3>Disease: {result.disease || "Not detected"}</h3>

          <p>
            Risk Level:{" "}
            <span className={`risk ${result.risk?.toLowerCase() || "unknown"}`}>
              {result.risk || "Unknown"}
            </span>
          </p>

          <ul>
            {result.actions && result.actions.length > 0 ? (
              result.actions.map((action, index) => <li key={index}>{action}</li>)
            ) : (
              <li>No actions suggested</li>
            )}
          </ul>

          <div className="warning">
            ⚠️ {result.warning || "AI analysis unavailable."}
          </div>
        </div>
      )}

      <div className="footer">
        Powered by Gemini • Vertex AI
      </div>
    </div>
  );
}

export default Home;
