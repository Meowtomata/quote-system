import React, { useState, useEffect } from "react";

function SalesAssociateForm({ onSave, initial, editing, onCancel, clearFormTrigger }) {
  const [form, setForm] = useState({
    name: "",
    userId: "",
    password: "",
    commission: "",
    address: "",
  });

  useEffect(() => {
    if (initial) {
      setForm({
        name: initial.Name,
        userId: initial.User_ID,
        password: initial.Password,
        commission: initial.Accumulated_Commission,
        address: initial.Address,
      });
    }
  }, [initial]);

  useEffect(() => {
    setForm({
      name: "",
      userId: "",
      password: "",
      commission: "",
      address: ""
    });
  }, [clearFormTrigger]);
  
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!form.name || !form.userId || !form.password || !form.address) {
      alert("Please fill in all fields.");
      return;
    }
  
    const associatePayload = {
      name: form.name,
      userId: form.userId,
      password: form.password,
      address: form.address,
      accumulatedCommission: parseFloat(form.commission)
    };
  
    onSave(associatePayload); 
    setForm({ name: "", userId: "", password: "", commission: "", address: "" });
  };
  

  return (
    <div className="admin-container">
      <h3>{editing ? "UPDATE ASSOCIATE INFORMATION" : "ADD ASSOCIATE(S)"}</h3>
      <div className="AddAssoc">
      <input name="name" placeholder="NAME:" value={form.name} onChange={handleChange} />
      <input name="userId" placeholder="USER ID:" value={form.userId} onChange={handleChange} />
      <input name="password" placeholder="PASSWORD:" value={form.password} onChange={handleChange} />
      <input name="commission" placeholder="COMMISSION:" value={form.commission} onChange={handleChange} />
      <input name="address" placeholder="ADDRESS:" value={form.address} onChange={handleChange} />
      <div className="button-group">
      <button className="Add" onClick={handleSubmit}>{initial ? "UPDATE" : "ADD"}</button>
      {editing && (
  <button className="Cancel" onClick={onCancel}>
    CANCEL
  </button>
      )}
      </div>
    </div>
    </div>
  );
}

export default SalesAssociateForm;
