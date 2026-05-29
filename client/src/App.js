import React, { useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx";
import axios from "axios";
import Sidebar from "./Sidebar";
import Dashboard from "./Dashboard";
import Navbar from "./Navbar";
import Guidelines from "./Guidlines";
import VerifyCert from "./Verify_Cert";
import HelpSupport from "./Help_Support";
import Settings from "./Setting";
import Profile from "./Profile";
import "./styles.css";

function App() {
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState({});
  const [mode, setMode] = useState("dashboard");
  const [status, setStatus] = useState({});
  const [preview, setPreview] = useState(null);
  const [openSidebar, setOpenSidebar] = useState(false);

  // 🔍 search + debounce
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [drag, setDrag] = useState(false);
  // 📊 column filter
  const [filterKey, setFilterKey] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 250);
    return () => clearTimeout(t);
  }, [search]);

  // Upload Excel
  const handleFileUpload = (e) => {
    const reader = new FileReader();
    reader.onload = (evt) => {
      const wb = XLSX.read(evt.target.result, { type: "binary" });
      const sheet = wb.Sheets[wb.SheetNames[0]];

      const json = XLSX.utils
        .sheet_to_json(sheet, { defval: "" })
        .filter((row) => Object.values(row).join("").trim() !== "");

      const init = {};
      json.forEach((_, i) => (init[i] = true));

      setData(json);
      setSelected(init);
    };
    reader.readAsBinaryString(e.target.files[0]);
  };


const handleExcel = (file) => {
  if (!file) return;

  const reader = new FileReader();

  reader.onload = async (evt) => {
    const wb = XLSX.read(evt.target.result, { type: "binary" });
    const sheet = wb.Sheets[wb.SheetNames[0]];

    const json = XLSX.utils
      .sheet_to_json(sheet, { defval: "" })
      .filter((row) => Object.values(row).join("").trim() !== "");

    // 🔥 IMPORTANT: backend ko bhejo
    try {
      await axios.post("http://localhost:5000/save-excel", {
        data: json,
      });

      console.log("Excel sent to server ✅");
    } catch (err) {
      console.log("Error sending excel ❌", err);
    }

    // existing logic
    const init = {};
    json.forEach((_, i) => (init[i] = true));

    setData(json);
    setSelected(init);
  };

  reader.readAsBinaryString(file);
};


  // 🔍 highlight
  const highlightText = (text) => {
    if (!debounced) return text;
    const regex = new RegExp(`(${debounced})`, "gi");
    return text
      ?.toString()
      .split(regex)
      .map((part, i) =>
        part.toLowerCase() === debounced.toLowerCase() ? (
          <span key={i} className="highlight">
            {part}
          </span>
        ) : (
          part
        ),
      );
  };

  const toggleSidebar = () => {
    setOpenSidebar(!openSidebar);
  };

  // 🔥 FILTER + INDEX SAFE
  const filteredData = useMemo(() => {
    return data
      .map((row, index) => ({ row, index }))
      .filter(({ row }) => {
        const value = filterKey ? row[filterKey] : Object.values(row).join(" ");

        return value
          ?.toString()
          .toLowerCase()
          .includes(debounced.toLowerCase());
      });
  }, [data, debounced, filterKey]);

  // Toggle checkbox
  const toggle = (i) => {
    setSelected((prev) => ({ ...prev, [i]: !prev[i] }));
  };

  const selectAll = () => {
    const all = {};
    data.forEach((_, i) => (all[i] = true));
    setSelected(all);
  };

  const deselectAll = () => {
    const none = {};
    data.forEach((_, i) => (none[i] = false));
    setSelected(none);
  };

  // Send emails
const sendEmails = async () => {
   
  const filtered = data.filter((_, i) => selected[i]);

  if (filtered.length === 0) {
    alert("Please select at least one record");
    return;
  }

  try {
    setLoading(true); // 🔥 start loader

    const res = await axios.post(
      mode === "offer"
        ? "http://localhost:5000/send-offers"
        : "http://localhost:5000/send-certificates",
      { data: filtered }
    );

    // ✅ status update (correct index mapping)
    const updated = { ...status };
    filtered.forEach((item) => {
      const index = data.findIndex(d => d === item);
      updated[index] = "Sent";
    });

    setStatus(updated);

    alert(res?.data?.message || "Emails Sent Successfully! ✅");

  } catch (error) {
    console.error("Error:", error);

    // 🔥 better error message
    alert(
      error?.response?.data?.error ||
      error?.message ||
      "Something went wrong ❌"
    );

  } finally {
    setLoading(false); // 🔥 always stop loader
  }
};


  // Download PDF
