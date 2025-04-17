function Buttons({ setViewState }) {
    return (
      <>
        <button className="HFMain" onClick={() => setViewState("draft")}>DRAFT</button>
        <button className="HFFinalize" onClick={() => setViewState("finalize")}>FINALIZE</button>
        <button className="HFAdmin" onClick={() => setViewState("admin")}>ADMINISTRATION</button>
      </>
    );
  }
  
  export default Buttons;