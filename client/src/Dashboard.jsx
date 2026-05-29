import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard({ data, selected, status }) {
  const total = data.length;
  const selectedCount = Object.values(selected).filter(Boolean).length;
  const sent = Object.values(status).filter((s) => s === "Sent").length;
  const pending = total - sent;

  const successRate = total ? ((sent / total) * 100).toFixed(1) : 0;

  const chartData = [
    { name: "Sent", value: sent },
    { name: "Pending", value: pending },
  ];

  return (
    <div className="dash">




      {/* <h2>📊 Dashboard Overview</h2> */}
      <h1> </h1>

      {/* CARDS */}
      <div className="cards">
        <div className="card">
          <h3>{total}</h3>
          <p>Total Records</p>
        </div>

        <div className="card">
          <h3>{sent}</h3>
          <p>Emails Sent</p>
        </div>

        <div className="card">
          <h3>{pending}</h3>
          <p>Pending</p>
        </div>

        <div className="card">
          <h3>{selectedCount}</h3>
          <p>Selected</p>
        </div>

        <div className="card highlight">
          <h3>{successRate}%</h3>
          <p>Success Rate</p>
        </div>
      </div>

      {/* GRID */}
      <div className="grid">

        {/* CHART */}
        <div className="box">
          <h3>Status Analytics</h3>

          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" stroke="var(--text)" />
              <YAxis stroke="var(--text)" />
              <Tooltip />
              <Bar dataKey="value" fill="#9333ea" radius={[10,10,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* ACTIVITY */}
        <div className="box">
          <h3>Recent Activity</h3>

          {data.slice(0, 6).map((row, i) => (
            <div key={i} className="activity">
              <span>{row.Name || "Student"}</span>
              <span className={status[i] === "Sent" ? "sent" : "pending"}>
                {status[i] || "Pending"}
              </span>
            </div>
          ))}
        </div>

      </div>

      {/* CSS FIXED */}
      <style>{`
        .dash {
          color: var(--text);
        }

        h2 {
          margin-bottom: 20px;
        }

        /* CARDS */
        .cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 15px;
          margin-bottom: 20px;
        }

        .card {
          padding: 20px;
          border-radius: 12px;
          background: var(--card);
          color: var(--text);
          border: 1px solid var(--border);
          transition: 0.3s;
        }

        .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(147, 51, 234, 0.3);
        }

        .highlight {
          background: linear-gradient(135deg, #9333ea, #ec4899);
          color: white;
        }

        /* GRID */
        .grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 20px;
        }

        .box {
          padding: 20px;
          border-radius: 12px;
          background: var(--card);
          color: var(--text);
          border: 1px solid var(--border);
        }

        /* ACTIVITY */
        .activity {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid var(--border);
        }

        .sent {
          color: #22c55e;
        }

        .pending {
          color: #facc15;
        }

        @media(max-width:768px){
          .grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

    </div>
  );
}
