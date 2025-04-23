import React, { useState } from 'react';

useEffect(() => {
  fetch("http://localhost:3000/api/quotes")
    .then(res => res.json())
    .then(data => {
      const orderedQuotes = data.data.filter(q => q.Status === "Ordered");
      setQuotes(orderedQuotes);
    })
    .catch(console.error);
}, []);

function QuoteEditor({ lineItems = [], isFinalizeMode = false, mode = "sanction" }) {
  // ===== DISCOUNT STATE =====
  const [discountType, setDiscountType] = useState('percentage');
  const [discountValue, setDiscountValue] = useState('');
  const [finalTotal, setFinalTotal] = useState(0);

  const totalBeforeDiscount = lineItems.reduce((sum, item) => {
    const price = parseFloat(item.price);
    return sum + (isNaN(price) ? 0 : price);
  }, 0);

  const calculateDiscount = () => {
    let discountAmount = 0;

    if (discountType === 'percentage') {
      discountAmount = (parseFloat(discountValue) / 100) * totalBeforeDiscount;
    } else {
      discountAmount = parseFloat(discountValue);
    }

    if (isNaN(discountAmount)) discountAmount = 0;

    const discountedTotal = totalBeforeDiscount - discountAmount;
    setFinalTotal(discountedTotal >= 0 ? discountedTotal : 0);
  };

  // ===== NOTES STATE =====
  const [newNote, setNewNote] = useState('');
  const [notes, setNotes] = useState([]);

  const addNote = () => {
    if (newNote.trim() !== '') {
      setNotes([...notes, { id: Date.now(), text: newNote, editing: false }]);
      setNewNote('');
    }
  };

  const deleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const toggleEditNote = (id) => {
    setNotes(notes.map(note =>
      note.id === id ? { ...note, editing: !note.editing } : note
    ));
  };

  const updateNote = (id, value) => {
    setNotes(notes.map(note =>
      note.id === id ? { ...note, text: value } : note
    ));
  };

  const finalizeQuote = () => {
    const dataToSend = {
      lineItems,
      discount: {
        type: discountType,
        value: discountValue,
      },
      totalBeforeDiscount,
      totalAfterDiscount: finalTotal,
      notes: notes.map(note => note.text)
    };
  };

  // ===== RETURN UI =====
  return (
    <>
    <div>
        <h3>NOTES</h3>
        <div className="add-note">
          <textarea
            rows="3"
            value={newNote}
            placeholder="ADD A NOTE:"
            onChange={(e) => setNewNote(e.target.value)}
          />
          <br />
          <button onClick={addNote}>ADD NOTE</button>
        </div>

        <div className="notes">
          {notes.map((note) => (
            <div key={note.id} className="note">
              {note.editing ? (
                <textarea
                  rows="3"
                  value={note.text}
                  onChange={(e) => updateNote(note.id, e.target.value)}
                />
              ) : (
                <p>{note.text}</p>
              )}
              <button onClick={() => toggleEditNote(note.id)}>
                {note.editing ? 'SAVE' : 'EDIT'}
              </button>
              <button onClick={() => deleteNote(note.id)}>DELETE</button>
            </div>
          ))}
        </div>
      </div>

      <h3>DISCOUNT</h3>
      <select value={discountType} onChange={(e) => setDiscountType(e.target.value)}>
        <option value="percentage">PERCENTAGE (%)</option>
        <option value="fixed">FIXED AMOUNT ($)</option>
      </select>
      <input
        type="number"
        value={discountValue}
        onChange={(e) => setDiscountValue(e.target.value)}
        placeholder="ENTER DISCOUNT"
      />
      <button onClick={calculateDiscount}>APPLY DISCOUNT</button>
      <p>TOTAL BEFORE DISCOUNT: ${totalBeforeDiscount.toFixed(2)}</p>
      <p>TOTAL AFTER DISCOUNT: ${finalTotal.toFixed(2)}</p>

      < hr />
      <button
  onClick={finalizeQuote}
  style={{ marginTop: "1rem", padding: "0.5rem 1rem" }}
>
  {mode === "sanction"
    ? "SANCTION QUOTE"
    : mode === "process"
    ? "PROCESS ORDER"
    : "FINALIZE QUOTE"}
</button>

    </>
  );
}

export default QuoteEditor;
