// src/QuoteList.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Make sure axios is installed: npm install axios

function QuoteList() {
  const [quotes, setQuotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuotes = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Use the correct endpoint for GETTING quotes
        // Adjust if your backend endpoint is different
        const response = await axios.get('http://localhost:3000/api/quotes'); // Example: Using a dedicated GET endpoint

        // --- Check the response structure ---
        // Adjust based on how your API actually returns the list.
        // Option 1: If response.data is directly the array
        if (Array.isArray(response.data)) {
            setQuotes(response.data);
        // Option 2: If response.data has a nested array (like response.data.data)
        } else if (response.data && Array.isArray(response.data.data)) {
             setQuotes(response.data.data);
        // Option 3: Handle unexpected format
        } else {
            console.warn("Unexpected data format received for quotes:", response.data);
            setQuotes([]); // Set empty if format is wrong
            setError("Received unexpected data format from server.");
        }

      } catch (err) {
        console.error("Error fetching quotes:", err);
        setError(err.message || "Failed to fetch quotes.");
        setQuotes([]); // Clear quotes on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuotes();
  }, []); // Empty dependency array means this runs once on component mount

  // --- Helper function to format the discount ---
  const formatDiscount = (amount, isPercentage) => {
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount)) {
      return 'N/A';
    }
    if (isPercentage === 1) { // Assuming 1 means true (percentage)
      return `${numericAmount.toFixed(2)}%`;
    } else {
      return `$${numericAmount.toFixed(2)}`; // Assuming 0 or null means fixed
    }
  };

  // --- Helper function to format dates ---
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      // Adjust options as needed
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (e) {
      console.error("Error formatting date:", dateString, e);
      return dateString; // Return original string if formatting fails
    }
  };


  // --- Render Logic ---
  if (isLoading) {
    return <div>Loading quotes...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error fetching quotes: {error}</div>;
  }

  return (
    <div className="quote-list-container" style={{ marginTop: '20px' }}>
      <h2>Quotes List</h2>
      {quotes.length === 0 ? (
        <p>No quotes found.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid black', textAlign: 'left' }}>
              <th>Quote ID</th>
              <th>Customer ID</th>
              <th>Sales Assoc. ID</th>
              <th>Status</th>
              <th>Discount</th>
              <th>Created Date</th>
              <th>Finalized Date</th>
            </tr>
          </thead>
          <tbody>
            {quotes.map((quote) => (
              <tr key={quote.QU_ID} style={{ borderBottom: '1px solid #ccc' }}>
                <td>{quote.QU_ID}</td>
                <td>{quote.CU_ID}</td>
                <td>{quote.SA_ID}</td>
                <td>{quote.Status || 'Draft'}</td> {/* Display 'Draft' if status is null/empty */}
                <td>{formatDiscount(quote.Discount_Amount, quote.isPercentage)}</td>
                <td>{formatDate(quote.Created_Date)}</td>
                <td>{formatDate(quote.Finalized_Date)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default QuoteList;
