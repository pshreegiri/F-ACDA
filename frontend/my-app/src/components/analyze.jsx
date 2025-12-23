// frontend/src/components/analyze.js
export const analyzeCrop = async (setResult) => {
  const fileInput = document.querySelector('input[type="file"]');
  const file = fileInput.files[0];

  if (!file) {
    alert("Please upload an image first!");
    return;
  }

  const formData = new FormData();
  formData.append("image", file);

  try {
    const response = await fetch("http://localhost:5000/analyze", {
      method: "POST",
      body: formData
    });

    const data = await response.json();

    if (data.success) {
      setResult(data.analysis);
    } else {
      setResult(data.fallback);
    }

  } catch (err) {
    console.error("❌ Frontend error:", err);
    setResult({
      disease: "Not detected",
      risk: "Unknown",
      actions: [],
      warning: "Server error. Please try again."
    });
  }
};
