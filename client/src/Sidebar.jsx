import React from "react";
import logo from "./assets/logo.png";

export default function Sidebar({ setMode, mode }) {
  return (
    <div className="sidebar">
      {/* 🔥 LOGO + NAME */}
      <div className="brand">
        <img src={logo} alt="CodRexa" />
        <h2>
          <b>Cod</b>
          <span className="brandText">
            <b>Rexa</b>
          </span>
        </h2>
      </div>

      {/* MENU */}
      <p
        className={mode === "dashboard" ? "active" : ""}
        onClick={() => setMode("dashboard")}
      >
        📊 Dashboard
      </p>

      <p
        className={mode === "offer" ? "active" : ""}
        onClick={() => setMode("offer")}
      >
        📄 Offer Letters
      </p>

      <p
        className={mode === "certificate" ? "active" : ""}
        onClick={() => setMode("certificate")}
      >
        🎓 Certificates
      </p>

      <p className={mode === "verify" ? "active" : ""} onClick={() => setMode("verify")}>
        🔐 Verify Certificate
      </p>

      <hr />

      <p
        className={mode === "guidelines" ? "active" : ""}
        onClick={() => setMode("guidelines")}
      >
        📘 Guidelines
      </p>
      <p
        className={mode === "help" ? "active" : ""}
        onClick={() => setMode("help")}
      >
        ❓ Help & Support
      </p>
      <hr />
      <p
        className={mode === "settings" ? "active" : ""}
        onClick={() => setMode("settings")}
      >
        ⚙️ Settings
      </p>
    
      <p
        className={mode === "profile" ? "active" : ""}
        onClick={() => setMode("profile")}
      >
        👤 Profile
      </p>
    </div>
  );
}
