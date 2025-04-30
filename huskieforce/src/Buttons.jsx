function Buttons({ setViewState }) {
    return (
      <div className="button-group">
        <button className="HFSanction" onClick={() => setViewState("sanction")}>SANCTION</button>
        <button className="HFOrdered" onClick={() => setViewState("order")}>ORDER</button>
      </div>
    );
  }
  
  export default Buttons;
