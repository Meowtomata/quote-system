import React, { useState } from "react";
import SalesAssociateSection from "./SalesAssociateSection";
import QuoteSearchSection from "./QuoteSearchSection";

function AdminDashboard({
  allQuotes,
  onEditQuote,
  customers,
  allLineItems,
  salesAssociates,
  addAssociate,
  updateAssociate,
  deleteAssociate
}) {

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
        addAssociate={addAssociate}
        updateAssociate={updateAssociate}
        deleteAssociate={deleteAssociate}
      />
      

      }
      {tab === "quotes" && 
        <QuoteSearchSection 
          allQuotes={allQuotes} 
          onEditQuote={onEditQuote}
          customers={customers}
          allLineItems={allLineItems}
          salesAssociates={salesAssociates}
        />

      }
    </div>
  );
}

export default AdminDashboard;
