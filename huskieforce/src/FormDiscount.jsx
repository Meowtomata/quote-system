import React, { useState, useEffect } from 'react'; // Import useEffect

// Assuming props like lineItems, discountValue, setDiscountValue are passed in
function FormDiscount({ lineItems = [], 
    discountValue, setDiscountValue,
    isPercentage, setIsPercentage,
    disableEditing }) {

  const [finalTotal, setFinalTotal] = useState(0);

  // --- Calculate total before discount (no change needed here) ---
  const totalBeforeDiscount = lineItems.reduce((sum, item) => {
    const price = parseFloat(item.price);
    return sum + (isNaN(price) ? 0 : price);
  }, 0);

  // --- Update select handler to work with boolean ---
  const handleDiscountTypeChange = (event) => {
    // Convert the string value from the select ("true" or "false") back to a boolean
    const selectedIsPercentage = event.target.value === 'true';
    setIsPercentage(selectedIsPercentage);
  };

  // --- useEffect for automatic calculation ---
  // This hook will run whenever discountValue, isPercentage, or totalBeforeDiscount changes
  useEffect(() => {
    let discountAmount = 0;
    const numericDiscountValue = parseFloat(discountValue); // Parse once

     if (isNaN(numericDiscountValue) || numericDiscountValue < 0) {
        // Handle invalid or negative discount input - treat as zero discount
        setFinalTotal(totalBeforeDiscount);
        return; // Exit early
     }

    if (isPercentage) {
       // Calculate percentage discount
      discountAmount = (numericDiscountValue / 100) * totalBeforeDiscount;
    } else {
       // Apply fixed amount discount
      discountAmount = numericDiscountValue;
    }

    // Ensure discountAmount is a valid number (it should be unless totalBeforeDiscount was NaN, which reduce handles)
    if (isNaN(discountAmount)) discountAmount = 0;

    let discountedTotal = totalBeforeDiscount - discountAmount;

    // Prevent total from going below zero
    discountedTotal = Math.max(0, discountedTotal);

    setFinalTotal(discountedTotal);

  }, [discountValue, isPercentage, totalBeforeDiscount]); // Dependency array


  return (
    <div className="discount-section">
  <h3>DISCOUNT</h3>
  
  <div className="discount-controls">
    <select
      value={isPercentage.toString()}
      onChange={handleDiscountTypeChange}
      disabled={disableEditing}
    >
      <option value="true">PERCENTAGE (%)</option>
      <option value="false">FIXED AMOUNT ($)</option>
    </select>

    <input
      type="number"
      value={discountValue}
      onChange={(e) => setDiscountValue(e.target.value)}
      placeholder="ENTER DISCOUNT"
      min="0"
      disabled={disableEditing}
    />
  </div>

  <div className="discount-summary">
    <p>TOTAL BEFORE DISCOUNT: ${totalBeforeDiscount.toFixed(2)}</p>
    <p>TOTAL AFTER DISCOUNT: ${finalTotal.toFixed(2)}</p>
  </div>
</div>

  );
}

export default FormDiscount;
