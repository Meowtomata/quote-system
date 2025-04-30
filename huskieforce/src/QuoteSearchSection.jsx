import React, { useState } from "react";

function QuoteSearchSection({allQuotes, onEditQuote, customers, allLineItems, salesAssociates}) {
  const [filters, setFilters] = useState({ status: "", associate: "", customer: "", start_date: "",end_date: "" });

  console.log("Value of allQuotes:", allQuotes);

  const filtered = allQuotes.filter((q) =>
    (!filters.status || q.Status === filters.status) &&
    (!filters.start_date || q.Created_Date >= filters.start_date) &&
    (!filters.end_date || q.Created_Date <= filters.end_date ) &&
    (!filters.associate || q.SA_ID?.toString() === filters.associate)
  );

  return (

    <div className="quote-list-container">
      <h3>QUOTE SEARCH</h3>
      <div className="quote-search">
      <input
        placeholder="CUSTOMER:"
        value={filters.customer}
        onChange={(e) => setFilters({ ...filters, customer: e.target.value })}
      />
      <select 
        value={filters.associate}
        onChange={(e) => setFilters({ ...filters, associate: e.target.value })}>
        <option value="">- Sale associate -</option>
        {salesAssociates.map((a)=>(
          <option key={a.User_ID} value={a.User_ID}>
            {a.Name}
          </option>
        ))}
      </select>
      <input
          type="date"
          // need to add labels for this
          value={filters.start_date}
          onChange={(e) => setFilters({ ...filters, start_date: e.target.value })}
      />
      <input
          type="date"
          value={filters.end_date}
          onChange={(e) => setFilters({ ...filters, end_date: e.target.value })}
      />
      <select onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
        <option value="">- STATUS -</option>
        <option value="Finalized">FINALIZED</option>
        <option value="Sanctioned">SANCTIONED</option>
        <option value="Ordered">ORDERED</option>
      </select>
      </div>
      <table className="quote-table">
        <thead>
          <tr>
            <th>QUOTE ID</th>
            <th>CUSTOMER NAME</th>
            <th>ASSOCIATE NAME</th>
            <th>STATUS</th>
            <th>FINAL PRICE</th>
            <th>CREATED DATE</th>
            <th>ACTION</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(quote => {
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
                    <button className="Edit" onClick={() => onEditQuote(quote, "ordered")}>VIEW</button>
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

export default QuoteSearchSection;
