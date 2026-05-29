import React from "react";

export default function Guidelines() {
  return (
    <div className="guidelinesContainer">
      <h2 style={{ textAlign: "center" }}>📘 System Guidelines</h2>

      <div className="cardsRow">
        {/* OFFER LETTER */}
        <div className="card">
          <h3>📄 Offer Letter Rules</h3>
          <ul>
            <li>Name must be correct</li>
            <li>Email must be valid</li>
            <li>Intern ID required</li>
            <li>Duration must be filled</li>
            <li>Date must be provided</li>
            <li>Designation must be provided</li>
          </ul>
        </div>

        {/* CERTIFICATE */}
        <div className="card">
          <h3>🎓 Certificate Rules</h3>
          <ul>
            <li>Name should match official records</li>
            <li>Email must be valid</li>
            <li>Intern ID required</li>
            <li>Domain must be correct</li>
            <li>Start Date & End Date required</li>
            <li>Certificate ID required</li>
            <li>Issue Date required</li>
            <li>Duration must be specified</li>
          </ul>
        </div>

        {/* REQUIRED FIELDS */}
        <div className="card">
          <h3>⚠ Required Fields</h3>
          <ul>
            <li>Name</li>
            <li>Email</li>
            <li>Domain</li>
            <li>StartDate</li>
            <li>EndDate</li>
            <li>Duration</li>
            <li>CertificateID</li>
            <li>Date</li>
          </ul>
        </div>
      </div>

      <style>{`
.guidelinesContainer {
  height: calc(100vh - 80px);
  overflow-y: auto;
  padding: 20px;
}

.cardsRow {
  display: flex;
  gap: 20px;
  margin-top: 25px;
}

.card {
  flex: 1;
  background: var(--card);
  padding: 20px;
  border-radius: 14px;
  box-shadow: 0 0 10px rgba(0,0,0,0.3);
}

.card h3 {
  margin-bottom: 12px;
  color: var(--text);
  text-align: center;
}

.card ul {
  padding-left: 20px;
}

.card li {
  margin: 7px 0;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .cardsRow {
    flex-direction: column;
  }
}
      `}</style>
    </div>
  );
}