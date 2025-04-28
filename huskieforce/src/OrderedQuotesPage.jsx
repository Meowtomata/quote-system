import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OrderedQuotesPage = ({ onEditQuote, onOrderQuote, sanctionedQuotes }) => {



  return (
    <div className="quote-list-container">
      <h2>ORDER</h2>
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
          {sanctionedQuotes.map(quote => (
            <tr key={quote.QU_ID}>
              <td>{quote.QU_ID}</td>
              <td>{quote.CU_ID}</td>
              <td>{quote.SA_ID}</td>
              <td>{quote.Status}</td>
              <td>
                {quote.Discount_Amount != null
                  ? quote.isPercentage
                    ? `${parseFloat(quote.Discount_Amount).toFixed(2)}%`
                    : `$${parseFloat(quote.Discount_Amount).toFixed(2)}`
                  : 'N/A'}
              </td>
              <td>{quote.Created_Date ? new Date(quote.Created_Date).toLocaleDateString() : 'N/A'}</td>
              <td>
              <div className="button-group">
              <button className="Edit" onClick={() => onEditQuote(quote, "ordered")}>EDIT</button>
              <button className="Order" onClick={() => onOrderQuote(quote)}>ORDER</button>
              </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderedQuotesPage;
