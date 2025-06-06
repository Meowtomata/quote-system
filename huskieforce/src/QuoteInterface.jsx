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
  isLoading,
  disableEditingFields={},
  setDisableEditingFields,
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
      <h2>QUOTE</h2>
      <h3>EMAIL</h3>
      <div className="quote-field">
        <input
        id="email"
        type="email"
        value={quoteInfo.email}
        onChange={(e) => updateQuoteField('email', e.target.value)}
        disabled={disableEditingFields.email}
        placeholder="ENTER EMAIL"
        />
        </div>

      <FormLineItem
        lineItems={quoteInfo.lineItems} 
        setLineItems={updateLineItems} 
        disableEditingFields={disableEditingFields}
      />
      <FormSecretNote 
        secretNotes={quoteInfo.secretNotes}
        setSecretNotes={updateSecretNotes}
        disableEditingFields={disableEditingFields}
        />
        
      <FormDiscount 
        lineItems={quoteInfo.lineItems} 
        discountValue={quoteInfo.discountAmount}
        isPercentage={quoteInfo.isPercentage}
        setDiscountValue={(value) => updateQuoteField('discountAmount', value)}
        setIsPercentage={(value) => updateQuoteField('isPercentage', value)}
        disableEditing={disableEditingFields.discount}
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
