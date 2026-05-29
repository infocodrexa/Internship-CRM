import React, { useState } from "react";
import { useTheme } from "./ThemeContext";

export default function Navbar({ mode, setSearch, downloadZip }) {
  const { theme, toggleTheme } = useTheme();
  const [openProfile, setOpenProfile] = useState(false);

  return (
    <div className="navbar">

      {/* LEFT */}
      <div className="navLeft">
        <h2>
          {mode === "dashboard" && "📊 Dashboard"}
          {mode === "offer" && "📄 Offer Letters"}
          {mode === "certificate" && "🎓 Certificates"}
          {mode === "verify" && "✅ Verify Certificate"}
          {mode === "guidelines" && "📘 Guidelines"}
          {mode === "help" && "❓ Help & Support"}
          {mode === "settings" && "⚙️ Settings"}
          {mode === "profile" && "👤 Profile"}
        </h2>
      </div>

      {/* CENTER */}
      <div className="navCenter">
        <input
          type="text"
          placeholder="🔍 Search name, email..."
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* RIGHT */}
      <div className="navRight">

        <button className="btn">📤 Send</button>
        <button className="btn" onClick={downloadZip}>
          📦 ZIP
        </button>

        <button className="themeBtn" onClick={toggleTheme}>
          {theme === "dark" ? "☀️" : "🌙"}
        </button>

        {/* 🔥 PROFILE */}
        <div className="profileWrap">
          <div
            className="profile"
            onClick={() => setOpenProfile(!openProfile)}
          >
            GK
          </div>

          {openProfile && (
            <div className="profileDropdownCustom">
              
              <h3>🚀 CodRexa</h3>

              <div className="profileInfo">
                <p><b>Admin:</b> Gautam Kumar</p>
                <p><b>Email:</b> codrexa.hr@gmail.com</p>
                <p>
                  <b>Website:</b>{" "}
                  <a href="https://codrexa.in" target="_blank" rel="noreferrer">
                    codrexa.in
                  </a>
                </p>
              </div>

              <hr />

              <p className="profileDesc">
                CodRexa provides internships, real-world projects, and
                industry-level training to help students build strong careers.
              </p>

            </div>
          )}
        </div>

      </div>

      {/* 🔥 STYLING */}
      <style>{`
.profileWrap {
  position: relative;
}

.profile {
  width: 38px;
  height: 38px;
  background: linear-gradient(45deg, #9333ea, #ec4899);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  cursor: pointer;
  font-weight: bold;
}

/* DROPDOWN */
.profileDropdownCustom {
  position: absolute;
  right: 0;
  top: 50px;
  width: 270px;
  background: var(--card, #1e1e2f);
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.25);
  z-index: 999;
  animation: fadeProfile 0.2s ease;
}

.profileDropdownCustom h3 {
  margin-bottom: 10px;
  color: #9333ea;
}

/* INFO */
.profileInfo p {
  font-size: 13px;
  margin: 4px 0;
  color: var(--text, #fff);
}

.profileInfo a {
  color: #60a5fa;
  text-decoration: none;
}

.profileInfo a:hover {
  text-decoration: underline;
}

/* DESC */
.profileDesc {
  font-size: 13px;
  color: var(--text-secondary, #aaa);
  margin-top: 8px;
}

/* ANIMATION */
@keyframes fadeProfile {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
      `}</style>

    </div>
  );
}
