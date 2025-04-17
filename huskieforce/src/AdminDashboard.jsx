import React, { useState } from "react";
import SalesAssociateSection from "./SalesAssociateSection";
import QuoteSearchSection from "./QuoteSearchSection";

function AdminDashboard() {
  const [tab, setTab] = useState("associates");

  return (
    <div style={{ padding: "1rem" }}>
      <h2>ADMINISTRATION</h2>

      <div style={{ marginBottom: "1rem" }}>
        <button onClick={() => setTab("associates")}>SALES ASSOCIATES</button>
        <button onClick={() => setTab("quotes")} style={{ marginLeft: "0.5rem" }}>
          QUOTES
        </button>
      </div>

      {tab === "associates" && <SalesAssociateSection />}
      {tab === "quotes" && <QuoteSearchSection />}
    </div>
  );
}

export default AdminDashboard;
