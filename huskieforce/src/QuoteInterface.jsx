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

  
  
  const isEditMode = !!quoteInfo?.QU_ID; // if quote has a QU_ID, assume edit mode

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
      <h2>Quote</h2>
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

<div button className="button-group">
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
