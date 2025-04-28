import React, { useState } from "react";
import SalesAssociateForm from "./SalesAssociateForm";

const initialData = [
  { id: 1, name: "Mary Beth", userId: "maryb", password: "1234", commission: 6193.58, address: "123 Main St" },
  { id: 2, name: "John Doe", userId: "johnd", password: "abcd", commission: 1229.40, address: "456 Oak Ave" },
];

function SalesAssociateSection() {
  const [associates, setAssociates] = useState(initialData);
  const [editing, setEditing] = useState(null);

  const handleDelete = (id) => {
    setAssociates(associates.filter((a) => a.id !== id));
  };

  const handleSave = (record) => {
    if (editing) {
      setAssociates(associates.map((a) => (a.id === record.id ? record : a)));
      setEditing(null);
    } else {
      setAssociates([...associates, { ...record, id: Date.now() }]);
    }
  };

  return (
    <div className="sales-associate-container">
      <h3>SALES ASSOCIATES</h3>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>NAME</th><th>USER ID</th><th>PASSWORD</th><th>COMMISSION</th><th>ADDRESS</th><th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {associates.map((a) => (
            <tr key={a.id}>
              <td>{a.name}</td>
              <td>{a.userId}</td>
              <td>{a.password}</td>
              <td>${a.commission.toFixed(2)}</td>
              <td>{a.address}</td>
              <td>
                <div className="button-group">
                <button className="Edit" onClick={() => setEditing(a)}>EDIT</button>
                <button className="Delete" onClick={() => handleDelete(a.id)}>DELETE</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <SalesAssociateForm onSave={handleSave} initial={editing} />
    </div>
  );
}

export default SalesAssociateSection;
