import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Header from "./HuskieForceHeader.jsx"
import CopyRight from "./HuskieForceCR.jsx";
import Buttons from "./Buttons.jsx";
import QuoteForm from "./QuoteForm.jsx";
import QuoteEditor from "./QuoteEditor.jsx";
import LandingA from "./LandingA.jsx";
import LandingB from "./LandingB.jsx";
import CustomerSelector from './CustomerSelector.jsx';

function App() {
  // customer array will be retrieved from legacy database
  const [customers, setCustomers] = useState([]); 
  const [isLoading, setIsLoading] = useState(false); // State to track loading
  const [error, setError] = useState(null);          // State to track errors
  const [quoteInfo, setQuoteInfo] = useState({
  // fetch data from API
  useEffect(() => {
    const fetchAPI = async () => {
      setIsLoading(true); // Start loading
      setError(null);     // Reset error state
      try {
        const response = await axios.get("http://localhost:3000/api/customers");
        setCustomers(response.data); // Set the fetched data
        console.log("Data fetched:", response.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message || "Failed to fetch customer data."); // Set error message
        setCustomers([]); // Clear data on error
      } finally {
        setIsLoading(false); // Stop loading regardless of success or error
      }
    };
;
    fetchAPI();
  }, []); // Empty dependency array means this runs once on component mount

  // Conditional Rendering based on state
  if (isLoading) {
    return <div>Loading customer data...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  // Handler passed to the button in the child component
  const handleAddNewQuoteClick = () => {
    console.log('Add New Quote button clicked!');
    setShowQuoteInterface(true);
  };

  return(
    <>
    <Header />
    <Buttons />
    <LandingA />
    <LandingB />
    <CustomerSelector 
        customers={customers} 
        selectedID={quoteInfo.customerID}
        setCustomerID={(value) => updateQuoteField('customerID', value)}
        onAddNewQuote={handleAddNewQuoteClick}
        />
    <CopyRight />
    </>
  );
}

export default App
export default App;
