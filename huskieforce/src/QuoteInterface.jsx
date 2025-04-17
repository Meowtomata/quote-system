import React, { useState } from 'react';
import FormLineItem from './FormLineItem.jsx';
import FormSecretNote from './FormSecretNote.jsx';
import FormDiscount from './FormDiscount.jsx'

function QuoteInterface({
  quoteInfo, 
  updateQuoteField, // Generic updater for simple fields
  updateLineItems, // Specific updater for line items
  updateSecretNotes, // Specific updater for secret notes
  handleCreateQuote,
  setShowQuoteInterface,
  isLoading
}) {
  const handleSubmitClick = (event) => {
    console.log(quoteInfo.email);
    console.log(quoteInfo.lineItems); 
    console.log(quoteInfo.secretNotes);
    console.log(quoteInfo.discountAmount);
    console.log(quoteInfo.isPercentage);
    console.log(Date.now());
    handleCreateQuote();
  };

  const handleCloseClick = () => {
    setShowQuoteInterface(false);
  };

  return (
    <div>
      <h2>Quote Interface</h2>
      <h3>Email</h3>
        <textarea
            value={quoteInfo.email} // Read from prop
            onChange={(e) => updateQuoteField('email', e.target.value)} // Call updater prop
        />
      <FormLineItem
        lineItems={quoteInfo.lineItems} 
        setLineItems={updateLineItems} 
      />
      <FormSecretNote 
        secretNotes={quoteInfo.secretNotes}
        setSecretNotes={updateSecretNotes}/>
      <FormDiscount 
        lineItems={quoteInfo.lineItems} 
        discountValue={quoteInfo.discountAmount}
        isPercentage={quoteInfo.isPercentage}
        setDiscountValue={(value) => updateQuoteField('discountAmount', value)}
        setIsPercentage={(value) => updateQuoteField('isPercentage', value)}
      />

      <button className='button' onClick={handleSubmitClick} disabled={isLoading}>
          {isLoading ? 'Submitting...' : 'Submit Quote'}
      </button>
      <button className='button' onClick={handleCloseClick}>Close Quote Interface</button>
    </div>
  );
}

export default QuoteInterface;
