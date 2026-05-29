

import React, { useState } from "react";

export default function VerifyPage() {
  const [id, setId] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!id) {
      alert("Please enter Certificate ID");
      return;
    }

    setLoading(true);
    setError("");
    setData(null);

    try {
      const res = await fetch(`http://localhost:5000/verify/${id}`);
      const result = await res.json();

      if (result.success) {
        setData(result.data);
      } else {
        setError("Invalid Certificate ID ❌");
      }
    } catch (err) {
      setError("Server error ❌");
    }

    setLoading(false);
  };

  return (
    <div className="verifyPage-container">
      <div className="verifyPage-card">

        <div className="verifyPage-header">
          <h2>🔐 Verify Certificate</h2>
          <p>Enter Certificate ID to check authenticity</p>
        </div>

        <div className="verifyPage-inputBox">
          <input
            className="verifyPage-input"
            type="text"
            placeholder="Enter Certificate ID"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />

          <button
            className="verifyPage-btn"
            onClick={handleVerify}
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify"}
          </button>
        </div>

        {error && <p className="verifyPage-error">{error}</p>}

        {data && (
          <div className="verifyPage-result">
            <div className="verifyPage-badge">✔ Verified</div>

            <div className="verifyPage-row">
              <span>Name</span>
              <b>{data.name}</b>
            </div>

            <div className="verifyPage-row">
              <span>Domain</span>
              <b>{data.domain}</b>
            </div>
          </div>
        )}

      </div>

      <style>{`
/* 🔥 MAIN WRAPPER */
.verifyPage-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
}

/* CARD */
.verifyPage-card {
  width: 420px;
  background: var(--card, #1e1e2f);
  padding: 30px;
  border-radius: 14px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  transition: 0.3s;
}

/* HEADER */
.verifyPage-header h2 {
  margin-bottom: 5px;
  color: var(--text, #fff);
}

.verifyPage-header p {
  font-size: 14px;
  color: var(--text-secondary, #aaa);
  margin-bottom: 20px;
}

/* INPUT AREA */
.verifyPage-inputBox {
  display: flex;
  gap: 10px;
}

.verifyPage-input {
  flex: 1;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid var(--border, #444);
  background: transparent;
  color: var(--text, #fff);
}

.verifyPage-input:focus {
  border-color: #9333ea;
  outline: none;
}

/* BUTTON */
.verifyPage-btn {
  padding: 12px 18px;
  border-radius: 8px;
  border: none;
  background: linear-gradient(45deg, #9333ea, #ec4899);
  color: white;
  cursor: pointer;
  transition: 0.2s;
}

.verifyPage-btn:hover {
  opacity: 0.85;
}

.verifyPage-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* ERROR */
.verifyPage-error {
  color: #ef4444;
  margin-top: 12px;
  font-size: 14px;
}

/* RESULT */
.verifyPage-result {
  margin-top: 20px;
  padding: 15px;
  border-radius: 10px;
  background: rgba(255,255,255,0.03);
  border: 1px solid var(--border, #444);
}

/* BADGE */
.verifyPage-badge {
  background: #22c55e;
  color: white;
  display: inline-block;
  padding: 5px 12px;
  border-radius: 6px;
  font-size: 12px;
  margin-bottom: 12px;
}

/* ROW */
.verifyPage-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
}

.verifyPage-row span {
  color: var(--text-secondary, #aaa);
}
      `}</style>
    </div>
  );
}
