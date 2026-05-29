import React, { useState } from "react";

export default function HelpSupport() {
  const [open, setOpen] = useState(null);

  const faqs = [
    {
      q: "Excel upload कैसे करें?",
      a: "Upload section में जाकर Excel file drag & drop करें या click करके upload करें."
    },
    {
      q: "Certificate verify कैसे करें?",
      a: "Verify page में जाकर Certificate ID डालें और Verify पर क्लिक करें."
    },
    {
      q: "Email send नहीं हो रहा?",
      a: "Check करें कि email field सही है और required fields filled हैं."
    },
    {
      q: "ZIP download काम नहीं कर रहा?",
      a: "Ensure करें कि आपने records select किए हैं और backend server चल रहा है."
    }
  ];

  return (
    <div className="helpPage-container">

      <div className="helpPage-card">

        <h2>❓ Help & Support</h2>
        <p className="helpPage-sub">
          Need help? Find answers or contact support below.
        </p>

        {/* FAQ */}
        <div className="helpPage-faq">
          {faqs.map((item, i) => (
            <div key={i} className="helpPage-faqItem">
              <div
                className="helpPage-question"
                onClick={() => setOpen(open === i ? null : i)}
              >
                {item.q}
              </div>

              {open === i && (
                <div className="helpPage-answer">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CONTACT */}
        <div className="helpPage-contact">
          <h3>📞 Contact Support</h3>

          <p><b>Email:</b> codrexa.hr@gmail.com</p>
          <p>
            <b>Website:</b>{" "}
            <a href="https://codrexa.in" target="_blank" rel="noreferrer">
              codrexa.in
            </a>
          </p>
        </div>

      </div>

      <style>{`
/* MAIN */
.helpPage-container {
  display: flex;
  justify-content: center;
  padding: 40px;
}

/* CARD */
.helpPage-card {
  width: 600px;
  background: var(--card, #1e1e2f);
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}

/* HEADER */
.helpPage-card h2 {
  margin-bottom: 5px;
  color: var(--text, #fff);
}

.helpPage-sub {
  font-size: 14px;
  color: var(--text-secondary, #aaa);
  margin-bottom: 20px;
}

/* FAQ */
.helpPage-faqItem {
  margin-bottom: 10px;
  border-radius: 8px;
  overflow: hidden;
}

.helpPage-question {
  background: #9333ea;
  color: white;
  padding: 10px;
  cursor: pointer;
  font-weight: 500;
}

.helpPage-answer {
  background: rgba(255,255,255,0.05);
  padding: 10px;
  color: var(--text-secondary, #ccc);
}

/* CONTACT */
.helpPage-contact {
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid #444;
}

.helpPage-contact a {
  color: #60a5fa;
  text-decoration: none;
}

.helpPage-contact a:hover {
  text-decoration: underline;
}
      `}</style>

    </div>
  );
}
