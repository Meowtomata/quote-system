import React, { useState, useEffect } from 'react';
import axios from 'axios';
import QuoteList from './QuoteList';


const SanctionQuotesPage = ({ onEditQuote, onSanctionQuote, finalizedQuotes }) => {


  return (
    <div className="quote-list-container">
      <h2>SANCTION</h2>
      <table className="quote-table">
        <thead>
          <tr>
            <th>QUOTE ID</th>
            <th>CUSTOMER ID</th>
            <th>SALES ASSOC. ID</th>
            <th>STATUS</th>
            <th>Email</th>
            <th>DISCOUNT</th>
            <th>CREATED DATE</th>
            <th>ACTION</th>
          </tr>
        </thead>
        <tbody>
          {finalizedQuotes.map(quote => (
            <tr key={quote.QU_ID}>
              <td>{quote.QU_ID}</td>
              <td>{quote.CU_ID}</td>
              <td>{quote.SA_ID}</td>
              <td>{quote.Status || 'Draft'}</td>
              <td>{quote.Email}</td>
              <td>
                {quote.Discount_Amount != null ? (
                  quote.isPercentage
                  ? `${parseFloat(quote.Discount_Amount).toFixed(2)}%`
                  : `$${parseFloat(quote.Discount_Amount).toFixed(2)}`) : 'N/A'}
              </td>
              <td>{quote.Created_Date ? new Date(quote.Created_Date).toLocaleDateString() : 'N/A'}</td>
              <td>
              <div className="button-group">
              <button className="Edit" onClick={() => onEditQuote(quote, "sanction", true)}>EDIT</button>
                <button className="Sanction" onClick={() => onSanctionQuote(quote.QU_ID, quote.Email)}>SANCTION</button>
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
