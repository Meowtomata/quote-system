import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import Header from "./HuskieForceHeader.jsx"
import CopyRight from "./HuskieForceCR.jsx";
import Buttons from "./Buttons.jsx";
import QuoteInterface from "./QuoteInterface.jsx";
import QuoteList from "./QuoteList.jsx";
import CustomerSelector from './CustomerSelector.jsx';
import './App.css'
import LoginInterface from "./LoginInterface.jsx";
import AdminDashboard from "./AdminDashboard.jsx";
import DraftQuotesPage from "./DraftQuotesPage.jsx";
import SanctionQuotesPage from "./SanctionQuotesPage.jsx";
import OrderedQuotesPage from "./OrderedQuotesPage.jsx";

function App() {
  // customer array will be retrieved from legacy database
  const [customers, setCustomers] = useState([]); 
  const [salesAssociates, setSalesAssociates] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // State to track loading
  const [error, setError] = useState(null);          // State to track errors
  const [previousView, setPreviousView] = useState("sanction"); // Default to sanction

  const [disableEditingFields, setDisableEditingFields] = useState({
    email: false,
    lineItems: false,
    notes: false
  });
  

  // Bleon's changes to App.jsx
  const [viewState, setViewState] = useState("login");
  const [selectedQuote, setSelectedQuote] = useState(null);

  const [loggedInUserID, setLoggedInUserID] = useState(-1);

  // quotes will be passed down and filtered by status
  const [allQuotes, setAllQuotes] = useState([]);
  const [allLineItems, setAllLineItems] = useState([]); 

  const fetchQuotes = async () => {
    console.log("Fetching all quotes...");
    setIsLoading(true); // Show loading indicator
    setError(null);     // Clear previous errors
    try {
      const quotesRes = await axios.get("http://localhost:3000/api/quotes");
      setAllQuotes(Array.isArray(quotesRes.data.data) ? quotesRes.data.data : []);
      const lineItemsRes = await axios.get("http://localhost:3000/api/line-items");
      setAllLineItems(Array.isArray(lineItemsRes.data.data) ? lineItemsRes.data.data : []);

    } catch (err) {
      console.error("Failed to load quotes:", err);
      setError("Failed to load quotes.");
      setAllQuotes([]); // Clear on error
    } finally {
      setIsLoading(false); // Hide loading indicator
    }
  };

  useEffect(() => {
    fetchQuotes(); // Call the reusable function on mount
}, []); // now re-runs when trigger changes

  
  const handleEditQuote = async (quote, origin) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/quotes/${quote.QU_ID}/details`);
      const { quote: base, lineItems, secretNotes } = response.data;
  
      const mappedQuote = {
        QU_ID: quote.QU_ID,
        customerID: base.CU_ID,
        email: base.Email || '',
        lineItems: lineItems.map(li => ({
          id: li.LI_ID || Date.now(),
          description: li.Description,
          price: li.Price
        })),
        secretNotes: secretNotes.map(sn => ({ text: sn.NoteText, id: sn.Note_ID })),
        discountAmount: parseFloat(base.Discount_Amount) || 0,
        isPercentage: !!base.isPercentage
      };
  
      setQuoteInfo(mappedQuote);
      setIsEditing(true);
      setShowQuoteInterface(true);

      if (origin === "sanction") {
        setDisableEditingFields({ email: true, lineItems: false, notes: false });
      } else if (origin === "order") {
        setDisableEditingFields({ email: true, lineItems: true, notes: true });
      } else {
        setDisableEditingFields({ email: false, lineItems: false, notes: false });
      }

    } catch (err) {
      console.error("Failed to fetch full quote data:", err);
    }
  };

  // ============

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
    "salesAssociateID" : loggedInUserID,
    "customerID" : 1,
    "email" : '',
    "lineItems" : [],
    "secretNotes" : [],
    "discountAmount" : 0,
    "isPercentage" : true,
    });

  const [salesAssociateInfo, setSalesAssociateInfo] = useState({
    "name" : '',
    "userID" : '',
    "password" : '',
    "address" : '',
    "commissionToInsert" : 0
  });


  // when clicking add new quote, display quote interface
  const [showQuoteInterface, setShowQuoteInterface] = useState(false); 
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchAPI = async () => {
      setIsLoading(true);
      setError(null);
      // Clear previous data on new fetch attempt
      setCustomers([]);
      setSalesAssociates([]);

      try {
        // Create promises for both requests
        const customerPromise = axios.get("http://localhost:3000/api/customers");
        const salesAssociatePromise = axios.get("http://localhost:3000/api/sales-associates");

        // Wait for both promises to resolve concurrently
        const [customerResponse, salesAssociateResponse] = await Promise.all([
          customerPromise,
          salesAssociatePromise
        ]);

        // Both requests were successful
        setCustomers(customerResponse.data);
        setSalesAssociates(salesAssociateResponse.data);

        console.log("Customer Data fetched:", customerResponse.data);
        console.log("Sales Associate Data fetched:", salesAssociateResponse.data);

      } catch (err) {
        console.error("Error fetching data:", err);
        // Determine which request failed if needed, or set a general error
        setError(err.message || "Failed to fetch initial data.");
        // Keep data cleared as set at the start of the try block
      } finally {
        setIsLoading(false);
      }
    };

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

    setQuoteInfo(prevQuoteInfo => ({
      ...prevQuoteInfo, 
      email: '',
      lineItems: [],
      secretNotes: [],
      discountAmount: 0,
      isPercentage: true
    }));

    setIsEditing(false);
    setShowQuoteInterface(true);
  };


  const handleCreateQuote = async (quoteId) => {
    console.log("--- handleCreateQuote Executing ---");
    // Now reads the LATEST quoteInfo state directly from App.jsx
    console.log("QuoteInfo at execution time:", JSON.stringify(quoteInfo));

    if (quoteInfo.lineItems.length === 0) { /* validation */ return; }
    console.log("Customer ID: ", quoteInfo.customerID);

    setIsLoading(true);
    // set up information for Quote query
    const payload = {
      salesAssociateId: loggedInUserID,
      customerId: quoteInfo.customerID,
      email: quoteInfo.email, 
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
      await fetchQuotes(); 
      console.log("success?");

      setShowQuoteInterface(false); // Close interface on success

    } catch (err) {
      // ... error handling ... 
       console.error("Error fetching data:", err);
       setError(err.message || "Failed to send quotes data."); // Set error message
    } finally {
       setIsLoading(false);
    }
  };

  const handleUpdateQuote = async () => {
    try {
      const payload = {
        quoteId: quoteInfo.QU_ID, // important: backend expects this
        customerId: quoteInfo.customerID,
        email: quoteInfo.email, 
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
          
      console.log(JSON.stringify(payload));
  
      const response = await fetch(`http://localhost:3000/api/quotes/${payload.quoteId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
  
      if (!response.ok) throw new Error("Failed to update quote");
  
      await fetchQuotes();
      console.log("✅ Quote updated successfully!");
      setShowQuoteInterface(false); // close the modal
    } catch (err) {
      console.error("❌ Error updating quote:", err);
    }
  };

  const handleFinalizeQuote = async (quoteId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/quotes/${quoteId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newStatus: "Finalized" })
      });

  
      if (!response.ok) throw new Error("Failed to update status");
  
      console.log(`✅ Quote ${quoteId} updated to Finalized`);
  
      await fetchQuotes();
  
    } catch (error) {
      console.error("❌ Error updating quote to ordered:", error);
    }
  }; 
  
  

  const handleOrderQuote = async (quote) => {
    try {
      console.log(quote);
      const response = await axios.get(`http://localhost:3000/api/quotes/${quote.QU_ID}/details`);
      const { quote: base, lineItems } = response.data;

      const customer = customers.find(customer => customer.id === base.CU_ID);

      const payload = {
        order: uuidv4(),
        custid: base.CU_ID,
        associate: base.SA_ID, 
        amount: lineItems.reduce((total, item) => total + item.Price, 0),
        name: customer.name,
        processDay: new Date(),
        commission: "106",
      };
      console.log(response);

      console.log("Payload being sent:", JSON.stringify(payload));

      const response2 = await axios.post("https://blitz.cs.niu.edu/purchaseorder", payload);
      // console.log(response2);

      await fetchQuotes();
    } catch (error) {
      console.error("❌ Error updating quote to ordered:", error);
    }
  };
  
  const handleSanctionQuote = async (quoteId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/quotes/${quoteId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newStatus: "Sanctioned" }) // or "Sanctioned"
      });
  
      if (!response.ok) {
        throw new Error("Failed to update status");
      }
  
      // Optionally show confirmation
      console.log("Quote status updated successfully!");
  
      await fetchQuotes();
  
    } catch (error) {
      console.error("Error sanctioning quote:", error);
    }
  };
  
  

  const handleCreateAssociate = async () => {
    console.log("--- handleCreateAssociate Executing ---");
    const payload = {
        "name" : 'Steve',
        "userId" : 'Mine',
        "password" : 'craft',
        "address" : 'Overworld',
        "commissionToInsert" : 10000
        };

    console.log("salesAssociateInfo at execution time:", JSON.stringify(payload));

    setIsLoading(true);

    /*
    const payload = {
      name: salesAssociateInfo.name,
      userId: salesAssociateInfo.userID,
      password: salesAssociateInfo.password,
      address: salesAssociateInfo.address,
      commissionToInsert: salesAssociateInfo.commisionToInsert
    };
    */

    console.log("Payload being sent:", JSON.stringify(payload));

    try {
      const response = await axios.post('http://localhost:3000/api/sales-associates', payload);
    } catch (err) {
      // ... error handling ... 
       console.error("Error fetching data:", err);
       setError(err.message || "Failed to send salesAssociateInfo."); // Set error message
    } finally {
       setIsLoading(false);
    }
  };

  // *** Filter specifically for quotes THAT ARE drafts ***
  const draftedQuotes = allQuotes.filter(q =>
    q.Status && q.Status.toLowerCase() === "draft" 
  );

  // Filter for quotes TO BE ordered (Status = "Sanctioned")
  const finalizedQuotes = allQuotes.filter(q =>
    q.Status && q.Status.toLowerCase() === "finalized"
  );

  // *** Filter specifically for quotes THAT ARE Ordered ***
  const sanctionedQuotes = allQuotes.filter(q =>
    q.Status && q.Status.toLowerCase() === "sanctioned" 
  );

  const currentSalesAssociateName = salesAssociates.find(salesAssociate => salesAssociate.SA_ID == loggedInUserID);

  const handleLogOut = () =>
  {
    setViewState("login");
    setLoggedInUserID(-1);
  }

  return(
    <div className="App-container">
    {viewState !== "login" &&
        <div>
      <p>Logged in as: {currentSalesAssociateName.Name}</p>
      <button onClick={handleLogOut}>Log Out</button>
      <Header />
      <Buttons setViewState={setViewState} />
      </div>
    }
      {viewState === "login" &&
      <LoginInterface 
          salesAssociates={salesAssociates}
          setViewState={setViewState}
          setSalesAssociateID={setLoggedInUserID}
        />
      }
      {viewState === "draft" && 
          <div>
          <CustomerSelector 
              customers={customers} 
              selectedID={quoteInfo.customerID}
              setCustomerID={(value) => updateQuoteField('customerID', value)}
              onAddNewQuote={handleAddNewQuoteClick}
              />
          <DraftQuotesPage 
            onEditQuote={handleEditQuote}
            onFinalizeQuote={handleFinalizeQuote}
            draftQuotes={draftedQuotes}
            allLineItems={allLineItems}
            customers={customers}
          />
          </div>
        }
      {showQuoteInterface && <div className="overlay">   <QuoteInterface
                // Pass the data object
                quoteInfo={quoteInfo}
                // Pass the specific update functions
                updateQuoteField={updateQuoteField}
                updateLineItems={updateLineItems}
                updateSecretNotes={updateSecretNotes}
                handleCreateQuote={handleCreateQuote}
                setShowQuoteInterface={setShowQuoteInterface}
                isEditing={isEditing}
                isLoading={isLoading}
            />
        </div>}
      {viewState === "sanction" && (
  <SanctionQuotesPage 
          onEditQuote={handleEditQuote} 
          onSanctionQuote={handleSanctionQuote}
          finalizedQuotes={finalizedQuotes}
        />
)}

{showQuoteInterface && (
  <div className="overlay">
        <div className="modal-content">
    <QuoteInterface
  quoteInfo={quoteInfo}
  updateQuoteField={updateQuoteField}
  updateLineItems={updateLineItems}
  updateSecretNotes={updateSecretNotes}
  handleCreateQuote={handleCreateQuote}
  handleUpdateQuote={handleUpdateQuote}
  isEditing={isEditing}
  setShowQuoteInterface={setShowQuoteInterface}
  isLoading={isLoading}
  disableEditingFields={disableEditingFields}
/>
  </div>
  </div>
)}


{viewState === "order" && (
  <OrderedQuotesPage
    onEditQuote={handleEditQuote}
    onOrderQuote={handleOrderQuote} 
    sanctionedQuotes={sanctionedQuotes}
  />
)}
   {viewState === "admin" && 
        <AdminDashboard 
            allQuotes={allQuotes} 
            salesAssociates={salesAssociates}
            customers={customers} 
            allLineItems={allLineItems}
            onEditQuote={handleEditQuote}
        />
      }

    <CopyRight />
    </div>
  );
}

export default App;
