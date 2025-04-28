import React, { useState } from 'react';

function FormLineItem({ lineItems = [], setLineItems, disableEditingFields={lineItems:false} }) {
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
          disabled={disableEditingFields.lineItems}
        />
        <input
          type="number"
          name="price"
          value={newItem.price}
          placeholder="PRICE"
          onChange={handleInputChange}
          disabled={disableEditingFields.lineItems}
        />
        <div className="button-groupV2">
          <button className="LIAdd" onClick={addItem} disabled={disableEditingFields.lineItems}>ADD</button>
        </div>
      </div>

      <div className="quote-field">
      <div className="line-items">
        {lineItems.map((item, index) => (
          <div key={item.id || item.description + item.price + index} className="line-item">
            {item.editing ? (
              <>
              <div className="description">
                <input
                  value={item.description}
                  onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                  disabled={disableEditingFields.lineItems}
                />
                </div>
                <input
                  type="number"
                  value={item.price}
                  onChange={(e) => updateItem(item.id, 'price', e.target.value)}
                  disabled={disableEditingFields.lineItems}
                />
              </>
            ) : (
              <>
                <span>{item.description} </span>
                <span>${item.price} </span>
              </>
            )}
            <div className="button-groupV3">
              <button className="LIButton" onClick={() => toggleEdit(item.id)} disabled={disableEditingFields.lineItems}>
                {item.editing ? 'SAVE' : 'EDIT'}
              </button>
              <button className="LIDelete" onClick={() => deleteItem(item.id)} disabled={disableEditingFields.lineItems}>DELETE</button>
            </div>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
}

export default FormLineItem;
