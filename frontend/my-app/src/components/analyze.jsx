// frontend/src/components/analyze.js
export const analyzeCrop = async (setResult, setError, setLoading) => {
  const fileInput = document.querySelector('input[type="file"]');
  const file = fileInput.files[0];

  if (!file) {
    alert("Please upload an image first!");
    return;
  }

  const formData = new FormData();
  formData.append("image", file);

  try {
    setLoading(true);
    setError(null);

    const response = await fetch("http://localhost:5000/analyze", {
      method: "POST",
      body: formData
    });

    const data = await response.json();

    // ❌ HANDLE BACKEND ERRORS PROPERLY
    if (!response.ok) {
      setResult(null);
      setError(data.error || "Something went wrong. Please try again.");
      return;
    }

    // ✅ SUCCESS
    setResult(data.analysis);

  } catch (err) {
    console.error("❌ Frontend error:", err);
    setError("Server error. Please try again later.");
    setResult(null);
  } finally {
    setLoading(false);
  }
};
