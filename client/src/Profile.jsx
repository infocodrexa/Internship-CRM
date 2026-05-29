import React, { useState } from "react";

export default function Profile() {
  const [name, setName] = useState("Gautam Kumar");
  const [email, setEmail] = useState("codrexa.hr@gmail.com");
  const [website, setWebsite] = useState("codrexa.in");
  const [logo, setLogo] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLogo(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSave = () => {
    alert("Profile Updated ✅");
  };

  return (
    <div className="profilePage-container">

      <div className="profilePage-card">

        {/* HEADER */}
        <div className="profilePage-header">
          <div className="profilePage-avatar">
            {preview ? (
              <img src={preview} alt="profile" />
            ) : (
              <span>GK</span>
            )}
          </div>

          <h2>{name}</h2>
          <p>Admin • CodRexa</p>
        </div>

        {/* FORM */}
        <div className="profilePage-form">

          <label>Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label>Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Website</label>
          <input
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />

          <label>Profile Image</label>
          <input type="file" onChange={handleImage} />

        </div>

        <button className="profilePage-btn" onClick={handleSave}>
          Save Changes
        </button>

      </div>

      <style>{`
/* MAIN */
.profilePage-container {
  display: flex;
  justify-content: center;
  padding: 40px;
}

/* CARD */
.profilePage-card {
  width: 420px;
  background: var(--card, #1e1e2f);
  padding: 25px;
  border-radius: 14px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}

/* HEADER */
.profilePage-header {
  text-align: center;
  margin-bottom: 20px;
}

.profilePage-avatar {
  width: 80px;
  height: 80px;
  margin: auto;
  background: linear-gradient(45deg, #9333ea, #ec4899);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  font-weight: bold;
  overflow: hidden;
}

.profilePage-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profilePage-header h2 {
  margin-top: 10px;
  color: var(--text, #fff);
}

.profilePage-header p {
  font-size: 13px;
  color: var(--text-secondary, #aaa);
}

/* FORM */
.profilePage-form label {
  display: block;
  margin-top: 10px;
  font-size: 13px;
  color: #aaa;
}

.profilePage-form input {
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  border-radius: 8px;
  border: 1px solid #444;
  background: transparent;
  color: #fff;
}

/* BUTTON */
.profilePage-btn {
  width: 100%;
  margin-top: 20px;
  padding: 12px;
  border: none;
  border-radius: 8px;
  background: linear-gradient(45deg, #9333ea, #ec4899);
  color: white;
  cursor: pointer;
  font-weight: bold;
}

.profilePage-btn:hover {
  opacity: 0.85;
}
      `}</style>

    </div>
  );
}
