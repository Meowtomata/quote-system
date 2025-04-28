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
  const [filters, setFilters] = useState({
    status: "",
    associate: "",
    customer: "",
    startDate: "",
    endDate: "",
  });

  const filtered = mockQuotes.filter((q) => {
    const quoteDate = new Date(q.date);
    const startDate = filters.startDate ? new Date(filters.startDate) : null;
    const endDate = filters.endDate ? new Date(filters.endDate) : null;

    return (
      (!filters.status || q.status === filters.status) &&
      (!filters.associate || q.associate.includes(filters.associate)) &&
      (!filters.customer || q.customer.toLowerCase().includes(filters.customer.toLowerCase())) &&
      (!startDate || quoteDate >= startDate) &&
      (!endDate || quoteDate <= endDate)
    );
  });

  return (
    <div className="quotes-container">
      <h3>QUOTE SEARCH</h3>
      <div className="QSearch">
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
          <label>START:</label>
          <input
            type="date"
            placeholder="MM/DD/YYYY"
            value={filters.startDate}
            onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
          />
          <label>END:</label>
          <input
            type="date"
            placeholder="MM/DD/YYYY"
            value={filters.endDate}
            onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
          />

<select onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
          <option value="">- STATUS -</option>
          <option value="finalized">FINALIZED</option>
          <option value="sanctioned">SANCTIONED</option>
          <option value="ordered">ORDERED</option>
        </select>
        
      </div>

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