const downloadPDF = async (student) => {
  try {
    const res = await axios.post(
      "http://localhost:5000/download-pdf",
      { student, mode },
      { responseType: "blob" } // 🔥 VERY IMPORTANT
    );

    const blob = new Blob([res.data], { type: "application/pdf" });

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${student.Name}.pdf`;
    a.click();

  } catch (err) {
    alert("Download failed ❌");
    console.log(err);
  }
};

const downloadZip = async () => {
  const filtered = data.filter((_, i) => selected[i]);

  if (filtered.length === 0) {
    alert("Select at least one record");
    return;
  }

  try {
    const res = await axios.post(
      "http://localhost:5000/download-zip",
      { data: filtered },
      { responseType: "blob" } // 🔥 MUST
    );

    const url = window.URL.createObjectURL(new Blob([res.data]));

    const a = document.createElement("a");
    a.href = url;
    a.download = "certificates.zip";
    a.click();

  } catch (err) {
    console.log(err);
    alert("ZIP download failed ❌");
  }
};


  // 📊 stats
const selectedCount = Object.values(selected).filter(Boolean).length;

  return (
    <div className="app">
      <Sidebar setMode={setMode} openSidebar={openSidebar} mode={mode} />
      <div className="main">
        <Navbar
          mode={mode}
          setSearch={setSearch}
          toggleSidebar={toggleSidebar}
          downloadZip={downloadZip}
        />
        {/* DASHBOARD */}
        {mode === "dashboard" && (
          <Dashboard data={data} selected={selected} status={status} />
        )}

        {/* GUIDELINES */}
        {mode === "guidelines" && <Guidelines /> }

        {/* VERIFY CERTIFICATE */}
        {mode === "verify" && <VerifyCert />}

        {/* HELP & SUPPORT */}
        {mode === "help" && <HelpSupport />}

        {/* SETTINGS */}
        {mode === "settings" && <Settings />}

        {/* PROFILE */}
        {mode === "profile" && <Profile />}

        {/* TABLE AREA */}
        {(mode === "offer" || mode === "certificate") && (
          <>
            {/* <h2>{mode === "offer" ? "OFFER LETTERS" : "CERTIFICATES"}</h2> */}
            <h2> </h2>
            {/* <input type="file" onChange={handleFileUpload} /> */}
            <div
              className={`uploadBox ${drag ? "active" : ""}`}
              onDragEnter={() => setDrag(true)}
              onDragLeave={() => setDrag(false)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files[0];
                handleExcel(file);
              }}
              onClick={() => document.getElementById("fileInput").click()}
            >
              <p>📂 Drag & Drop Excel File Here</p>
              <span>or click to upload</span>

              <input
                id="fileInput"
                type="file"
                accept=".xlsx, .xls"
                style={{ display: "none" }}
                onChange={(e) => handleExcel(e.target.files[0])}
              />
            </div>

            {/* 📊 FILTER + STATS */}
            <div className="topControls">
              <select onChange={(e) => setFilterKey(e.target.value)}>
                <option value="">All Columns</option>
                {data[0] &&
                  Object.keys(data[0]).map((k) => <option key={k}>{k}</option>)}
              </select>

              <div className="stats">
                <span>Total: {data.length}</span>
                <span>Filtered: {filteredData.length}</span>
                <span>Selected: {selectedCount}</span>
              </div>
            </div>

            <div>
              <button className="btn" onClick={selectAll}>
                Select All
              </button>
              <button className="btn" onClick={deselectAll}>
                Deselect
              </button>
              <button className="btn" onClick={sendEmails} disabled={loading}>
                {loading ? <span className="loader"></span> : "📤 Send"}
              </button>
            </div>

            {/* TABLE */}
            <div className="tableWrap">
              <table>
                <thead>
                  <tr>
                    <th>Select</th>

                    {filteredData[0] &&
                      Object.keys(filteredData[0].row).map((k) => (
                        <th key={k}>{k}</th>
                      ))}

                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredData.map(({ row, index }) => (
                    <tr key={index}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selected[index] || false}
                          onChange={() => toggle(index)}
                        />
                      </td>

                      {Object.values(row).map((val, j) => (
                        <td key={j}>{highlightText(val)}</td>
                      ))}

                      <td>
                        <span
                          className={
                            status[index] === "Sent" ? "sent" : "pending"
                          }
                        >
                          {status[index] || "Pending"}
                        </span>
                      </td>

                      <td>
                        <button onClick={() => setPreview(row)}>👁</button>
                        <button onClick={() => downloadPDF(row)}>⬇</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* BULK ACTION BAR */}
        {selectedCount > 0 && (
          <div className="bulkBar">
            {selectedCount} selected
            <button onClick={sendEmails}>Send</button>
          </div>
        )}

        {/* PREVIEW */}
        {preview && (
          <div className="modal">
            <div className="modalBox">
              <h2>Preview</h2>
              <p>{preview.Name}</p>
              <button onClick={() => setPreview(null)}>Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
