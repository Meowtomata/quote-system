import React, { useState, useEffect } from 'react';
import axios from 'axios';
import QuoteList from './QuoteList';


const SanctionQuotesPage = ({ onEditQuote }) => {
  const [quotes, setQuotes] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3000/api/quotes")
      .then(res => {
        console.log("Fetched quote data:", res.data); // confirms full structure
  
        const quoteArray = res.data.data || []; // ✅ safely access actual array
        const draftQuotes = quoteArray.filter(q =>
          !q.Status || q.Status.toLowerCase() === "draft"
        );
  
        setQuotes(draftQuotes);
      })
      .catch(err => {
        console.error("Failed to load quotes:", err.message);
      });
  }, []);
  

  const handleSanctionQuote = async (quoteId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/quotes/${quoteId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newStatus: "Sanctioned" }) // or "Sanctioned"
      });
  
      if (!response.ok) {
        throw new Error("Failed to update status");
      }
  
      // Optionally show confirmation
      console.log("Quote status updated successfully!");
  
      // ⬇️ Remove sanctioned quote from local list (UI update)
      setQuotes((prevQuotes) => prevQuotes.filter(q => q.QU_ID !== quoteId));
  
    } catch (error) {
      console.error("Error sanctioning quote:", error);
    }
  };

  return (
    <div className="quote-list-container">
      <h2>Sanction</h2>
      <table className="quote-table">
        <thead>
          <tr>
            <th>QUOTE ID</th>
            <th>CUSTOMER ID</th>
            <th>SALES ASSOC. ID</th>
            <th>STATUS</th>
            <th>DISCOUNT</th>
            <th>CREATED DATE</th>
            <th>ACTION</th>
          </tr>
        </thead>
        <tbody>
          {quotes.map(quote => (
            <tr key={quote.QU_ID}>
              <td>{quote.QU_ID}</td>
              <td>{quote.CU_ID}</td>
              <td>{quote.SA_ID}</td>
              <td>{quote.Status || 'Draft'}</td>
              <td>
                {quote.Discount_Amount != null ? (
                  quote.isPercentage
                  ? `${parseFloat(quote.Discount_Amount).toFixed(2)}%`
                  : `$${parseFloat(quote.Discount_Amount).toFixed(2)}`) : 'N/A'}
              </td>
              <td>{quote.Created_At ? new Date(quote.Created_At).toLocaleDateString() : 'N/A'}</td>
              <td>
              <div className="button-group">
              <button className="Edit" onClick={() => onEditQuote(quote, "sanction")}>EDIT</button>
                <button className="Sanction" onClick={() => handleSanctionQuote(quote.QU_ID)}>SANCTION</button>
              </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SanctionQuotesPage;
