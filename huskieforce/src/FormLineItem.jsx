import React, { useState } from 'react';

function FormLineItem({ lineItems = [], setLineItems }) {
  const [newItem, setNewItem] = useState({ description: '', price: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
  };

  const addItem = () => {
    if (newItem.description && newItem.price) {
      setLineItems([
        ...lineItems,
        { ...newItem, id: Date.now(), editing: false }
      ]);
      setNewItem({ description: '', price: '' });
    }
  };

  const deleteItem = (id) => {
    setLineItems(lineItems.filter(item => item.id !== id));
  };

  const toggleEdit = (id) => {
    setLineItems(lineItems.map(item =>
      item.id === id ? { ...item, editing: !item.editing } : item
    ));
  };

  const updateItem = (id, field, value) => {
    setLineItems(lineItems.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  return (
    <div>
      <h3>ITEMS</h3>
      <div className="add-item">
        <input
          type="text"
          name="description"
          value={newItem.description}
          placeholder="DESCRIPTION"
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="price"
          value={newItem.price}
          placeholder="PRICE"
          onChange={handleInputChange}
        />
        <div className="button-groupV2">
          <button className="LIAdd" onClick={addItem}>ADD</button>
        </div>
      </div>

      <div className="line-items">
        {lineItems.map((item, index) => (
          <div key={item.id || item.description + item.price + index} className="line-item">
            {item.editing ? (
              <>
                <input
                  value={item.description}
                  onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                />
                <input
                  type="number"
                  value={item.price}
                  onChange={(e) => updateItem(item.id, 'price', e.target.value)}
                />
              </>
            ) : (
              <>
                <span>{item.description} </span>
                <span>${item.price} </span>
              </>
            )}
            <div className="button-groupV3">
              <button className="LIButton" onClick={() => toggleEdit(item.id)}>
                {item.editing ? 'SAVE' : 'EDIT'}
              </button>
              <button className="LIDelete" onClick={() => deleteItem(item.id)}>DELETE</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FormLineItem;
