
"use client";

import { useState } from "react";

export default function Home() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    setResult(null);
    setError("");

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp"
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Please upload JPG, PNG or WEBP image.");
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setError("Image must be smaller than 8 MB.");
      return;
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handlePredict = async () => {
    if (!image) {
      setError("Please upload a skin image first.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("image", image);

      const API_URL = process.env.NEXT_PUBLIC_API_URL;

      const response = await fetch(
        `${API_URL}/api/predict`,
        {
          method: "POST",
          body: formData
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Prediction failed");
      }

      setResult(data);

    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = () => {
    if (preview) URL.revokeObjectURL(preview);

    setImage(null);
    setPreview("");
    setResult(null);
    setError("");
  };

  return (
    <main className="main">

      <nav className="navbar">
        <h2>SkinCare AI</h2>
        <span>Deep Learning Project</span>
      </nav>

      <section className="hero">

        <div className="tag">
          AI Powered Classification
        </div>

        <h1>
          Skin Cancer
          <span> Classification</span>
        </h1>

        <p>
          Upload a skin lesion image and let our
          trained CNN model classify the image.
        </p>

      </section>

      <section className="upload-card">

        <h2>Upload Skin Image</h2>

        <p className="subtitle">
          Select an image in JPG, PNG or WEBP format.
        </p>

        <label className="upload-area">

          {preview ? (
            <img
              src={preview}
              alt="Uploaded skin image"
              className="preview"
            />
          ) : (
            <>
              <div className="upload-icon">↑</div>
              <h3>Choose an image</h3>
              <p>Click here to upload your image</p>
            </>
          )}

          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleImageChange}
            hidden
          />

        </label>

        {image && (
          <div className="file-info">
            <span>{image.name}</span>
            <button onClick={handleRemove}>
              Remove
            </button>
          </div>
        )}

        <button
          className="predict-btn"
          onClick={handlePredict}
          disabled={!image || loading}
        >
          {loading ? "Analyzing Image..." : "Predict Skin Lesion"}
        </button>

        {loading && (
          <div className="loading">
            Please wait while the model processes your image.
          </div>
        )}

        {error && (
          <div className="error">
            {error}
          </div>
        )}

        {result && (
          <div className="result-card">

            <h2>Prediction Result</h2>

            <h3>{result.prediction}</h3>

            <p>
              Model confidence:
              <strong> {result.confidence}%</strong>
            </p>

            <div className="progress">
              <div
                className="progress-fill"
                style={{
                  width: `${Math.min(
                    100,
                    Math.max(0, Number(result.confidence) || 0)
                  )}%`
                }}
              />
            </div>

            <p className="result-note">
              This is an AI-generated research result,
              not a medical diagnosis.
            </p>

          </div>
        )}

      </section>

      <section className="disclaimer">
        <h3>Medical Disclaimer</h3>
        <p>
          This project is developed for educational
          and research purposes only. It cannot replace
          professional medical examination or diagnosis.
          Please consult a qualified dermatologist.
        </p>
      </section>

      <footer>
        SkinCare AI | Deep Learning Semester Project
      </footer>

    </main>
  );
}
