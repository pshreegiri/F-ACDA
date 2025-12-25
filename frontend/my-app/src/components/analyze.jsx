// frontend/src/components/analyze.js

export const analyzeCrop = async (setResult, setError, setLoading) => {
  const fileInput = document.querySelector('input[type="file"]');
  const file = fileInput?.files?.[0];

  if (!file) {
    setError("Please upload an image first.");
    return;
  }

  const formData = new FormData();
  formData.append("image", file);

  try {
    setLoading(true);
    setError(null);
    setResult(null);

    const response = await fetch("http://localhost:5000/analyze", {
      method: "POST",
      body: formData
    });

    const data = await response.json();

    if (!response.ok || data.success !== true) {
      setError(data.error || "Analysis failed. Please try again.");
      return;
    }

    // ✅ IMPORTANT: pass ALL new backend fields
    setResult({
      crop: data.analysis.crop,
      disease: data.analysis.disease,
      risk: data.analysis.risk,
      actions: data.analysis.actions || [],
      warning: data.analysis.warning || null,

      // 🔽 NEW FIELDS
      govtAdvisory: data.analysis.govtAdvisory || null,
      pesticide: data.analysis.pesticide || null
    });

  } catch (err) {
    console.error("❌ Frontend analyze error:", err);
    setError("Server error. Please try again later.");
  } finally {
    setLoading(false);
  }
};