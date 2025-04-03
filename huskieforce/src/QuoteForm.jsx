import React, { useState } from 'react';

function QuoteForm({ lineItems = [], setLineItems }) {
    const [newItem, setNewItem] = useState({ name: '', price: '' });
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setNewItem({ ...newItem, [name]: value });
    };
  
    const addItem = () => {
      if (newItem.name && newItem.price) {
        setLineItems([
          ...lineItems,
          { ...newItem, id: Date.now(), editing: false }
        ]);
        setNewItem({ name: '', price: '' });
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
        <h3>LINE ITEMS:</h3>
        <div className="add-item">
          <input
            type="text"
            name="name"
            value={newItem.name}
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
          <button onClick={addItem}>ADD</button>
        </div>
  
        <div className="line-items">
          {lineItems.map((item) => (
            <div key={item.id} className="line-item">
              {item.editing ? (
                <>
                  <input
                    value={item.name}
                    onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                  />
                  <input
                    type="number"
                    value={item.price}
                    onChange={(e) => updateItem(item.id, 'price', e.target.value)}
                  />
                </>
              ) : (
                <>
                  <span>{item.name} </span>
                  <span>${item.price} </span>
                </>
              )}
              <button onClick={() => toggleEdit(item.id)}>
                {item.editing ? 'SAVE' : 'EDIT'}
              </button>
              <button onClick={() => deleteItem(item.id)}>DELETE</button>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  export default QuoteForm;