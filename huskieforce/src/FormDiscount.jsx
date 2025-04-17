import React, { useState, useEffect } from 'react'; // Import useEffect

// Assuming props like lineItems, discountValue, setDiscountValue are passed in
function FormDiscount({ lineItems, 
    discountValue, setDiscountValue,
    isPercentage, setIsPercentage }) {

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
    <> {/* Using Fragment shorthand */}
      <h3>DISCOUNT</h3>
      <select
        // Convert boolean state to string "true" or "false" for the value prop
        value={isPercentage.toString()}
        onChange={handleDiscountTypeChange} // Use the updated handler
      >
        {/* Use string "true" and "false" for option values */}
        <option value="true">PERCENTAGE (%)</option>
        <option value="false">FIXED AMOUNT ($)</option>
      </select>
      <input
        type="number"
        value={discountValue} // Use the value directly from props or state
        onChange={(e) => setDiscountValue(e.target.value)} // Use setter from props or state
        placeholder="ENTER DISCOUNT"
        min="0" // Good practice to prevent negative input via UI
      />
      {/* Button is no longer strictly needed if using useEffect, but can keep for manual trigger if desired */}
      {/* <button onClick={calculateDiscount}>APPLY DISCOUNT</button> */}

      <p>TOTAL BEFORE DISCOUNT: ${totalBeforeDiscount.toFixed(2)}</p>
      <p>TOTAL AFTER DISCOUNT: ${finalTotal.toFixed(2)}</p>
    </>
  );
}

export default FormDiscount;
