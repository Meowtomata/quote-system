import React, { useState, useEffect } from 'react';
import axios from 'axios';

const QuotesList = ({ onEditQuote, onUpdateStatus, quotes, allLineItems, customers, salesAssociates }) => {

  return (
    <div className="quote-list-container">
      <h2>QUOTES</h2>
      <table className="quote-table">
        <thead>
          <tr>
            <th>QUOTE ID</th>
            <th>Customer Name</th>
            <th>Associate Name</th>
            <th>STATUS</th>
            <th>Final Price</th>
            <th>CREATED DATE</th>
            <th>ACTION</th>
          </tr>
        </thead>
        <tbody>
          {quotes.map(quote => {
            console.log(quote);
            const customer = customers.find(customer => customer.id === quote.CU_ID);
            const customerName = customer ? customer.name : 'N/A';

            const associate = salesAssociates.find(associate => associate.SA_ID === quote.SA_ID);
            const associateName = associate ? associate.Name : 'N/A';

            const lineItems = allLineItems.filter(lineItem => lineItem.QU_ID === quote.QU_ID);
            const totalPrice = lineItems.reduce((total, item) => total + item.Price, 0);

            let finalPrice = totalPrice;
            if (quote.Discount_Amount != null) {
              if (quote.isPercentage) {
                finalPrice = totalPrice - (totalPrice * (parseFloat(quote.Discount_Amount) / 100));
              } else {
                finalPrice = totalPrice - parseFloat(quote.Discount_Amount);
              }
            }

            return ( 
              <tr key={quote.QU_ID}>
                <td>{quote.QU_ID}</td>
                <td>{customerName}</td>
                <td>{associateName}</td>
                <td>{quote.Status}</td>
                <td>{`$${parseFloat(finalPrice).toFixed(2)}`}</td>
                <td>{quote.Created_Date ?quote.Created_Date : 'N/A'}</td>
                <td>
                  <div className="button-group">
                  <button className="Edit" onClick={() => onEditQuote(quote)}>EDIT</button>
                    <button className="Sanction" onClick={() => onUpdateStatus(quote)}>
                    {quote.Status === "Finalized"
                      ? "SANCTION"
                      : quote.Status === "Draft"
                      ? "FINALIZE"
                      : quote.Status === "Sanctioned"
                      ? "ORDER"
                      : "UNKNOWN STATUS" // Optional: Handle other potential statuses
                    }
                     </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default QuotesList;
