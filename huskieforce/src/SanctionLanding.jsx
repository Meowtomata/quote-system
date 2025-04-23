import React, { useState } from "react";
import QuoteForm from "./QuoteForm";
import QuoteEditor from "./QuoteBuilder";

const mockQuotes = [
  {
    id: 1,
    customer: "Mary Beth - Ralston Purina",
    date: "2021-10-26",
    email: "mary@example.com",
    total: 1177.3,
    lineItems: [{ id: 1, name: "Item A", price: "500" }, { id: 2, name: "Item B", price: "677.3" }],
  },
  {
    id: 2,
    customer: "John Doe - Australian Collectors, Co.",
    date: "2021-11-10",
    email: "john@example.com",
    total: 1404.6,
    lineItems: [{ id: 1, name: "New Garage Door", price: "1404.6" }],
  },
];

function SanctionLanding() {
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [lineItems, setLineItems] = useState([]);

  const handleSanctionClick = (quote) => {
    setSelectedQuote(quote);
    setLineItems(quote.lineItems);
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Quote Sanctioning</h2>
      {!selectedQuote ? (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {mockQuotes.map((quote) => (
              <tr key={quote.id}>
                <td>{quote.id} ({quote.date})</td>
                <td>{quote.customer}</td>
                <td>${quote.total.toFixed(2)}</td>
                <td>
                  <button onClick={() => handleSanctionClick(quote)}>Sanction Quote</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <>
          <p>
            <strong>Customer:</strong> {selectedQuote.customer}<br />
            <strong>Email:</strong> {selectedQuote.email}
          </p>
          <QuoteForm lineItems={lineItems} setLineItems={setLineItems} />
          <QuoteEditor lineItems={lineItems} />
          <button onClick={() => setSelectedQuote(null)} style={{ marginTop: '1rem' }}>
            Back to Quote List
          </button>
        </>
      )}
    </div>
  );
}

export default SanctionLanding;
