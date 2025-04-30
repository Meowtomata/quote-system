import React, { useState, useEffect } from 'react';

const DraftQuotesPage = ({ onEditQuote, onFinalizeQuote, draftQuotes, allLineItems, customers, handleLogOut }) => {
  return (
    <div className="quote-list-container">
      <h2>ORDER</h2>
      <table className="quote-table">
        <thead>
          <tr>
            <th>QUOTE ID</th>
            <th>Customer Name</th>
            <th>ASSOC. ID</th>
            <th>STATUS</th>
            <th>Final Price</th>
            <th>CREATED DATE</th>
            <th>ACTION</th>
          </tr>
        </thead>
        <tbody>
          {draftQuotes.map(quote => {
            console.log(quote);
            const customer = customers.find(customer => customer.id === quote.CU_ID);
            const customerName = customer ? customer.name : 'N/A';
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
                <td>{quote.SA_ID}</td>
                <td>{quote.Status}</td>
                <td>{`$${parseFloat(finalPrice).toFixed(2)}`}</td>
                <td>{quote.Created_Date ?quote.Created_Date : 'N/A'}</td>
                <td>
                  <div className="button-group">
                    <button className="Edit" onClick={() => onEditQuote(quote, "draft")}>EDIT</button>
                    <button className="Order" onClick={() => onFinalizeQuote(quote.QU_ID)}>FINALIZE</button>
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

export default DraftQuotesPage;
