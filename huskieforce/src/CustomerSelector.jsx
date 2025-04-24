import React from 'react';
import PropTypes from 'prop-types';

function CustomerSelector({ customers, selectedID, setCustomerID, onAddNewQuote }) {

  // Basic styling to put items side-by-side
  const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px', // Adds space between elements
    marginBottom: '15px',
  };

  const handleSelectChange = (event) => {
    console.log(event.target.value);
    setCustomerID(parseInt(event.target.value)); // Pass the selected customer ID up
  };

  return (
      <div className="customer-container">
        <label htmlFor="customer-select" style={{ marginRight: '5px' }}>CUSTOMER:</label>
        <select
          id="customer-select"
          value={selectedID}
          onChange={handleSelectChange}
          style={{ minWidth: '150px', padding: '5px' }}
        >
          <option value="" disabled>-- SELECT A CUSTOMER --</option>
          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.name} 
            </option>
          ))}
        </select>
        <button className="ANQuote" onClick={onAddNewQuote}>ADD NEW QUOTE</button>

      <p>TOTAL CUSTOMERS: {customers.length}</p>
    </div>
  );
}

// Define prop types for better component documentation and error checking
CustomerSelector.propTypes = {
  customers: PropTypes.arrayOf(PropTypes.shape({
    CU_ID: PropTypes.number.isRequired, // Or PropTypes.string if ID is a string
    name: PropTypes.string.isRequired,
    // Add other expected customer fields if needed
  })).isRequired,
  onAddNewQuote: PropTypes.func.isRequired,
  selectedCustomerId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired, // ID from the selected option
  onCustomerChange: PropTypes.func.isRequired, // Handler for when selection changes
};

export default CustomerSelector;
