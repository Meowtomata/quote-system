import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Header from "./HuskieForceHeader.jsx"
import CopyRight from "./HuskieForceCR.jsx";
import Buttons from "./Buttons.jsx";
import QuoteInterface from "./QuoteInterface.jsx";
import QuoteList from "./QuoteList.jsx";
import CustomerSelector from './CustomerSelector.jsx';
import './App.css'


function App() {
  // customer array will be retrieved from legacy database
  const [customers, setCustomers] = useState([]); 
  const [isLoading, setIsLoading] = useState(false); // State to track loading
  const [error, setError] = useState(null);          // State to track errors


    // Generic updater for simple fields like email, discountAmount, isPercentage
    const updateQuoteField = useCallback((fieldName, value) => {
        setQuoteInfo(prevQuoteInfo => ({
            ...prevQuoteInfo, // Copy previous state
            [fieldName]: value // Update the specific field using computed property name
        }));
    }, []); // Empty dependency array is fine as setQuoteInfo is stable

    // Specific updater for lineItems array
    const updateLineItems = useCallback((newLineItems) => {
        // You might add validation here if needed (e.g., ensure it's an array)
        setQuoteInfo(prevQuoteInfo => ({
            ...prevQuoteInfo,
            lineItems: newLineItems // Replace the entire lineItems array
        }));
    }, []);

    // Specific updater for secretNotes array
    const updateSecretNotes = useCallback((newSecretNotes) => {
        setQuoteInfo(prevQuoteInfo => ({
            ...prevQuoteInfo,
            secretNotes: newSecretNotes // Replace the entire secretNotes array
        }));
    }, []);

  const [quoteInfo, setQuoteInfo] = useState({
    "customerID" : 1,
    "email" : '',
    "lineItems" : [],
    "secretNotes" : [],
    "discountAmount" : 0,
    "isPercentage" : true,
    });


  // when clicking add new quote, display quote interface
  const [showQuoteInterface, setShowQuoteInterface] = useState(false); 

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


  const handleCreateQuote = async () => {
    console.log("--- handleCreateQuote Executing ---");
    // Now reads the LATEST quoteInfo state directly from App.jsx
    console.log("QuoteInfo at execution time:", JSON.stringify(quoteInfo));

    if (quoteInfo.lineItems.length === 0) { /* validation */ return; }

    setIsLoading(true);
    // set up information for Quote query
    const payload = {
      customerId: quoteInfo.customerID,
      discountAmount: parseFloat(quoteInfo.discountAmount) || 0,
      isPercentage: quoteInfo.isPercentage,
      lineItems: quoteInfo.lineItems.map(item => ({
          description: item.description, // Adjust key if needed
          price: parseFloat(item.price) || 0
      })),
      secretNotes: quoteInfo.secretNotes.map(note => ({
          noteText: note.text // Adjust key if needed
      })),
    };
    console.log("Payload being sent:", JSON.stringify(payload));

    try {
      const response = await axios.post('http://localhost:3000/api/quotes', payload);
      // ... success handling ...
      setShowQuoteInterface(false); 
    } catch (err) {
      // ... error handling ... 
       console.error("Error fetching data:", err);
       setError(err.message || "Failed to fetch customer data."); // Set error message
    } finally {
       setIsLoading(false);
    }
  };

  return(
    <div className="App-container">
    <Header />
    <Buttons />
    <CustomerSelector 
        customers={customers} 
        selectedID={quoteInfo.customerID}
        setCustomerID={(value) => updateQuoteField('customerID', value)}
        onAddNewQuote={handleAddNewQuoteClick}
        />
    <QuoteList />
    {showQuoteInterface && (
        <div className="overlay">
            <QuoteInterface
                // Pass the data object
                quoteInfo={quoteInfo}
                // Pass the specific update functions
                updateQuoteField={updateQuoteField}
                updateLineItems={updateLineItems}
                updateSecretNotes={updateSecretNotes}
                handleCreateQuote={handleCreateQuote}
                setShowQuoteInterface={setShowQuoteInterface}
                isLoading={isLoading}
            />
        </div>
    )}
    <CopyRight />
    </div>
  );
}

export default App;
