import React, { useState } from "react";
import Header from "./HuskieForceHeader.jsx";
import CopyRight from "./HuskieForceCR.jsx";
import Buttons from "./Buttons.jsx";
import LandingA from "./LandingA.jsx";
import FinalizeLanding from "./FinalizeLanding.jsx";
import AdminDashboard from "./AdminDashboard.jsx";



function App() {
  const [viewState, setViewState] = useState("");
  const [selectedQuote, setSelectedQuote] = useState(null);

  const handleEditQuote = (quote, mode ="sanction") => {
    setSelectedQuote({...quote, mode});
    setViewState("edit-finalize");
  };

  return (
    <>
      <Header />
      <Buttons setViewState={setViewState} />
      {viewState === "draft" && <LandingA />}
      {viewState === "finalize" && (
        <FinalizeLanding onEditQuote={handleEditQuote} />
      )}
      {viewState === "edit-finalize" && (
        <LandingA quote={selectedQuote} isFinalizeMode 
        mode={selectedQuote?.mode}/>
      )}
      {viewState === "admin" && <AdminDashboard />}
      <CopyRight />
    </>
  );
}

export default App;
