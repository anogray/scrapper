"use client";
import { useState } from "react";
import styles from "./page.module.css";
import { FaDownload } from "react-icons/fa";

export default function Home() {
  const [inputUrl, setInputUrl] = useState("");
  const [downloadLink, setDownloadLink] = useState<string | null>(null); // State to hold the href link
  const [error, setError] = useState<string | null>(null); // State to handle any error
  const [loading, setLoading] = useState(false); // State for loader

  async function handleClick(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null); // Reset error before making the request
    setDownloadLink(null); // Reset download link before making the request
    setLoading(true); // Show the loader while processing

    try {
      const response = await fetch("/api/scraper", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: inputUrl }),
      });

      const data = await response.json();
      if (data.success) {
        setDownloadLink(data.href); // Update downloadLink with the href from the backend
      } else {
        setError(data.error); // Display error message
      }
    } catch (err) {
      setError("An unexpected error occurred.");
      console.error("Error fetching the download link:", err);
    } finally {
      setLoading(false); // Hide the loader after processing
    }
  }

  // Clear button handler to reset all the states
  function handleClear() {
    setInputUrl(""); // Reset input field
    setDownloadLink(null); // Clear the download link
    setError(null); // Clear the error message
  }

  return (
    <div className={styles.page}>
      <form className={styles.formContainer} onSubmit={handleClick}>
        <label className={styles.formLabel} htmlFor="url">
          Enter your reel URL:
        </label>
        <input
          className={styles.formInput}
          placeholder="https://www.instagram.com/reel/DAI3wcVvqZa"
          type="text"
          name="url"
          id="url"
          value={inputUrl} // Bind the value to inputUrl
          required
          onChange={(e) => setInputUrl(e.target.value)}
        />
        <div className={styles.buttonContainer}>
          <button
            className={styles.formButton}
            type="submit"
            disabled={loading}
          >
            {loading ? "Processing..." : "Get Download Link"}
          </button>
          <button
            type="button" // Make sure the clear button is of type "button" to avoid form submission
            className={styles.clearButton}
            onClick={handleClear}
            disabled={loading} // Disable clear button while loading
          >
            Clear
          </button>
        </div>
      </form>

      {/* Loader */}
      {loading && <div className={styles.loader}></div>}

      {/* Conditionally render the result or error */}
      {downloadLink && (
        <div className={styles.result}>
          <a
            href={downloadLink}
            className={styles.downloadButton}
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className={styles.downloadButton}>
            Download <FaDownload /> 
            </button>
          </a>
        </div>
      )}

      {error && <p className={styles.error}>Error: {error}</p>}
    </div>
  );
}
