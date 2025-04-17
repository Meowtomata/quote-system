import React, { useEffect, useState } from "react";
import QuoteForm from "./QuoteForm";
import QuoteEditor from "./QuoteBuilder";

function LandingA({ quote = null, isFinalizeMode = false, mode = "sanction" }) {
  const [lineItems, setLineItems] = useState([]);
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (quote) {
      setLineItems(quote.lineItems);
      setEmail(quote.email || "");
    }
  }, [quote]);

  return (
    <div>
      <QuoteForm
        lineItems={lineItems}
        setLineItems={setLineItems}
        initialEmail={email}
      />
      <QuoteEditor
        lineItems={lineItems}
        isFinalizeMode={isFinalizeMode}
        mode={mode}
      />
    </div>
  );
}

export default LandingA;
