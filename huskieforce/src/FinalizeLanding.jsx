import React from "react";

const mockQuotes = [
  {
    id: 1,
    customer: "Apple Inc.",
    email: "apple@example.com",
    lineItems: [
      { id: 1, name: "iPad", price: "500" },
      { id: 2, name: "Apple Pencil", price: "100" }
    ]
  },
  {
    id: 2,
    customer: "Tesla",
    email: "tesla@example.com",
    lineItems: [
      { id: 1, name: "Battery", price: "800" }
    ]
  }
];

function FinalizeLanding({ onEditQuote }) {
  return (
    <div style={{ padding: "1rem" }}>
      <h2>FINALIZE QUOTES</h2>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>CUSTOMER</th>
            <th>EMAIL</th>
            <th>ACTION</th>
          </tr>
        </thead>
        <tbody>
          {mockQuotes.map((quote) => (
            <tr key={quote.id}>
              <td>{quote.id}</td>
              <td>{quote.customer}</td>
              <td>{quote.email}</td>
              <td>
                <button onClick={() => onEditQuote(quote, "sanction")}>SANCTION</button>
                <button onClick={() => onEditQuote(quote, "process")} style={{ marginLeft: "0.5rem" }}>
                    PROCESS
                </button>
                </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default FinalizeLanding;
