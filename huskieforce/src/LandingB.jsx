import React, { useState } from 'react';
import QuoteForm from './QuoteForm';
import QuoteEditor from './QuoteEditor';

function LandingB() {
  const [lineItems, setLineItems] = useState([]);

  return (
    <div>
      <QuoteForm lineItems={lineItems} setLineItems={setLineItems} />
      <QuoteEditor lineItems={lineItems} />
    </div>
  );
}

export default LandingB;