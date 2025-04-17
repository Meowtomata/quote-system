import React, { useState } from "react";

const mockQuotes = [
  {
    id: 1,
    customer: "Tesla",
    status: "finalized",
    date: "2024-10-01",
    associate: "Mary Beth",
  },
  {
    id: 2,
    customer: "Apple",
    status: "ordered",
    date: "2024-10-15",
    associate: "John Doe",
  },
];

function QuoteSearchSection() {
  const [filters, setFilters] = useState({ status: "", associate: "", customer: "" });

  const filtered = mockQuotes.filter((q) =>
    (!filters.status || q.status === filters.status) &&
    (!filters.associate || q.associate.includes(filters.associate)) &&
    (!filters.customer || q.customer.toLowerCase().includes(filters.customer.toLowerCase()))
  );

  return (
    <div>
      <h3>QUOTE SEARCH</h3>
      <input
        placeholder="CUSTOMER:"
        value={filters.customer}
        onChange={(e) => setFilters({ ...filters, customer: e.target.value })}
      />
      <input
        placeholder="SALES ASSOCIATE:"
        value={filters.associate}
        onChange={(e) => setFilters({ ...filters, associate: e.target.value })}
      />
      <select onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
        <option value="">- STATUS -</option>
        <option value="finalized">FINALIZED</option>
        <option value="sanctioned">SANCTIONED</option>
        <option value="ordered">ORDERED</option>
      </select>

      <table border="1" cellPadding="10" style={{ marginTop: "1rem" }}>
        <thead>
          <tr>
            <th>ID</th><th>CUSTOMER</th><th>STATUS</th><th>DATE</th><th>ASSOCIATE</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((q) => (
            <tr key={q.id}>
              <td>{q.id}</td>
              <td>{q.customer}</td>
              <td>{q.status}</td>
              <td>{q.date}</td>
              <td>{q.associate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default QuoteSearchSection;
