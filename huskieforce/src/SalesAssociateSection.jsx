import React, { useState } from "react";
import SalesAssociateForm from "./SalesAssociateForm";

function SalesAssociateSection({salesAssociates, addAssociate, updateAssociate, deleteAssociate}) {
  const [clearFormTrigger, setClearFormTrigger] = useState(0);

  const [editing, setEditing] = useState(null);

  const handleDelete = (id) => {
    deleteAssociate(id); 
  };

  const handleSave = (record) => {
    console.log("--- RUNNING handleSave ---");
    if (editing) {
      console.log("editing is true");
      updateAssociate({ ...record, SA_ID: editing.SA_ID });
      setEditing(null);
    } else {
      console.log("editing is false");
      console.log(record);
      addAssociate(record);
    }
  };

  return (
    <div className="sales-associate-container">
      <h3>ASSOCIATES</h3>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>NAME</th><th>USER ID</th><th>PASSWORD</th><th>COMMISSION</th><th>ADDRESS</th><th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {salesAssociates.map((a) => (
            <tr key={a.SA_ID}>
              <td>{a.Name}</td>
              <td>{a.User_ID}</td>
              <td>{a.Password}</td>
              <td>{`$${parseFloat(a.Accumulated_Commission).toFixed(2)}`}</td>
              <td>{a.Address}</td>
              <td>
                <div className="button-group">
                <button className="Edit" onClick={() => setEditing(a)}>EDIT</button>
                <button className="Delete" onClick={() => handleDelete(a.SA_ID)}>DELETE</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <SalesAssociateForm 
      onSave={handleSave}
      initial={editing} 
      editing={editing}
      onCancel={() => {
        setEditing(null);
        setClearFormTrigger(prev => prev + 1); 
      }}
      clearFormTrigger={clearFormTrigger}       />
    </div>
  );
}

export default SalesAssociateSection;
