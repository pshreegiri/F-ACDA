import { useState } from "react";
import "./Home.css";
import { analyzeCrop } from "./analyze";

function Home() {
  const [result, setResult] = useState(null);
  const [englishResult, setEnglishResult] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState("en");
  const [isTranslating, setIsTranslating] = useState(false);

  // 🔹 Nearby shops state
  const [shops, setShops] = useState([]);
  const [shopsLoading, setShopsLoading] = useState(false);
  const [shopsError, setShopsError] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setResult(null);
    setEnglishResult(null);
    setError(null);
    setLanguage("en");
    setShops([]);
    setShopsError(null);
  };

  // 🔹 Fetch nearby pesticide / agro shops
  const fetchNearbyShops = () => {
    if (!navigator.geolocation) {
      setShopsError("Geolocation not supported");
      return;
    }

    setShopsLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;

        try {
          const res = await fetch(
            `http://localhost:5000/api/nearby-shops?lat=${latitude}&lng=${longitude}`
          );
          const data = await res.json();
          setShops(data || []);
        } catch {
          setShopsError("Failed to load nearby shops");
        } finally {
          setShopsLoading(false);
        }
      },
      () => {
        setShopsError("Location permission denied");
        setShopsLoading(false);
      }
    );
  };

  const handleAnalyze = async () => {
    await analyzeCrop(
      (data) => {
        setEnglishResult(data);
        setResult(data);
        setLanguage("en");
        fetchNearbyShops(); // 🔥 trigger location feature
      },
      setError,
      setLoading
    );
  };

  const handleTranslate = async () => {
    if (!englishResult) return;

    if (language !== "en") {
      setResult(englishResult);
      setLanguage("en");
      return;
    }

    setIsTranslating(true);

    try {
      const res = await fetch("http://localhost:5000/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          analysis: englishResult,
          targetLanguage: "Hindi",
        }),
      });

      const translated = await res.json();
      setResult(translated);
      setLanguage("hi");
    } catch {
      alert("Translation failed");
    } finally {
      setIsTranslating(false);
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

      {preview && (
        <div className="image-preview">
          <img src={preview} alt="Crop Preview" />
        </div>
      )}

      <button onClick={handleAnalyze} disabled={loading}>
        {loading ? "Analyzing..." : "Analyze Crop"}
      </button>

      {error && <p className="error-message">❌ {error}</p>}

      {result && (
        <div id="result">
          <h3>Disease: {result.disease || "Not detected"}</h3>

          <p>
            Risk Level:
            <span
              className={`risk ${
                englishResult?.risk?.toLowerCase() || "unknown"
              }`}
            >
              {result.risk || "Unknown"}
            </span>
          </p>

          <ul>
            {result.actions?.length ? (
              result.actions.map((a, i) => <li key={i}>{a}</li>)
            ) : (
              <li>No actions suggested</li>
            )}
          </ul>

          {result.warning && (
            <div className="warning">⚠️ {result.warning}</div>
          )}

          {/* ✅ GOVERNMENT ADVISORY */}
          {result.govtAdvisory && (
            <div
              style={{
                marginTop: "16px",
                padding: "12px",
                border: "1px solid #b7dfb9",
                borderRadius: "8px",
                backgroundColor: "#f6fff6",
              }}
            >
              <h4 style={{ color: "#2e7d32" }}>Government Advisory</h4>
              <p>{result.govtAdvisory}</p>

              {result.pesticide && (
                <>
                  <p><b>Pesticide:</b> {result.pesticide.name}</p>
                  {result.pesticide.dosage && (
                    <p><b>Dosage:</b> {result.pesticide.dosage}</p>
                  )}
                  {result.pesticide.safety && (
                    <p><b>Safety:</b> {result.pesticide.safety}</p>
                  )}
                </>
              )}

              <small>Source: ICAR / KVK (Indicative)</small>
            </div>
          )}

          <button
            onClick={handleTranslate}
            disabled={isTranslating}
            style={{ marginTop: "15px" }}
          >
            {isTranslating
              ? "Translating..."
              : language === "en"
              ? "Translate to Hindi"
              : "View in English"}
          </button>
        </div>
      )}

      {/* 🔹 NEARBY SHOPS */}
      {shopsLoading && <p>Loading nearby pesticide shops…</p>}
      {shopsError && <p className="error-message">{shopsError}</p>}

      {shops.length > 0 && (
        <div id="result">
          <h3>Nearby Pesticide / Agro Stores</h3>
          <ul>
            {shops.map((shop) => (
              <li key={shop.place_id}>
                <strong>{shop.name}</strong>
                <br />
                <small>{shop.vicinity}</small>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="footer">F-ACDA</div>
    </div>
  );
}

export default Home;
