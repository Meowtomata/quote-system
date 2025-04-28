import React, { useState } from "react";
import SalesAssociateSection from "./SalesAssociateSection";
import QuoteSearchSection from "./QuoteSearchSection";

function AdminDashboard({ 
  allQuotes, 
  onEditQuote, 
  salesAssociates, 
  customers, 
  allLineItems }
  ) {
  const [tab, setTab] = useState("associates");

  return (
    <div className="admin-container">
      <h2>ADMINISTRATION</h2>

      <div>
        <button className="Sales" onClick={() => setTab("associates")}>ASSOCIATES</button>
        <button className="QU" onClick={() => setTab("quotes")} style={{ marginLeft: "0.5rem" }}>
          QUOTES
        </button>
      </div>

      {tab === "associates" && 
        <SalesAssociateSection 
          salesAssociates={salesAssociates}
        />

      }
      {tab === "quotes" && 
        <QuoteSearchSection 
          allQuotes={allQuotes} 
          onEditQuote={onEditQuote}
          customers={customers}
          allLineItems={allLineItems}

        />

      }
    </div>
  );
}

export default AdminDashboard;
