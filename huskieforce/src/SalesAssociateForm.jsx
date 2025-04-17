import React, { useState, useEffect } from "react";

function SalesAssociateForm({ onSave, initial }) {
  const [form, setForm] = useState({
    name: "",
    userId: "",
    password: "",
    commission: "",
    address: "",
  });

  useEffect(() => {
    if (initial) setForm(initial);
  }, [initial]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSave({ ...form, commission: parseFloat(form.commission) });
    setForm({ name: "", userId: "", password: "", commission: "", address: "" });
  };

  return (
    <div style={{ marginTop: "1rem" }}>
      <input name="name" placeholder="NAME:" value={form.name} onChange={handleChange} />
      <input name="userId" placeholder="USER ID:" value={form.userId} onChange={handleChange} />
      <input name="password" placeholder="PASSWORD:" value={form.password} onChange={handleChange} />
      <input name="commission" placeholder="COMMISSION:" value={form.commission} onChange={handleChange} />
      <input name="address" placeholder="ADDRESS:" value={form.address} onChange={handleChange} />
      <button onClick={handleSubmit}>{initial ? "UPDATE" : "ADD"} ASSOCIATE</button>
    </div>
  );
}

export default SalesAssociateForm;
