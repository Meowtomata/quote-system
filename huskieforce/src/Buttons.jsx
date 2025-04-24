function Buttons({ setViewState }) {
    return (
      <div className="button-group">
        <button className="HFMain" onClick={() => setViewState("draft")}>DRAFT</button>
        <button className="HFSanction" onClick={() => setViewState("sanction")}>SANCTION</button>
        <button className="HFOrdered" onClick={() => setViewState("order")}>ORDER</button>
        <button className="HFAdmin" onClick={() => setViewState("admin")}>ADMINISTRATION</button>
      </div>
    );
  }
  
  export default Buttons;
