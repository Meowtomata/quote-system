import React, { useState } from 'react';
import FormLineItem from './FormLineItem.jsx';
import FormSecretNote from './FormSecretNote.jsx';
import FormDiscount from './FormDiscount.jsx'

function QuoteInterface({
  quoteInfo,
  updateQuoteField,
  updateLineItems,
  updateSecretNotes,
  handleCreateQuote,
  handleUpdateQuote,
  isEditing,
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

  console.log(isEditing);
  const handleCloseClick = () => {
    setShowQuoteInterface(false);
  };
  console.log("Email in quoteInfo:", quoteInfo.email);

  return (
    <div>
      <h2>Quote</h2>
      <h3>Email</h3>
      <div className="quote-field">
        <input
        id="email"
        type="email"
        value={quoteInfo.email}
        onChange={(e) => updateQuoteField('email', e.target.value)}
        placeholder="Enter email"
        />
        </div>

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

<div className="button-group">
<button 
className="Save"
  onClick={isEditing ? handleUpdateQuote : handleCreateQuote}
  disabled={isLoading}
>
  {isEditing ? "SAVE" : "SUBMIT"}
</button>
      <button className="Close" onClick={handleCloseClick}>CLOSE</button>
    </div>
    </div>
  );
}

export default QuoteInterface;
