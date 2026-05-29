import React, { useState } from "react";

export default function Settings() {
  const [companyName, setCompanyName] = useState("CodRexa");
  const [email, setEmail] = useState("codrexa.hr@gmail.com");
  const [website, setWebsite] = useState("codrexa.in");
  const [logo, setLogo] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleLogo = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLogo(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSave = () => {
    alert("Settings Saved ✅");
    // 🔥 future: backend API call
  };

  return (
    <div className="settingsPage-container">

      <div className="settingsPage-card">

        <h2>⚙️ Settings</h2>

        {/* COMPANY INFO */}
        <div className="settingsPage-section">
          <h3>🏢 Company Info</h3>

          <input
            className="settingsPage-input"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Company Name"
          />

          <input
            className="settingsPage-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />

          <input
            className="settingsPage-input"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="Website"
          />
        </div>

        {/* LOGO */}
        <div className="settingsPage-section">
          <h3>🖼 Logo Upload</h3>

          <input type="file" onChange={handleLogo} />

          {preview && (
            <img
              src={preview}
              alt="logo"
              className="settingsPage-logoPreview"
            />
          )}
        </div>

        {/* SAVE BUTTON */}
        <button className="settingsPage-btn" onClick={handleSave}>
          Save Settings
        </button>

      </div>

      <style>{`
/* MAIN */
.settingsPage-container {
  display: flex;
  justify-content: center;
  padding: 40px;
}

/* CARD */
.settingsPage-card {
  width: 500px;
  background: var(--card, #1e1e2f);
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}

/* HEAD */
.settingsPage-card h2 {
  margin-bottom: 20px;
  color: var(--text, #fff);
}

/* SECTION */
.settingsPage-section {
  margin-bottom: 20px;
}

.settingsPage-section h3 {
  margin-bottom: 10px;
  color: #9333ea;
}

/* INPUT */
.settingsPage-input {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 8px;
  border: 1px solid var(--border, #444);
  background: transparent;
  color: var(--text, #fff);
}

/* LOGO */
.settingsPage-logoPreview {
  width: 80px;
  margin-top: 10px;
  border-radius: 8px;
}

/* BUTTON */
.settingsPage-btn {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 8px;
  background: linear-gradient(45deg, #9333ea, #ec4899);
  color: white;
  cursor: pointer;
  font-weight: bold;
}

.settingsPage-btn:hover {
  opacity: 0.85;
}
      `}</style>

    </div>
  );
}
